import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "@/context/SupabaseAuthProvider";
import { itemsAtom } from "@/store";
import { refreshItemsAtom } from "@/lib/userData";
import { ItemQueue } from "@/model/item";

const PUBLIC_PATHS = ['/register', '/login'];

export default function RouteGuard(props) {
  const { user, loading } = useAuth();
  const [items, setItems] = useAtom(itemsAtom);

  const router = useRouter();
  const path = router.pathname.split('?')[0];
  const isPublicPath = PUBLIC_PATHS.includes(path);
  // Derived during render: a route is viewable while public OR once signed in.
  const authorized = !loading && (isPublicPath || !!user);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (!isPublicPath) {
        router.push('/login');
      } else {
        setItems(new ItemQueue());
      }
      return;
    }

    let cancelled = false;
    async function updateItems() {
      // refreshItemsAtom re-fetches + rebuilds the queue; ignore results if a
      // later effect superseded this one.
      if (cancelled) return;
      await refreshItemsAtom((next) => {
        if (!cancelled) setItems(next);
      });
    }
    updateItems();

    return () => { cancelled = true; };
  }, [user, loading, isPublicPath, router, setItems]);

  if (loading || !authorized) {
    return null;
  }

  return <>{props.children}</>
}