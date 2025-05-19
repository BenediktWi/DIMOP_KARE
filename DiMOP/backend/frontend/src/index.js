# DiMOP/backend/frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";           // falls du globale Styles hast

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
