import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet } from "react-router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Outlet />
    </React.StrictMode>,
);