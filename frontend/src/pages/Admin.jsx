import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GAME_PHASES } from "../phases";
import "../FlightDeck.css";
import { supabase } from "../supabaseClient";

const Admin = () => {
  const { base } = useParams();

  const [players, setPlayers] = useState([]);
  const [newEvent, setNewEvent] = useState({
    message: "",
    choices: "",
    phase: GAME_PHASES[0],
  });
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // TODO: replace with real DB call
    setPlayers([
      { id: 1, name: "Alessandro", surname: "Oliveto", base: "LTN", points: 45 },
      { id: 2, name: "Marco", surname: "Rossi", base: "LTN", points: 38 },
      { id: 3, name: "Sara", surname: "Bianchi", base: "LTN", points: 33 },
    ]);
  }, [base]);

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) setCurrentPhaseIndex((i) => i - 1);
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < GAME_PHASES.length - 1) setCurrentPhaseIndex((i) => i + 1);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const handleNewEventSubmit = (e) => {
    e.preventDefault();
    alert(`Event to add:\nMessage: ${newEvent.message}\nChoices: ${newEvent.choices}\nPhase: ${newEvent.phase}`);
    setNewEvent({ message: "", choices: "", phase: GAME_PHASES[0] });
  };

  return (
    <div className="game-container">
      <div className="hud-bar">
        <span><strong>Admin Dashboard</strong></span>
        <span>Base: {base}</span>
        <span>Current Phase: {GAME_PHASES[currentPhaseIndex]}</span>
        <button onClick={toggleLock} style={{ marginLeft: "auto", cursor: "pointer" }}>
          {isLocked ? "Unlock Players" : "Lock Players"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem", width: "100%", maxWidth: "1000px" }}>
        {/* Left side - Leaderboard */}
        <div style={{ flex: 1, maxHeight: "400px", overflowY: "auto" }}>
          <div className="event-feed">
            <h3>Leaderboard</h3>
            <table style={{ width: "100%", color: "#f0f0f0", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ff6600" }}>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Base</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #444" }}>
                    <td>{p.name}</td>
                    <td>{p.surname}</td>
                    <td>{p.base}</td>
                    <td>{p.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side - Event Management */}
        <div style={{ flex: 1 }}>
          <div className="tools-panel">
            <h3>Add New Event (Mock)</h3>
            <form onSubmit={handleNewEventSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Message:<br />
                  <textarea
                    value={newEvent.message}
                    onChange={(e) => setNewEvent({ ...newEvent, message: e.target.value })}
                    rows={3}
                    style={{ width: "100%" }}
                    required
                  />
                </label>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Choices (JSON format):<br />
                  <textarea
                    value={newEvent.choices}
                    onChange={(e) => setNewEvent({ ...newEvent, choices: e.target.value })}
                    rows={4}
                    style={{ width: "100%" }}
                    placeholder='Example: [{"text":"Accept","score":5},{"text":"Reject","score":-5}]'
                    required
                  />
                </label>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Phase:<br />
                  <select
                    value={newEvent.phase}
                    onChange={(e) => setNewEvent({ ...newEvent, phase: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    {GAME_PHASES.map((phase, idx) => (
                      <option key={idx} value={phase}>{phase}</option>
                    ))}
                  </select>
                </label>
              </div>

              <button type="submit" className="advance-phase" style={{ maxWidth: "150px" }}>
                Add Event (Mock)
              </button>
            </form>
          </div>

          {/* Phase Controls */}
          <div className="advance-phase" style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
            <button onClick={handlePrevPhase} disabled={currentPhaseIndex === 0}>
              Previous Phase
            </button>
            <button onClick={handleNextPhase} disabled={currentPhaseIndex === GAME_PHASES.length - 1}>
              Next Phase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
