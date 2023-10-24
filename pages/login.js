import { Card, Form, Alert, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authenticateUser } from '@/lib/authenticate';
import {useAtom} from 'jotai';
import {itemsAtom} from '@/store';
import { getItems } from '@/lib/userData';
import {Item, ItemQueue} from '@/model/item';

export default function Login(props) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState('');
  // const [items, setItems] = useAtom(itemsAtom);

  // // Load items, generate priorityQueue based on items, store queue in atom
  // async function updateItems() {
  //   const itemData = await getItems();
  //   const itemList = [];
  //   console.log(itemData);
  //   if (itemData) {
  //     for (const item in itemData) {
  //       if (!item.complete){
  //         let i = new Item(item._id, item.name, item.due, item.severity, item.complete);
  //         itemList.push(i);
  //       }
  //     }
  //     setItems(new ItemQueue(itemList));
  //   }
  //   else {
  //     setItems(new ItemQueue());
  //   }
  // }

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticateUser(user, password);
      router.push('/');
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <Card bg="light">
        <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
      </Card>
      <br />
      {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label><Form.Control type="text" id="userName" name="userName" onChange={e => setUser(e.target.value)} />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label><Form.Control type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">Login</Button>
      </Form>
    </>
  );
}