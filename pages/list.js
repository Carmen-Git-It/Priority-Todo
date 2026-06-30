import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import ItemCard from '@/components/ItemCard';
import { useEffect } from 'react';

export default function List(props) {
  const [items, setItems] = useAtom(itemsAtom);

  useEffect(() => { },[items.items, items.completed]);

  const all = items.items.concat(items.completed);

  return (
    <>
      <h1 className="page-title">All Tasks</h1>
      <p className="page-subtitle">{all.length} {all.length === 1 ? 'item' : 'items'} total</p>

      {all.length === 0 && (
        <div className="empty-state">
          <strong>No tasks yet</strong>
          Add your first task to start prioritizing.
          <br />
          <Link href="/add" passHref legacyBehavior>
            <Button as="a" className="mt-3">Add a task</Button>
          </Link>
        </div>
      )}

      {all.length > 0 && (
        <Row className="g-4">
          {all.map((item) =>
            <Col xs={12} sm={6} lg={4} xl={3} key={item.item.id}>
              <ItemCard item={item.item} />
            </Col>
          )}
        </Row>
      )}
    </>
  );
}