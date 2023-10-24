import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  let token = readToken();

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  return (
    <>
      <Navbar expand="lg" className="fixed-top navbar-dark bg-primary" expanded={isExpanded}>
        <Container>
          <Navbar.Brand>{token ? token.userName : 'Priority Todo'}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => {setIsExpanded(!isExpanded)}}/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" legacyBehavior passHref><Nav.Link active={router.pathname === "/"} onClick={() => {setIsExpanded(false)}}>Home</Nav.Link></Link>
              <Link href="/add" legacyBehavior passHref><Nav.Link active={router.pathname === "/add"} onClick={() => {setIsExpanded(false)}}>Add</Nav.Link></Link>
              <Link href="/list" legacyBehavior passHref><Nav.Link active={router.pathname === "/list"} onClick={() => {setIsExpanded(false)}}>List</Nav.Link></Link>
            </Nav>
            &nbsp;
            {token && 
            <Nav>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
            }
            {!token && 
              <Nav>
                <Link href="/register" legacyBehavior passHref><Nav.Link onClick={()=>{setIsExpanded(false)}} active={router.pathname === "/register"}>Register</Nav.Link></Link>
                <Link href="/login" legacyBehavior passHref><Nav.Link onClick={()=>{setIsExpanded(false)}} active={router.pathname === "/login"}>Login</Nav.Link></Link>
              </Nav>}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br/><br/>
    </>
  );
}