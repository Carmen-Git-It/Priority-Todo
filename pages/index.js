import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import { useState } from 'react';
import ItemCard from '@/components/ItemCard';
import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default function Home() {
  const [items, setItems] = useAtom(itemsAtom);
  const [, force] = useState(false);          // Hack to force re-render on in-place mutation
  const [skipOffset, setSkipOffset] = useState(0);
  const [prevItemsRef, setPrevItemsRef] = useState(items);

  // Skip is temporary: reset to the true top whenever the queue is replaced
  // (initial load, RouteGuard refresh, or recurring-task completion which calls
  // refreshItemsAtom with a brand-new ItemQueue). Adjusting state during render
  // when a dependency changed is the React 19-recommended replacement for the
  // old "reset state in an effect" pattern.
  if (items !== prevItemsRef) {
    setPrevItemsRef(items);
    setSkipOffset(0);
  }

  const pending = items.items;
  const shownQ = pending[skipOffset] ?? null;

  function getItem() {
    return shownQ.item;
  }

  function updateItem() {
    // The currently-shown item was completed. Move that specific item (which
    // may not be the front, if the user skipped) into the completed bucket and
    // jump back to the true top priority.
    if (shownQ) {
      setItems(items.completeById(shownQ.item.id));
    }
    setSkipOffset(0);
    force((v) => !v);
  }

  function skip() {
    setSkipOffset((o) => Math.min(o + 1, pending.length - 1));
  }

  function back() {
    setSkipOffset((o) => Math.max(0, o - 1));
  }

  return (
    <div className="page-narrow">
      <h1 className="page-title">Up Next</h1>
      <p className="page-subtitle">The single most important thing to do right now.</p>

      {shownQ && (
        <>
          <ItemCard key={getItem().id} item={getItem()} update={updateItem} featured />

          {pending.length > 1 && (
            <div className="d-flex align-items-center justify-content-between mt-3 skip-bar">
              <Button size="sm" variant="outline-secondary" onClick={back} disabled={skipOffset === 0}>
                Back
              </Button>
              <span className="text-muted small">
                {skipOffset + 1} of {pending.length}
                {skipOffset > 0 && <span className="skip-bar__hint"> · skipped</span>}
              </span>
              <Button size="sm" variant="outline-primary" onClick={skip} disabled={skipOffset >= pending.length - 1}>
                Skip
              </Button>
            </div>
          )}
        </>
      )}

      {!shownQ && (
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