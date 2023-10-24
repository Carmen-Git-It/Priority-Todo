// Item Object definition
// name: String
// due: Date
// severity: Number (range[1,5])

const msPerDay = 24 * 60 * 60 * 1000;

export class Item {
  constructor(id, name, due, severity, complete) {
    this.id = id;
    this.name = name;
    this.due = due;
    this.severity = severity;
    this.complete = complete;
  }
}

export function getDaysLeft(item) {
  return (item.due.getTime() - new Date().getTime()) / msPerDay;
}

// Queue Item
// Higher priority value means higher priority; descending priority queue
export class QItem {
  constructor(item) {
    this.item = item;
    const daysLeft = getDaysLeft(item);

    // Make sure overdue 5 priority items are still higher priority than upcoming 5 priority, but give more weight to overdue items.
    if (daysLeft <= 0) {
      this.priority = ((item.severity ** 2) * 10000);
    } else {
      // Severity cubed gives exponentially higher priority to items of a higher severity
      this.priority = ((item.severity ** 3) * 1000) / daysLeft;
    }
  }
}

// Creates a priority queue for item objects
export class ItemQueue {
  constructor(items) {
    this.items = [];
    for (const item in items) {
      this.enqueue(items[item]);
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
    return this.items.shift();
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

  remove(id) {
    this.items = this.items.filter((i) => i.id != id);
    return this;
  }
}