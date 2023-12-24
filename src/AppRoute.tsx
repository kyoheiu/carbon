import { createBrowserRouter } from "react-router-dom";
import Index from ".";
import PageError from "./routes/pageError";
import { PageItem } from "./routes/pageItem";
import { Root } from "./routes/root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "items/:fileName",
        element: <PageItem />,
      },
    ],
  },
]);
