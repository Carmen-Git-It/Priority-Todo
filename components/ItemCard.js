import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import { removeItem, completeItem, resetItem, addItem, refreshItemsAtom } from '@/lib/userData';
import { getDaysLeft, nextDueDate, formatDueDate } from '@/model/item';

export default function ItemCard(props) {
  const item = props.item;
  const [items, setItems] = useAtom(itemsAtom);
  const [completeStatus, setCompleteStatus] = useState(item.complete);
  const [removedStatus, setRemovedStatus] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    await removeItem(item.id);
    setItems(items.remove(item.id));
    if (props.update) {
      props.update();
    } else {
      setRemovedStatus(true);
    }
  }

  async function complete() {
    if (busy) return;
    setBusy(true);
    try {
      await completeItem(item.id);
      setCompleteStatus(true);

      // Recurring items spawn the next occurrence on completion. The new due
      // date is the OLD due date + one cycle (not "now + cycle") so the cadence
      // stays stable regardless of when the user happened to complete it.
      if (item.recurring) {
        const next = nextDueDate(item);
        if (next) {
          await addItem(
            item.name,
            formatDueDate(next),
            item.urgency,
            item.impact,
            item.recurrenceInterval,
            item.recurrenceUnit,
          );
        }
        // Refresh the whole queue so the new instance appears (in both the
        // Home "Up Next" view and the List view) and the just-completed item
        // moves into the completed bucket.
        await refreshItemsAtom(setItems);
      } else if (props.update) {
        props.update();
      }
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (busy) return;
    setBusy(true);
    try {
      await resetItem(item.id);
      setCompleteStatus(false);
    } finally {
      setBusy(false);
    }
  }

  const daysLeft = getDaysLeft(item);
  const overdue = !completeStatus && daysLeft < 0;
  const cardClass = [
    "prior-card",
    removedStatus ? "invisible" : "",
    completeStatus ? "is-complete" : overdue ? "is-overdue" : "",
    props.featured ? "shadow-lg" : "",
  ].filter(Boolean).join(" ");

  let statusBadge;
  if (completeStatus) {
    statusBadge = <Badge bg="success">Completed</Badge>;
  } else if (overdue) {
    statusBadge = <Badge bg="danger">Overdue</Badge>;
  } else {
    statusBadge = <Badge bg="secondary">Incomplete</Badge>;
  }

  return (
    <Card className={cardClass}>
      <Card.Body>
        <div className="prior-card__header">
          <Card.Title>{item.name ? item.name : "No name for task"}</Card.Title>
          <div className="d-flex align-items-center gap-1 flex-wrap justify-content-end">
            {item.recurring && <Badge bg="info">{item.recurrenceLabel()}</Badge>}
            {statusBadge}
          </div>
        </div>

        <div className="prior-card__meta">
          <div className="prior-card__meta-row">
            <span className="prior-card__meta-label">Due</span>
            <span className="prior-card__meta-value">{item.due ? item.due.toDateString() : "—"}</span>
          </div>
          <div className="prior-card__meta-row">
            <span className="prior-card__meta-label">Impact</span>
            <span className="prior-card__meta-value">{item.impact ? `${item.impact} / 5` : "—"}</span>
          </div>
          <div className="prior-card__meta-row">
            <span className="prior-card__meta-label">Urgency</span>
            <span className="prior-card__meta-value">{item.urgency ? `${item.urgency} / 5` : "—"}</span>
          </div>
        </div>

        <div className="prior-card__actions">
          <Button size="sm" variant="outline-danger" onClick={remove} disabled={busy}>Remove</Button>
          {completeStatus
            ? <Button size="sm" variant="outline-success" onClick={reset} disabled={busy}>Reset</Button>
            : <Button size="sm" variant="success" onClick={complete} disabled={busy}>{busy ? '…' : 'Complete'}</Button>}
        </div>
      </Card.Body>
    </Card>
  );
}