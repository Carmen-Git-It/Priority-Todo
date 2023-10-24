import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import { useEffect, useState } from 'react';
import ItemCard from '@/components/ItemCard';

export default function Home() {
  const [items, setItems] = useAtom(itemsAtom);
  const [v, update] = useState(false);

  console.log(items.completed);

  function getItem() {
    return items.front().item;
  }

  function updateItem() {
    items.dequeue();
    update(!v);
  }

  return (
    <>
      <h1>Priority Todo List</h1>
      {!items.isEmpty() && <ItemCard item={getItem()} update={updateItem}></ItemCard>}
      {items.isEmpty() && <h3>No tasks Available.</h3>}
    </>
  )
}
