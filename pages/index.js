import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import { useState } from 'react';
import ItemCard from '@/components/ItemCard';
import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default function Home() {
  const [items, setItems] = useAtom(itemsAtom);
  const [v, update] = useState(false);          // Hack to force component re-render on item update

  function getItem() {
    return items.front().item;
  }

  function updateItem() {
    items.dequeue();
    update(!v);
  }

  return (
    <div className="page-narrow">
      <h1 className="page-title">Up Next</h1>
      <p className="page-subtitle">The single most important thing to do right now.</p>

      {!items.isEmpty() && (
        <ItemCard item={getItem()} update={updateItem} featured />
      )}

      {items.isEmpty() && (
        <div className="empty-state">
          <strong>No tasks available</strong>
          You&apos;re all caught up.
          <br />
          <Link href="/add" passHref legacyBehavior>
            <Button as="a" className="mt-3">Add a task</Button>
          </Link>
        </div>
      )}
    </div>
  );
}