import { useRef } from "react";
import { useItemList } from "../ItemListContext";
import { Item } from "../types";

const ItemList = ({
  items,
  hideItem,
}: {
  items: Item[];
  hideItem: (arg: string) => void;
}) => {
  const {
    deleteItem,
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
              <li key={`item-${index}`}>
                <div>
                  <a href={`/items/${item.title}`}>{item.title}</a>
                </div>
                <div>{item.modified}</div>
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
              </li>
            )
          );
        })}
      </ul>
      <dialog open={showRenameDialog}>
        <button onClick={() => false}>close</button>
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
