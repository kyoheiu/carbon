import { useCallback, useEffect, useState } from "react";
import { Item, ReadResponse } from "./lib/types";
import { toastError } from "./lib/utils";

export const useApp = () => {
  const [items, setItems] = useState<Item[]>();
  const [more, setMore] = useState(false);

  const readAll = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/items_all`);
    if (!res.ok) {
      toastError(await res.text());
    } else {
      const j: Item[] = await res.json();
      setItems(j);
    }
  }, []);

  const hideItem = useCallback(
    (title: string) => {
      setItems((items) => {
        if (!items) return items;
        return items.filter((item) => item.title !== title);
      });
    },
    [setItems]
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/items`);
      if (!res.ok) {
        toastError(await res.text());
      } else {
        const j: ReadResponse = await res.json();
        setItems(j.result);
        setMore(j.more);
      }
    };
    fetchData();
  }, []);

  return { items, hideItem, more, setMore, readAll };
};
