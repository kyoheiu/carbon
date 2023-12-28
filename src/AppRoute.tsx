import { createBrowserRouter } from "react-router-dom";
import Index from "./routes";
import PageError from "./routes/pageError";
import { PageItem } from "./routes/pageItem";
import { Search } from "./routes/search";
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
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
]);
