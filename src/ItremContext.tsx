import { createContext, useCallback, useContext, useState } from "react";
import { Item } from "./types";

type ctxValue = {
  isLoading: boolean;
  useFetchItem: (arg: string) => Promise<void>;
  item: Item | null;
  currentValue: string;
  setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
};

const ItemContext = createContext<ctxValue | null>(null);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
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

  const toggleEditMode = useCallback(() => {
    setIsEditMode((b) => !b);
  }, [setIsEditMode]);

  const useFetchItem = useCallback(
    async (fileName: string) => {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3000/items/${fileName}`);
      if (!res.ok) {
        console.log("fetch error");
      } else {
        const j = await res.json();
        setItem(j);
        setCurrentValue(j.content);
      }
      setIsLoading(false);
    },
    [setIsLoading, setItem, setCurrentValue]
  );

  const ctxValue: ctxValue = {
    isLoading,
    useFetchItem,
    item,
    currentValue,
    setCurrentValue,
    handleSave,
    isEditMode,
    toggleEditMode,
  };

  return (
    <ItemContext.Provider value={ctxValue}>{children}</ItemContext.Provider>
  );
};

export const useItem = () => {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw Error("Cannot access to the item context.");
  }
  return ctx;
};
