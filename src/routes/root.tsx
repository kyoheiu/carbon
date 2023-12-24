import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const Root = () => {
  const [showModal, setShowModal] = useState(false);
  const [newFile, setNewFile] = useState("");

  const handleClick = () => {
    console.log("click");
    setShowModal(true);
  };

  const handleCreate = async (e: any) => {
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
      <header>
        <a href="/">carbon</a>
        <button onClick={handleClick}>New</button>
        {showModal && (
          <>
            <button onClick={() => setShowModal(false)}>close</button>
            <div>
              <input
                type="text"
                value={newFile}
                onChange={(e) => setNewFile(() => e.target.value)}
              />
              <button onClick={handleCreate}>Create</button>
            </div>
          </>
        )}
      </header>
      <div>
        <Outlet />
      </div>
    </>
  );
};
