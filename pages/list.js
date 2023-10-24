import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useAtom } from 'jotai';
import { itemsAtom } from '@/store';
import ItemCard from '@/components/ItemCard';

export default function List(props) {
  const [items, setItems] = useAtom(itemsAtom);

  if (items && !items.isEmpty()) {
    let itemList = [];
    items.items.forEach((item) => {
      item = item.item;
      itemList.push(
        <Col lg={3} eventKey={item.id} key={item.id}>
          <ItemCard item={item} />
        </Col>
      );
    });
    return (
      <>
        <Row className='gy-4'>
          {itemList}
        </Row>
      </>
    );
  } else {
    return (
      <Row className="gy-4">
        <h3>No tasks avilable.</h3>
      </Row>
    );
  }
}