import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../FlightDeck.css"; // or your global styles

export default function Login() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [base, setBase] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const trimmedName = name.trim().toLowerCase();
    const trimmedBase = base.trim().toUpperCase();

    if (!trimmedName || !surname.trim() || !trimmedBase) {
      alert("Please fill in all fields.");
      return;
    }

    if (trimmedName === "admin") {
      navigate(`/admin/${trimmedBase}`);
    } else {
      navigate("/game", {
        state: {
          name: name.trim(),
          surname: surname.trim(),
          base: trimmedBase,
        },
      });
    }
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
