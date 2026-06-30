import { Form, Alert, Button } from 'react-bootstrap';
import { useState } from 'react';
import { registerUser } from '@/lib/authenticate';
import { useRouter } from 'next/router';

export default function Register(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setWarning('');
    setInfo('');
    try {
      const result = await registerUser(email, password, password2);
      if (result?.pendingConfirmation) {
        setInfo('Confirmation email sent. Check your inbox, then log in.');
        router.push('/login');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <div className="page-narrow">
      <div className="auth-hero">
        <h2>Register</h2>
        <p>Create a new account to start prioritizing.</p>
      </div>

      {warning && <Alert variant="danger" className="mb-3">{warning}</Alert>}
      {info && <Alert variant="success" className="mb-3">{info}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control type="password" id="password2" name="password2" required onChange={e => setPassword2(e.target.value)} />
        </Form.Group>

        <Button type="submit">Register</Button>
      </Form>
    </div>
  );
}