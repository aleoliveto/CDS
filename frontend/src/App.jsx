// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Admin from "./pages/Admin";
import Scoreboard from "./pages/Scoreboard";

const players = [
  { name: "Alessandro Oliveto", base: "LTN", aircraft: "G-EZUK" },
  { name: "Mark Vella", base: "LGW", aircraft: "G-EZWX" },
];

export default function App() {
  const [captain, setCaptain] = React.useState(null);
  const [phase, setPhase] = React.useState(0);
  const [eventFeed, setEventFeed] = React.useState([]);

  const triggerEvent = (event) => {
    setEventFeed((prev) => [...prev, event]);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Login onLogin={setCaptain} />}
      />
      <Route
        path="/game"
        element={
          captain ? (
            <Game captain={captain} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          <AdminDashboard
            currentPhase={phase}
            onSetPhase={setPhase}
            onTriggerEvent={triggerEvent}
            players={players}
            adminBase="LTN"
          />
        }
      />
    </Routes>
  );
}
