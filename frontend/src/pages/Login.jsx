import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../FlightDeck.css";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [base, setBase] = useState("");
  const navigate = useNavigate();

  // Helper functions to normalize user input
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const cap = (s) =>
    norm(s)
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");

  const handleLogin = async () => {
    const nameN = cap(name);
    const surnameN = cap(surname);
    const baseN = base.trim().toUpperCase();

    if (!nameN || !surnameN || !baseN) {
      alert("Please fill in all fields.");
      return;
    }

    // Route admin to admin page
    if (nameN.toLowerCase() === "admin") {
      navigate(`/admin/${baseN}`);
      return;
    }

    // Prepare the row payload
    const payload = { name: nameN, surname: surnameN, base: baseN };

    // Upsert into players table
    const { data, error } = await supabase
      .from("players")
      .upsert(payload, {
        onConflict: "name,surname,base", // plain column names for index
        ignoreDuplicates: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      alert("Could not create or find your player. Please try again.");
      return;
    }

    // Save to localStorage for Game.jsx
    localStorage.setItem(
      "player",
      JSON.stringify({
        id: data.id,
        name: data.name,
        surname: data.surname,
        base: data.base,
        aircraft: data.aircraft || null,
      })
    );

    // Navigate to game with state
    navigate("/game", {
      state: {
        playerId: data.id,
        name: data.name,
        surname: data.surname,
        base: data.base,
        aircraft: data.aircraft || null,
      },
    });
  };

  return (
    <div className="game-container">
      <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
        <h2 style={{ color: "white", marginBottom: "1rem" }}>Login</h2>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Base (e.g. LTN)"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            style={{ flex: 1, padding: "0.5rem" }}
          />
        </div>
        <button
          onClick={handleLogin}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.5rem",
            fontWeight: "bold",
            background: "#ff6600",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
