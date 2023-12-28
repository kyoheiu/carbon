import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoute";
import { ItemProvider } from "./ItremContext";
import { ItemListProvider } from "./ItemListContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ItemProvider>
      <ItemListProvider>
        <RouterProvider router={router} />
      </ItemListProvider>
    </ItemProvider>
  </React.StrictMode>
);
