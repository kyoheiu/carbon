import { createBrowserRouter } from "react-router-dom";
import Index from "./routes";
import PageError from "./routes/pageError";
import { Search } from "./routes/search";
import { Root } from "./routes/root";
import { PageWrapper } from "./routes/pageWrapper";

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
        element: <PageWrapper />,
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
]);
