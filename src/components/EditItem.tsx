import { useItem } from "../ItremContext";
import { ArrowLeft, UploadCloud } from "./Icons";
import { useCallback } from "react";

const reg = /^\s*([-\+\*] |\d+[\.\)] )/g;

export const EditItem = () => {
  const { item, currentValue, setCurrentValue, handleSave, toggleEditMode } =
    useItem();
  if (!item) return null;

  const setListMarker = (
    el: HTMLTextAreaElement,
    captured: string,
    cursorPos: number
  ) => {
    setCurrentValue(
      (v) => v.slice(0, cursorPos + 2) + captured + v.slice(cursorPos)
    );
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = cursorPos + captured.length;
    }, 5);
  };

  const keyDown = useCallback(
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
              const line = currentValue.substring(i + 1, cursorPos);
              const matched = line.match(reg);
              if (matched !== null) {
                setListMarker(el, matched[0], cursorPos + 1);
              }
              break;
            } else if (i === 0) {
              const line = currentValue.substring(i, cursorPos);
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

  return (
    <>
      <div className="mt-3 mb-4 text-xl leading-6 break-words">
        {item.title}
      </div>
      <div className="flex justify-between mb-4">
        <button
          className="px-2 py-1 text-sm text-gray-50 bg-gray-600 rounded"
          onClick={() => toggleEditMode()}
        >
          <ArrowLeft />
          View
        </button>
        <button
          className="px-2 py-1 text-sm text-gray-50 bg-gray-600 rounded disabled:bg-gray-300"
          onClick={handleSave}
          disabled={currentValue === item.content}
        >
          <UploadCloud />
          Save
        </button>
      </div>
      <textarea
        id="textarea"
        className="p-2 border border-orange-300"
        value={currentValue}
        placeholder="Text here."
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={(e) => keyDown(e)}
      />
    </>
  );
};
