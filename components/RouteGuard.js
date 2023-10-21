
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/authenticate";

const PUBLIC_PATHS = ['/register', '/login', '/'];

export default function RouteGuard(props) {
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    authCheck(router.pathname);

    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  function authCheck(url){
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)){
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }

  return <>{authorized && props.children}</>
}