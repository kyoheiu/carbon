import { useCallback, useEffect, useState } from "react";
import { Item } from "../../types";
import { useSearchParams } from "react-router-dom";

export const useItem = (fileName: string) => {
  const [item, setItem] = useState<Item | null>(null);
  const [searchParams, _] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);

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

  const getEditMode = useCallback(() => {
    setIsEditMode(() => true);
  }, [setIsEditMode]);

  useEffect(() => {
    if (!isEditMode && searchParams.get("mode") === "edit") {
      setIsEditMode(true);
    }
  }, [searchParams]);

  return { item, setItem, isEditMode, getEditMode };
};
