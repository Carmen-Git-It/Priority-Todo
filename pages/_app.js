import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '@/components/Layout'
import RouteGuard from '@/components/RouteGuard';
import { SupabaseAuthProvider } from '@/context/SupabaseAuthProvider';

export default function App({ Component, pageProps }) {
  return (
    <SupabaseAuthProvider>
      <RouteGuard>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </SupabaseAuthProvider>
  );
}