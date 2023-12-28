import { createContext, useContext, useState } from "react";

type ctxValue = {
  deleteItem: (arg: string) => Promise<Response>;
  showRenameDialog: boolean;
  toggleDialog: () => void;
  newName: string;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  handleRename: (arg: string) => Promise<void>;
};
const ItemListContext = createContext<ctxValue | null>(null);

export const ItemListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState("");

  const toggleDialog = () => {
    setShowRenameDialog((b) => !b);
  };

  const handleRename = async (fileName: string) => {
    const res = await renameItem(fileName, newName);
    if (!res.ok) {
      console.error(await res.text());
    } else {
      setShowRenameDialog(false);
      setNewName("");
      window.location.reload();
    }
  };

  const deleteItem = async (fileName: string) =>
    fetch(`http://localhost:3000/items/${fileName}`, {
      method: "DELETE",
    });

  const renameItem = async (fileName: string, newFileName: string) =>
    fetch(`http://localhost:3000/items/rename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: fileName,
        new_title: newFileName,
      }),
    });

  const ctxValue = {
    deleteItem,
    showRenameDialog,
    newName,
    setNewName,
    toggleDialog,
    handleRename,
  };
  return (
    <ItemListContext.Provider value={ctxValue}>
      {children}
    </ItemListContext.Provider>
  );
};

export const useItemList = () => {
  const ctx = useContext(ItemListContext);
  if (!ctx) {
    throw Error("Cannot access to the item list context.");
  }
  return ctx;
};
