import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import { removeItem, completeItem, resetItem } from '@/lib/userData';
import { getDaysLeft } from '@/model/item';

export default function ItemCard(props) {
  const item = props.item;
  const [items, setItems] = useAtom(itemsAtom);
  const [completeStatus, setCompleteStatus] = useState(item.complete);
  const [removedStatus, setRemovedStatus] = useState(false);

  useEffect(() => {
    setCompleteStatus(item.complete);
  },[item]);

  async function remove() {
    await removeItem(item.id);

    setItems(items.remove(item.id));
    setRemovedStatus(true);
  }

  async function complete() {
    await completeItem(item.id);
    setCompleteStatus(true);
    item.complete = true;
  }

  async function reset() {
    await resetItem(item.id);
    setCompleteStatus(false);
    item.complete = false;
  }

  return (
    <>
      <Card className={removedStatus ? "invisible" : ""}>
        <Card.Body>
          <Card.Title>{item.name ? item.name : "No name for task"}</Card.Title>
          <Card.Text>
            <strong>Due: </strong>{item.due ? item.due.toDateString() : "Undefined"} <br />
            <strong>Status: </strong>{item.complete ? "Completed" : getDaysLeft(item) < 0 ? "Overdue" : "Incomplete"} <br />
            <strong>Importance: </strong>{item.severity ? item.severity : "Undefined"}
          </Card.Text>
          <Button variant="primary" onClick={remove}><strong>Remove</strong></Button>
          <Button variant="primary" onClick={completeStatus ? reset : complete}><strong>{completeStatus ? "Reset" : "Complete"}</strong></Button>
        </Card.Body>
      </Card>
    </>
  );
}