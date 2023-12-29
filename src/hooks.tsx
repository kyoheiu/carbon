import { useCallback, useEffect, useState } from "react";
import { Item } from "./types";
import { toastError } from "./utils";

export const useApp = () => {
  const [items, setItems] = useState<Item[]>();

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
      const res = await fetch("http://localhost:3000/items");
      if (!res.ok) {
        toastError(await res.text());
      } else {
        const j: Item[] = await res.json();
        j.sort((a, b) => b.modified - a.modified);
        setItems(j);
      }
    };
    fetchData();
  }, []);

  return { items, hideItem };
};
