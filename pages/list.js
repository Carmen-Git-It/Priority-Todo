import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import ItemCard from '@/components/ItemCard';
import { useEffect, useState } from 'react';

export default function List(props) {
  const [items, setItems] = useAtom(itemsAtom);
  
  useEffect(() => { },[items.items, items.completed]);

  return (
    <>
      <Row className='gy-4'>
        {items.items.concat(items.completed).map((item) => 
          <Col lg={3} key={item.item.id}>
            <ItemCard item={item.item} />
          </Col>
        )}
      </Row>
    </>
  );
}