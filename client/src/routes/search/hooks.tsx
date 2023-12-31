import { useCallback, useEffect, useState } from "react";
import { Item } from "../../lib/types";
import { toastError } from "../../lib/utils";

export const useSearch = (query: string) => {
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
    const searchItem = async (q: string) => {
      const res = await fetch(`/api/search`, {
        method: "POST",
        body: q,
      });
      if (!res.ok) {
        toastError(await res.text());
      } else {
        const j = await res.json();
        setItems(j);
      }
    };
    searchItem(query);
  }, []);

  return { items, hideItem };
};
