import { createContext, useCallback, useContext, useState } from "react";
import { Item } from "../lib/types";
import { toastError } from "../lib/utils";

type ctxValue = {
  isLoading: boolean;
  useFetchItem: (arg: string) => Promise<void>;
  item: Item | null;
  currentValue: string;
  setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const reg = /^\s*([-\+\*] |\d+[\.\)] )/g;

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
        toastError(await res.text());
      } else {
        const j: Item = await res.json();
        if (j.title !== item.title) toastError("Cannot resolve file name.");
        setItem(j);
      }
    };
    saveData();
  }, [item, currentValue]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((b) => !b);
  }, [setIsEditMode]);

  const setListMarker = (
    el: HTMLTextAreaElement,
    captured: string,
    cursorPos: number
  ) => {
    setTimeout(() => {
      setCurrentValue(
        (v) => v.slice(0, cursorPos) + captured + v.slice(cursorPos)
      );
    }, 5);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = cursorPos + captured.length;
    }, 10);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleSave();
      } else if (e.key === "Enter") {
        const el = document.getElementById("textarea") as HTMLTextAreaElement;
        if (el) {
          const cursorPos = el.selectionEnd;
          for (let i = cursorPos - 1; i >= 0; i--) {
            const char = currentValue[i];
            if (char === `\n`) {
              const line = currentValue.substring(i + 1, cursorPos + 1);
              const matched = line.match(reg);
              if (matched !== null) {
                setListMarker(el, matched[0], cursorPos + 1);
              }
              break;
            } else if (i === 0) {
              const line = currentValue.substring(i, cursorPos + 1);
              const matched = line.match(reg);
              if (matched !== null) {
                setListMarker(el, matched[0], cursorPos + 1);
              }
              break;
            } else {
              continue;
            }
          }
        }
      }
    },
    [currentValue, handleSave]
  );

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
    handleKeyDown,
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
