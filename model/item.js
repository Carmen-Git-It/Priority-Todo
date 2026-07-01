// Item Object definition
// name:                String
// due:                 Date
// urgency:             Number (range[1,5]) - subjective "how pressing"; tiebreaker only
// impact:              Number (range[1,5]) - consequence of doing/not doing the task
// recurrenceInterval:  Number|null - cycle length (e.g. every 2 weeks)
// recurrenceUnit:      String|null - 'day' | 'week' | 'month'; null when not recurring

const msPerDay = 24 * 60 * 60 * 1000;

export class Item {
  constructor(id, name, due, urgency, impact, complete, recurrenceInterval, recurrenceUnit) {
    this.id = id;
    this.name = name;
    this.due = due;
    this.urgency = urgency;
    this.impact = impact;
    this.complete = complete;
    this.recurrenceInterval = recurrenceInterval ?? null;
    this.recurrenceUnit = recurrenceUnit ?? null;
  }

  get recurring() {
    return Boolean(this.recurrenceInterval && this.recurrenceUnit);
  }

  recurrenceLabel() {
    if (!this.recurring) return null;
    const unitLabel = this.recurrenceUnit === 'day' ? 'day'
      : this.recurrenceUnit === 'week' ? 'week'
      : 'month';
    const plural = this.recurrenceInterval === 1 ? '' : 's';
    return `Repeats every ${this.recurrenceInterval} ${unitLabel}${plural}`;
  }
}

// Whole-day difference between the due date and today. A task due today = 0
// (not overdue); yesterday = -1; tomorrow = +1. Comparing calendar days avoids
// a task due today flipping to "overdue" as the day progresses.
export function getDaysLeft(item) {
  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  return Math.round((startOfDay(item.due) - startOfDay(new Date())) / msPerDay);
}

// Compute the next due date for a recurring item by adding one cycle to the
// CURRENT due date (not to "now"). This keeps recurring tasks aligned to their
// cadence rather than drifting based on when the user happened to complete them.
export function nextDueDate(item) {
  const d = new Date(item.due);
  switch (item.recurrenceUnit) {
    case 'day':
      d.setDate(d.getDate() + item.recurrenceInterval);
      break;
    case 'week':
      d.setDate(d.getDate() + item.recurrenceInterval * 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() + item.recurrenceInterval);
      break;
    default:
      return null;
  }
  return d;
}

// Format a Date as 'YYYY-MM-DD' for the Postgres `date` column.
export function formatDueDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Queue Item
// Higher priority value means higher priority; descending priority queue
//
// The score is driven by IMPACT and the DUE DATE. URGENCY is only a tiebreaker:
// it scales the main score by up to ~4%, so it can only reorder tasks whose
// impact + due date already place them within ~4% of each other (i.e. similar
// impact and similar due date). It can never override a meaningful difference
// in impact or due date.
export class QItem {
  constructor(item) {
    this.item = item;
    const daysLeft = getDaysLeft(item);

    // Cubing (impact + 1) gives exponentially higher weight to higher-impact
    // tasks: impact 1 -> 8, 2 -> 27, 3 -> 64, 4 -> 125, 5 -> 216.
    const impactWeight = (item.impact + 1) ** 3;

    let main;
    if (daysLeft <= 0) {
      // Overdue: impact dominates, and priority grows the longer a task is
      // overdue so an item a week overdue outranks one a day overdue.
      main = impactWeight * 10000 + Math.abs(daysLeft) * 1000;
    } else {
      // Sooner-due tasks rank higher; dividing by daysLeft makes priority
      // rise as the due date approaches.
      main = (impactWeight * 1000) / daysLeft;
    }

    // Urgency tiebreaker: 1.00 (urgency 1) .. 1.04 (urgency 5).
    const urgencyFactor = 1 + (item.urgency - 1) * 0.01;

    this.priority = main * urgencyFactor;
  }
}

// Creates a priority queue for item objects
export class ItemQueue {
  constructor(items) {
    this.items = [];
    this.completed = [];
    for (const item in items) {
      if (items[item].complete) {
        var qItem = new QItem(items[item]);
        qItem.priority = 0;
        this.completed.push(qItem);
      } else {
        this.enqueue(items[item]);
      }
    }
  }

  // Adds a new item to the queue
  enqueue(item) {
    // Create a new Q object
    var qItem = new QItem(item);
    var contain = false;

    // Iterate through the item array to add the element at the correct location
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority < qItem.priority) {
        this.items.splice(i, 0, qItem);
        contain = true;
        break;
      }
    }

    // Add to the end if qItem is the highest priority
    if (!contain) {
      this.items.push(qItem);
    }
  }

  // Removes and returns the highest priority item from the queue
  // If empty returns null
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const item = this.items.shift();
    this.completed.push(item);
    return item;
  }

  // Move a specific item (by its Item id) into the completed bucket.
  // Used by the Home page when completing the currently-shown item, which may
  // not be the front item (the user may have skipped past the true top).
  completeById(id) {
    const idx = this.items.findIndex((q) => q.item.id === id);
    if (idx === -1) return this;
    const [qItem] = this.items.splice(idx, 1);
    qItem.priority = 0;
    this.completed.push(qItem);
    return this;
  }

  // Returns the highest priority element
  // Returns null if empty
  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  // Returns true if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Displays the full contents of the queue
  displayQueue() {
    var str = "";
    for (const item in this.items) {
      str += item.item + ", ";
    }
    return str;
  }

  // Remove a specific item from the queue (by its Item id). Does NOT move it
  // to the completed bucket — used when an item is deleted.
  remove(id) {
    this.items = this.items.filter((q) => q.item.id !== id);
    return this;
  }
}