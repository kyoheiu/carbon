import { createBrowserRouter } from "react-router-dom";
import Index from ".";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "items/:fileName",
    element: <>test</>,
  },
]);
