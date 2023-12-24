import { Outlet, useNavigate } from "react-router-dom";

const handleClick = async (e: any) => {
  const res = await fetch("http://localhost:3000/items", {
    method: "POST",
  });
  if (!res.ok) {
    console.error("Post failed.");
  } else {
    const newFile = await res.text();
    window.location.href = `/items/${newFile}`;
  }
};

export const Root = () => {
  return (
    <>
      <header>
        <a href="/">carbon</a>
        <button onClick={handleClick}>New</button>
      </header>
      <div>
        <Outlet />
      </div>
    </>
  );
};
