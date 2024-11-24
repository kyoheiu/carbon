import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Item } from "../lib/types";
import { toastError } from "../lib/utils";

type ctxValue = {
  item: Item | null;
  fetchError: string | null;
  currentValue: string;
  setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const reg = /^\s*([-+*] |\d+[.)] )/g;

const ItemContext = createContext<ctxValue | null>(null);

export const ItemProvider = ({
  children,
  fileName,
}: {
  children: React.ReactNode;
  fileName: string;
}) => {
  const [item, setItem] = useState<Item | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSave = useCallback(() => {
    const saveData = async () => {
      if (!item) return;
      const res = await fetch(`/api/items/${item.title}`, {
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

  const setListMarker = useCallback(
    (el: HTMLTextAreaElement, cursorPos: number, captured: string) => {
      setTimeout(() => {
        setCurrentValue(
          (v) => v.slice(0, cursorPos) + captured + v.slice(cursorPos)
        );
      }, 5);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = cursorPos + captured.length;
      }, 10);
    },
    []
  );

  const indent = useCallback(
    (el: HTMLTextAreaElement, cursorPos: number, originalPos: number) => {
      setCurrentValue((v) => v.slice(0, cursorPos) + "\t" + v.slice(cursorPos));
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = originalPos + 1;
      }, 5);
    },
    []
  );

  const unIndent = useCallback(
    (el: HTMLTextAreaElement, cursorPos: number, originalPos: number) => {
      const v = currentValue[cursorPos];
      if (v === "\t") {
        setCurrentValue((v) => v.slice(0, cursorPos) + v.slice(cursorPos + 1));
        setTimeout(() => {
          el.selectionStart = el.selectionEnd = originalPos - 1;
        }, 5);
      }
    },
    [currentValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        if (e.ctrlKey) {
          //save
          handleSave();
        } else {
          //Add list marker if you're in the list now
          const el = document.getElementById("textarea") as HTMLTextAreaElement;
          if (el) {
            const cursorPos = el.selectionEnd;
            for (let i = cursorPos - 1; i >= 0; i--) {
              if (i === 0) {
                const line = currentValue.substring(i, cursorPos + 1);
                const matched = line.match(reg);
                if (matched !== null) {
                  setListMarker(el, cursorPos + 1, matched[0]);
                }
                break;
              }
              const char = currentValue[i];
              if (char === `\n`) {
                const line = currentValue.substring(i + 1, cursorPos + 1);
                const matched = line.match(reg);
                if (matched !== null) {
                  setListMarker(el, cursorPos + 1, matched[0]);
                }
                break;
              } else {
                continue;
              }
            }
          }
        }
      } else if (e.key === "Tab" && e.shiftKey) {
        //unIndent
        e.preventDefault();
        const el = document.getElementById("textarea") as HTMLTextAreaElement;
        if (el) {
          const cursorPos = el.selectionEnd;
          for (let i = cursorPos - 1; i >= 0; i--) {
            if (i === 0) {
              unIndent(el, i, cursorPos);
              break;
            }
            const char = currentValue[i];
            if (char === `\n`) {
              unIndent(el, i + 1, cursorPos);
              break;
            } else {
              continue;
            }
          }
        }
      } else if (e.key === "Tab") {
        //indent
        e.preventDefault();
        const el = document.getElementById("textarea") as HTMLTextAreaElement;
        if (el) {
          const cursorPos = el.selectionEnd;
          for (let i = cursorPos - 1; i >= 0; i--) {
            if (i === 0) {
              indent(el, i, cursorPos);
              break;
            }
            const char = currentValue[i];
            if (char === `\n`) {
              indent(el, i + 1, cursorPos);
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

  useEffect(() => {
    const fetchItem = async (fileName: string) => {
      const res = await fetch(`/api/items/${fileName}`);
      if (!res.ok) {
        const msg = await res.text();
        setFetchError(msg);
        toastError(msg);
      } else {
        const j = await res.json();
        setItem(j);
        setCurrentValue(j.content);
      }
    };
    fetchItem(fileName);
  }, []);

  const ctxValue: ctxValue = {
    item,
    fetchError,
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
