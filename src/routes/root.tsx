import { useState } from "react";
import { Outlet } from "react-router-dom";

export const Root = () => {
  const [showModal, setShowModal] = useState(false);
  const [newFile, setNewFile] = useState("");

  const handleClick = () => {
    setShowModal((b) => !b);
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
      <header className="py-2 w-screen flex items-center space-x-1 text-shiro bg-kuro">
        <a className="font-extrabold" href="/">
          carbon
        </a>
        <button
          className="border rounded py-1 px-2 bg-hai"
          onClick={handleClick}
        >
          New
        </button>
        <form method="get" action="/search">
          <input
            className="w-36 bg-shiro border rounded p-1"
            type="text"
            placeholder="Search"
            name="q"
          />
        </form>
      </header>
      <dialog open={showModal}>
        <button onClick={() => setShowModal(false)}>close</button>
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
