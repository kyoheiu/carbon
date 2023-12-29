import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { toastError } from "../utils";

export const Root = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [newFile, setNewFile] = useState("");

  const handleClick = () => {
    setNewFile("");
    setShowDialog((b) => !b);
  };

  const handleCreate = async () => {
    const res = await fetch("http://localhost:3000/items", {
      method: "POST",
      body: newFile,
    });
    if (!res.ok) {
      toastError(await res.text());
    } else {
      const newFile = await res.text();
      window.location.href = `/items/${newFile}`;
    }
    setNewFile("");
  };

  return (
    <>
      <header className="flex items-center p-2 w-screen">
        <a className="font-extrabold" href="/">
          carbon
        </a>
        <button
          className="px-2 py-1 ml-2 text-sm text-gray-50 bg-gray-600 rounded"
          onClick={handleClick}
        >
          +New
        </button>
        <form className="ml-auto" method="get" action="/search">
          <input
            className="px-2 py-1 w-32 bg-gray-200 rounded"
            type="text"
            placeholder="Search"
            name="q"
          />
        </form>
      </header>
      <Dialog
        className="p-4 text-gray-100 bg-gray-800 rounded"
        visible={showDialog}
        onHide={handleClick}
      >
        <div className="flex flex-col space-y-2">
          <div>New file</div>
          <input
            className="text-gray-900 rounded"
            type="text"
            value={newFile}
            onChange={(e) => setNewFile(() => e.target.value)}
          />
          <button
            className="self-end px-2 py-1 w-16 text-sm text-gray-800 bg-gray-100 rounded"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </Dialog>
      <div>
        <Outlet />
      </div>
      <Toaster />
    </>
  );
};
