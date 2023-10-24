import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { isAuthenticated } from "@/lib/authenticate";
import { itemsAtom } from "@/store";
import { getItems } from "@/lib/userData";
import { Item, ItemQueue } from "@/model/item";

const PUBLIC_PATHS = ['/register', '/login'];

export default function RouteGuard(props) {
  const [items, setItems] = useAtom(itemsAtom);
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();

  // Load items, generate priorityQueue based on items, store queue in atom
  async function updateItems() {
    const itemData = await getItems();
    const itemList = [];
    if (itemData) {
      for (const item in itemData) {
        if (!itemData[item].complete){
          let i = new Item(itemData[item]._id, itemData[item].name, new Date(itemData[item].due), itemData[item].severity, itemData[item].complete);
          itemList.push(i);
        }
      }
      setItems(new ItemQueue(itemList));
    }
    else {
      setItems(new ItemQueue());
    }
  }

  useEffect(() => {
    if (isAuthenticated()) {
      updateItems();
    }
    authCheck(router.pathname);

    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  },[router.events, router.pathname]);

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