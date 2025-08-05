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
    phase: GAME_PHASES[0],
    choicesArray: [],
  });
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // ✅ Fetch current phase and lock from DB — no more 406
  useEffect(() => {
    const fetchState = async () => {
      const { data: phaseData, error: phaseError } = await supabase
        .from("game_state")
        .select("phase_index")
        .eq("base", base)
        .single();

      if (phaseError) {
        console.error("Phase fetch error:", phaseError.message);
      } else {
        setCurrentPhaseIndex(phaseData.phase_index);
      }

      const { data: lockData, error: lockError } = await supabase
        .from("locks")
        .select("is_locked")
        .eq("base", base)
        .single();

      if (lockError) {
        console.error("Lock fetch error:", lockError.message);
      } else {
        setIsLocked(lockData.is_locked);
      }
    };

    fetchState();
  }, [base]);

  // Leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("base", base)
        .order("score", { ascending: false });

      if (!error) setPlayers(data);
      else console.error("Leaderboard fetch error:", error.message);
    };

    fetchLeaderboard();
  }, [base]);

  // Lock/unlock players
  const toggleLock = async () => {
    const newStatus = !isLocked;
    setIsLocked(newStatus);

    const { error } = await supabase
      .from("locks")
      .upsert({ base, is_locked: newStatus }, { onConflict: ["base"] });

    if (error) console.error("Failed to update lock:", error.message);
  };

  // Phase control
  const updatePhase = async (newIndex) => {
    setCurrentPhaseIndex(newIndex);

    const { error } = await supabase
      .from("game_state")
      .update({ phase_index: newIndex })
      .eq("base", base);

    if (error) console.error("Failed to update phase:", error.message);
  };

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) updatePhase(currentPhaseIndex - 1);
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < GAME_PHASES.length - 1)
      updatePhase(currentPhaseIndex + 1);
  };

  // Add event
  const handleNewEventSubmit = async (e) => {
    e.preventDefault();

    try {
      const { message, choicesArray, phase } = newEvent;

      const { error } = await supabase.from("events").insert({
        message,
        choices: choicesArray,
        phase,
        base,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;

      alert("✅ Event added successfully!");
      setNewEvent({ message: "", phase: GAME_PHASES[0], choicesArray: [] });
    } catch (err) {
      console.error("Insert failed:", err.message);
      alert("❌ Failed to add event. Check inputs.");
    }
  };

  return (
    <div className="game-container">
      <div className="hud-bar">
        <span><strong>Admin Dashboard</strong></span>
        <span>Base: {base}</span>
        <span>Current Phase: {GAME_PHASES[currentPhaseIndex]}</span>
        <button
          onClick={toggleLock}
          style={{ marginLeft: "auto", cursor: "pointer" }}
        >
          {isLocked ? "Unlock Players" : "Lock Players"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem", width: "100%", maxWidth: "1000px" }}>
        {/* Left - Leaderboard */}
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
                    <td>{p.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right - Event Management */}
        <div style={{ flex: 1 }}>
          <div className="tools-panel">
            <h3>Add New Event</h3>
            <form onSubmit={handleNewEventSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Message:<br />
                  <textarea
                    value={newEvent.message}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, message: e.target.value })
                    }
                    rows={3}
                    style={{ width: "100%" }}
                    required
                  />
                </label>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label><strong>Choices:</strong></label>
                {newEvent.choicesArray?.map((choice, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
                  >
                    <input
                      type="text"
                      placeholder="Choice text"
                      value={choice.text}
                      onChange={(e) => {
                        const updated = [...newEvent.choicesArray];
                        updated[idx].text = e.target.value;
                        setNewEvent({ ...newEvent, choicesArray: updated });
                      }}
                      style={{ flex: 2 }}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Score"
                      value={choice.score}
                      onChange={(e) => {
                        const updated = [...newEvent.choicesArray];
                        updated[idx].score = parseInt(e.target.value);
                        setNewEvent({ ...newEvent, choicesArray: updated });
                      }}
                      style={{ width: "70px" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = newEvent.choicesArray.filter(
                          (_, i) => i !== idx
                        );
                        setNewEvent({ ...newEvent, choicesArray: updated });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      ...newEvent,
                      choicesArray: [
                        ...(newEvent.choicesArray || []),
                        { text: "", score: 0 },
                      ],
                    })
                  }
                >
                  + Add Choice
                </button>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Phase:<br />
                  <select
                    value={newEvent.phase}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, phase: e.target.value })
                    }
                    style={{ width: "100%" }}
                  >
                    {GAME_PHASES.map((phase, idx) => (
                      <option key={idx} value={phase}>
                        {phase}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="advance-phase"
                style={{ maxWidth: "150px" }}
              >
                Add Event
              </button>
            </form>
          </div>

          <div
            className="advance-phase"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <button onClick={handlePrevPhase} disabled={currentPhaseIndex === 0}>
              Previous Phase
            </button>
            <button
              onClick={handleNextPhase}
              disabled={currentPhaseIndex === GAME_PHASES.length - 1}
            >
              Next Phase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
