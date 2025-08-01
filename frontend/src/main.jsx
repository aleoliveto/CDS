import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Scoreboard from "./pages/Scoreboard";
import Admin from "./pages/Admin";
import SpiritPage from "./pages/SpiritPage"; // Import the new page
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="/scoreboard" element={<Scoreboard />} />
      <Route path="/admin/:base" element={<Admin />} />
      <Route path="/spirit" element={<SpiritPage />} />   {/* Add your route here */}
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
