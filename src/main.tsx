import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { SidebarProvider } from "./context/SidebarContext.tsx";
import { ResponsiveProvider } from "./context/ResponsiveContext.tsx";
import { store } from "./app/store.ts";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ResponsiveProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </ResponsiveProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
