import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoute";
import { ItemListProvider } from "./contexts/ItemListContext";
import { PrimeReactProvider } from "primereact/api";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ItemListProvider>
      <PrimeReactProvider>
        <RouterProvider router={router} />
      </PrimeReactProvider>
    </ItemListProvider>
  </React.StrictMode>
);
