import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { toastError } from "../lib/utils";

export const Root = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [newFile, setNewFile] = useState("");

  const handleClick = () => {
    setNewFile("");
    setShowDialog((b) => !b);
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/items`, {
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
      <header className="flex items-center p-2 w-screen sm:w-120 md:w-144">
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
            className="px-2 py-1 w-36 bg-gray-200 rounded"
            type="text"
            required
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
          <input
            className="px-2 py-1 mt-4 text-gray-800 rounded border"
            type="text"
            autoFocus
            required
            value={newFile}
            placeholder="file name"
            onChange={(e) => setNewFile(() => e.target.value)}
          />
          <button className="border" onClick={handleCreate}>
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
