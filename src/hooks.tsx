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
        const j = await res.json();
        console.log(j);
        setItems(j);
      }
    };
    fetchData();
  }, []);

  return { items, setItems };
};
