import { useRef } from "react";
import { useItemList } from "../ItemListContext";
import { Item } from "../types";
import { fromNow } from "../utils";

const ItemList = ({
  items,
  hideItem,
}: {
  items: Item[];
  hideItem: (arg: string) => void;
}) => {
  const {
    deleteItem,
    openIndex,
    toggleMenu,
    showRenameDialog,
    toggleDialog,
    newName,
    setNewName,
    handleRename,
  } = useItemList();
  const currentName = useRef("");

  if (!items) return null;
  return (
    <>
      <ul>
        {items.map((item, index) => {
          return (
            !item.hidden && (
              <li
                key={`item-${index}`}
                className="flex relative items-center border-b bg-bg2"
              >
                <div className="overflow-hidden w-48 text-lg text-ellipsis">
                  <a href={`/items/${item.title}`}>{item.title}</a>
                </div>
                <div className="ml-auto text-sm">{fromNow(item.modified)}</div>
                <button onClick={() => toggleMenu(`item-${index}`)}>
                  <img src="/more-vertical.svg" />
                </button>
                {openIndex === `item-${index}` && (
                  <div className="flex absolute right-0 z-50 flex-col mt-16 rounded border bg-shiro">
                    <button
                      onClick={() => {
                        deleteItem(item.title);
                        hideItem(item.title);
                      }}
                    >
                      delete
                    </button>
                    <button
                      onClick={() => {
                        currentName.current = item.title;
                        toggleDialog();
                      }}
                    >
                      rename
                    </button>
                  </div>
                )}
              </li>
            )
          );
        })}
      </ul>
      <dialog open={showRenameDialog}>
        <button
          onClick={() => {
            toggleDialog();
          }}
        >
          close
        </button>
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(() => e.target.value)}
          />
          <button onClick={() => handleRename(currentName.current)}>
            Rename
          </button>
        </div>
      </dialog>
    </>
  );
};

export default ItemList;
