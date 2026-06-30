import { Form, Alert, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authenticateUser } from '@/lib/authenticate';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState('');

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setWarning('');
    try {
      await authenticateUser(email, password);
      router.push('/');
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <div className="page-narrow">
      <div className="auth-hero">
        <h2>Login</h2>
        <p>Enter your login information below.</p>
      </div>

      {warning && <Alert variant="danger" className="mb-3">{warning}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
}