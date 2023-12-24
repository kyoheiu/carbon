import { useCallback, useEffect, useState } from "react";
import { Item } from "../../types";

export const useItem = (fileName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSave = useCallback(() => {
    const saveData = async () => {
      if (!item) return;
      const res = await fetch(`http://localhost:3000/items/${item.title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: item.title,
          content: currentValue,
        }),
      });
      if (!res.ok) {
        console.error(await res.text());
      } else {
        const j: Item = await res.json();
        console.log(j);
        if (j.title !== item.title) console.error("Cannot resolve file name.");
        setItem(j);
      }
    };
    saveData();
  }, [item, currentValue]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/items/${fileName}`);
      if (!res.ok) {
        console.log("fetch error");
      } else {
        const j = await res.json();
        setItem(j);
        setCurrentValue(j.content);
      }
    };
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((b) => !b);
  }, [setIsEditMode]);

  return {
    isLoading,
    item,
    currentValue,
    setCurrentValue,
    handleSave,
    isEditMode,
    toggleEditMode,
  };
};
