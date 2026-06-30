import MainNav from '@/components/MainNav';
import {Container} from 'react-bootstrap';

export default function Layout(props) {
  return (
    <>
      <MainNav />
      <Container className="app-content">
        {props.children}
      </Container>
    </>
  );
}