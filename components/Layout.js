import MainNav from '@/components/MainNav';
import {Container} from 'react-bootstrap';

export default function Layout(props) {
  return (
    <>
      <MainNav />
      <br />
      <Container>
        {props.children}
      </Container>
      <br />
    </>
  );
}