import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function updateItems() {
      try {
        const itemData = await getItems();
        const itemList = (itemData || []).map((row) =>
          new Item(row.id, row.name, parseDue(row.due), row.urgency, row.impact, row.complete)
        );
        setItems(new ItemQueue(itemList));
      } catch (err) {
        setItems(new ItemQueue());
      }
    }

    if (loading) return;

    const path = router.pathname.split('?')[0];
    if (!user && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push('/login');
      return;
    }

    setAuthorized(true);

    if (user) {
      updateItems();
    } else {
      setItems(new ItemQueue());
    }
  }, [user, loading, router.pathname, router, setItems]);

  if (loading || (!authorized && !PUBLIC_PATHS.includes(router.pathname))) {
    return null;
  }

  return <>{authorized && props.children}</>
}