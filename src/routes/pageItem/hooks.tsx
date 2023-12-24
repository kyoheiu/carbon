import { useEffect, useState } from "react";
import { Item } from "../../types";

export const useItem = (fileName: string) => {
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/items/${fileName}`);
      if (!res.ok) {
        console.log("fetch error");
      } else {
        const j = await res.json();
        setItem(j);
      }
    };
    fetchData();
  }, []);

  return { item, setItem };
};
