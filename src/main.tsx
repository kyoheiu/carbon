import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoute";
import { ItemProvider } from "./contexts/ItremContext";
import { ItemListProvider } from "./contexts/ItemListContext";
import { PrimeReactProvider } from "primereact/api";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ItemProvider>
      <ItemListProvider>
        <PrimeReactProvider>
          <RouterProvider router={router} />
        </PrimeReactProvider>
      </ItemListProvider>
    </ItemProvider>
  </React.StrictMode>
);
