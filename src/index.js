import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter, BrowserRouter } from "react-router-dom";
import { MainContextProvider } from "./context/MainContext";

const mode = process.env.REACT_APP_ENV || "local";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {mode === "local" ? (
      <HashRouter>
        <MainContextProvider>
          <App />
        </MainContextProvider>
      </HashRouter>
    ) : (
      <BrowserRouter>
        <MainContextProvider>
          <App />
        </MainContextProvider>
      </BrowserRouter>
    )}
  </>
);
