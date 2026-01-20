import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./App.jsx";
import Home from "@/pages/Home";
import Academy from "@/pages/Academy";
import Admin from "@/pages/Admin";
import Store from "@/pages/Store";
import Embed from "@/pages/Embed";
import "./index.css";

function NotFound() {
  return <div className="text-sm text-muted-foreground">Not found.</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="academy" element={<Academy />} />
          <Route path="admin" element={<Admin />} />
          <Route path="store" element={<Store />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* No top nav (for embedding) */}
        <Route path="/embed" element={<Embed />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
