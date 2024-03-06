import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { MainContextProvider } from "./context/MainContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <MainContextProvider>
      <App />
    </MainContextProvider>
  </HashRouter>
);
