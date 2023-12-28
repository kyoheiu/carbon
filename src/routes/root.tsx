import { useState } from "react";
import { Outlet } from "react-router-dom";

export const Root = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [newFile, setNewFile] = useState("");

  const handleClick = () => {
    setShowDialog((b) => !b);
  };

  const handleCreate = async () => {
    const res = await fetch("http://localhost:3000/items", {
      method: "POST",
      body: newFile,
    });
    if (!res.ok) {
      console.error("Post failed.");
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
        <button className="px-2 py-1 ml-2 rounded border" onClick={handleClick}>
          New
        </button>
        <form className="ml-auto" method="get" action="/search">
          <input
            className="p-1 w-32 rounded"
            type="text"
            placeholder="Search"
            name="q"
          />
        </form>
      </header>
      <dialog open={showDialog}>
        <button onClick={() => setShowDialog(false)}>close</button>
        <div>
          <input
            type="text"
            value={newFile}
            onChange={(e) => setNewFile(() => e.target.value)}
          />
          <button onClick={handleCreate}>Create</button>
        </div>
      </dialog>
      <div>
        <Outlet />
      </div>
    </>
  );
};
