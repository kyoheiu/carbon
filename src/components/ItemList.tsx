import { useRef } from "react";
import { useItemList } from "../contexts/ItemListContext";
import { Item } from "../lib/types";
import { fromNow } from "../lib/utils";
import { Dialog } from "primereact/dialog";
import { MoreVertical } from "./Icons";

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
      <ul className="w-full sm:w-120 md:w-144">
        {items.map((item, index) => {
          return (
            !item.hidden && (
              <li
                key={`item-${index}`}
                className="relative flex items-center p-2 pt-4 border-b bg-bg2"
              >
                <div className="w-48 overflow-hidden text-lg text-ellipsis">
                  <a href={`/items/${encodeURI(item.title)}`}>{item.title}</a>
                </div>
                <div className="ml-auto text-sm">{fromNow(item.modified)}</div>
                <button onClick={() => toggleMenu(`item-${index}`)}>
                  <MoreVertical />
                </button>
                {openIndex === `item-${index}` && (
                  <div className="absolute right-0 z-50 flex flex-col items-start p-2 mt-20 space-y-2 border rounded bg-shiro">
                    <button
                      onClick={() => {
                        currentName.current = item.title;
                        setNewName(item.title);
                        toggleDialog();
                        toggleMenu(`item-${index}`);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="text-warning"
                      onClick={() => {
                        deleteItem(item.title);
                        hideItem(item.title);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            )
          );
        })}
      </ul>
      <Dialog
        className="p-2 border rounded bg-shiro"
        visible={showRenameDialog}
        onHide={toggleDialog}
      >
        <div>
          <div>Rename</div>
          <input
            className="border rounded"
            type="text"
            value={newName}
            onChange={(e) => setNewName(() => e.target.value)}
          />
          <button onClick={() => handleRename(currentName.current)}>
            Rename
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default ItemList;
