import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <>
      <header>
        <a href="/">carbon</a>
      </header>
      <div>
        <Outlet />
      </div>
    </>
  );
};
