import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "@/context/SupabaseAuthProvider";
import { itemsAtom } from "@/store";
import { getItems } from "@/lib/userData";
import { Item, ItemQueue } from "@/model/item";

const PUBLIC_PATHS = ['/register', '/login'];

function parseDue(value) {
  // Postgres `date` columns come back as 'YYYY-MM-DD'; parse as local midnight
  // so .toDateString() renders the same day the user picked.
  return new Date(value + 'T00:00:00');
}

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
      try {
        const itemData = await getItems();
        if (cancelled) return;
        const itemList = (itemData || []).map((row) =>
          new Item(row.id, row.name, parseDue(row.due), row.urgency, row.impact, row.complete)
        );
        setItems(new ItemQueue(itemList));
      } catch (err) {
        if (!cancelled) setItems(new ItemQueue());
      }
    }
    updateItems();

    return () => { cancelled = true; };
  }, [user, loading, isPublicPath, router, setItems]);

  if (loading || !authorized) {
    return null;
  }

  return <>{props.children}</>
}