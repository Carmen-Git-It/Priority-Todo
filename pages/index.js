import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import useSWR from 'swr';
import Error from 'next/error';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Home() {
  const [itemList, setItemlist] = useState();
  const [items, setItems] = useAtom(itemsAtom);

  function getItem() {
    return items.front();
  }

  function completeItem() {
    let item = items.dequeue();
  }

  return (
    <>
      <h1>Priority Todo List</h1>
      <p>{getItem()}</p>
    </>
  )
}
