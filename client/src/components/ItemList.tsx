import { useRef } from "react";
import { useItemList } from "../contexts/ItemListContext";
import { ListItem } from "../lib/types";
import { fromNow } from "../lib/utils";
import { Dialog } from "primereact/dialog";
import { MoreVertical } from "./Icons";

const ItemList = ({
  items,
  hideItem,
}: {
  items: ListItem[];
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
                <div className="overflow-hidden w-56 text-lg break-all sm:w-80 md:w-96 text-ellipsis line-clamp-1">
                  <a href={`/items/${encodeURI(item.title)}`}>{item.title}</a>
                </div>
                <div className="ml-auto w-20 text-sm text-gray-600 break-all line-clamp-1">
                  {fromNow(item.modified)}
                </div>
                <button
                  className="w-6"
                  onClick={() => toggleMenu(`item-${index}`)}
                >
                  <MoreVertical />
                </button>
                {openIndex === `item-${index}` && (
                  <div className="flex absolute right-3 z-50 flex-col items-start p-2 mt-20 space-y-2 text-gray-50 bg-gray-800 rounded border">
                    <button
                      className="text-sm"
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
                      className="text-sm text-red-200"
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
        <form
          className="flex flex-col space-y-2"
          onSubmit={() => {
            handleRename(currentName.current);
            currentName.current = "";
          }}
        >
          <input
            className="px-2 py-1 mt-4 text-gray-800 rounded border"
            type="text"
            required
            autoFocus
            value={newName}
            onChange={(e) => setNewName(() => e.target.value)}
          />
          <button className="border" type="submit">
            Rename
          </button>
        </form>
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
