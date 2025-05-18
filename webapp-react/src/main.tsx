import "@telegram-apps/telegram-ui/dist/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { Tg } from "./app/config/Tg";
import "./app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Tg />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
