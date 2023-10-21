import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';

export default function MainNav() {

  return (
    <>
      <Navbar expand="lg" className="fixed-top navbar-dark bg-primary">
        <Container>
          <Navbar.Brand>Priority Todo</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" legacyBehavior passHref><Nav.Link>Home</Nav.Link></Link>
              <Link href="/add" legacyBehavior passHref><Nav.Link>Add</Nav.Link></Link>
              <Link href="/list" legacyBehavior passHref><Nav.Link>List</Nav.Link></Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br/><br/>
    </>
  );
}