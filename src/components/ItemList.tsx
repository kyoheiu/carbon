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
                className="flex items-center relative my-2 border-b"
              >
                <div>
                  <a className="text-lg" href={`/items/${item.title}`}>
                    {item.title}
                  </a>
                </div>
                <div className="ml-auto text-sm text-hai">
                  {fromNow(item.modified)}
                </div>
                <button onClick={() => toggleMenu(`item-${index}`)}>
                  <img src="/more-vertical.svg" />
                </button>
                {openIndex === `item-${index}` && (
                  <div className="z-50 absolute right-0 mt-16 flex flex-col bg-shiro border rounded">
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
        <button onClick={toggleDialog}>close</button>
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
