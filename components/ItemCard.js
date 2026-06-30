import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import { removeItem, completeItem, resetItem } from '@/lib/userData';
import { getDaysLeft } from '@/model/item';

export default function ItemCard(props) {
  const item = props.item;
  const [items, setItems] = useAtom(itemsAtom);
  const [completeStatus, setCompleteStatus] = useState(item.complete);
  const [removedStatus, setRemovedStatus] = useState(false);

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
    await completeItem(item.id);
    setCompleteStatus(true);
    if (props.update) {
      props.update();
    }
  }

  async function reset() {
    await resetItem(item.id);
    setCompleteStatus(false);
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
          {statusBadge}
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
          <Button size="sm" variant="outline-danger" onClick={remove}>Remove</Button>
          {completeStatus
            ? <Button size="sm" variant="outline-success" onClick={reset}>Reset</Button>
            : <Button size="sm" variant="success" onClick={complete}>Complete</Button>}
        </div>
      </Card.Body>
    </Card>
  );
}