import { useEffect, useState } from "react";
import { Item } from "./types";

export const useApp = () => {
  const [items, setItems] = useState<Item[]>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/items");
      if (!res.ok) {
        console.error("fetch error");
      } else {
        const j: Item[] = await res.json();
        j.sort((a, b) => b.modified - a.modified);
        setItems(j);
      }
    };
    fetchData();
  }, []);

  return { items, setItems };
};
