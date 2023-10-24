import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import useSWR from 'swr';
import Error from 'next/error';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ItemCard from '@/components/ItemCard';

export default function Home() {
  const [items, setItems] = useAtom(itemsAtom);

  function getItem() {
    return items.front().item;
  }

  function completeItem() {
    let item = items.dequeue();
  }

  return (
    <>
      <h1>Priority Todo List</h1>
      {!items.isEmpty() && <ItemCard item={getItem()}></ItemCard>}
      {items.isEmpty() && <h3>No tasks Available.</h3>}
    </>
  )
}
