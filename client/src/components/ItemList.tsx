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
    openIndex,
    toggleMenu,
    showRenameDialog,
    toggleRenameDialog,
    newName,
    setNewName,
    handleRename,
    showDeleteDialog,
    toggleDeleteDialog,
    handleDelete,
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
                className="flex relative items-center p-2 pt-4 border-b"
              >
                <div className="overflow-hidden w-44 text-lg text-ellipsis">
                  <a href={`/items/${encodeURI(item.title)}`}>{item.title}</a>
                </div>
                <div className="ml-auto text-sm break-all">
                  {fromNow(item.modified)}
                </div>
                <button onClick={() => toggleMenu(`item-${index}`)}>
                  <MoreVertical />
                </button>
                {openIndex === `item-${index}` && (
                  <div className="flex absolute right-3 z-50 flex-col items-start p-2 mt-20 space-y-2 text-gray-50 bg-gray-800 rounded border">
                    <button
                      onClick={() => {
                        currentName.current = item.title;
                        setNewName(item.title);
                        toggleRenameDialog();
                        toggleMenu(`item-${index}`);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="text-red-200"
                      onClick={() => {
                        currentName.current = item.title;
                        toggleDeleteDialog();
                        toggleMenu(`item-${index}`);
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
        className="p-4 text-gray-100 bg-gray-800 rounded"
        visible={showRenameDialog}
        onHide={toggleRenameDialog}
      >
        <div className="flex flex-col space-y-2">
          <input
            className="px-2 py-1 mt-4 text-gray-800 rounded border"
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(() => e.target.value)}
          />
          <button
            className="border"
            onClick={() => {
              handleRename(currentName.current);
              currentName.current = "";
            }}
          >
            Rename
          </button>
        </div>
      </Dialog>
      <Dialog
        className="p-4 text-gray-100 bg-gray-800 rounded"
        visible={showDeleteDialog}
        onHide={toggleDeleteDialog}
      >
        <div className="flex flex-col space-y-2">
          <div className="mt-2 text-lg">
            Are you sure to delete {currentName.current}?
          </div>
          <button
            className="bg-red-700 border"
            onClick={() => {
              handleDelete(currentName.current);
              hideItem(currentName.current);
              currentName.current = "";
            }}
          >
            Delete
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default ItemList;
