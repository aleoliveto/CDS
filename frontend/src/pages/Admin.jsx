import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GAME_PHASES } from "../phases";
import "../FlightDeck.css";
import { supabase } from "../supabaseClient";

const BASES = ["LTN", "LGW", "SEN"]; // edit if you add bases

export default function Admin() {
  const { base } = useParams();

  const [players, setPlayers] = useState([]);
  const [newEvent, setNewEvent] = useState({
    message: "",
    phase: GAME_PHASES[0],
    choicesArray: [],
  });
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Training pack UI state
  const [seedAllBases, setSeedAllBases] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  // ---------- helpers ----------
  const trainingScenarios = (phaseMap = {}) => {
    // Use your exact GAME_PHASES labels. Optionally override with phaseMap if needed.
    const P = {
      preflight: phaseMap.preflight || "Pre-flight",
      briefing: phaseMap.briefing || "Crew Briefing",
      inflight: phaseMap.inflight || "In-flight",
      boarding: phaseMap.boarding || "Boarding process",
      beforeWork: phaseMap.beforeWork || "Before coming to work",
      debrief: phaseMap.debrief || "Debrief",
    };

    return [
      {
        message:
          "ATC slot delay will push FDP by ~5 mins. Cabin crew tired but willing. Do you apply discretion?",
        choices: [
          { text: "Apply discretion after fatigue risk check and crew agreement", score: 10 },
          { text: "Refuse without considering alternatives", score: -5 },
          { text: "Apply discretion without checking crew", score: -8 },
        ],
        phase: P.preflight,
      },
      {
        message:
          "Ops asks to take 300 kg extra fuel to avoid light turbulence. Flight margin is tight. What do you do?",
        choices: [
          { text: "Approve with operational justification and pax impact considered", score: 5 },
          { text: "Reject without considering customer impact", score: -5 },
          { text: "Approve without cost awareness", score: -3 },
        ],
        phase: P.preflight,
      },
      {
        message:
          "Severe weather at destination. Coordinate with Duty Pilot / Ops Control before departure.",
        choices: [
          { text: "Request diversion fuel and alternates proactively", score: 8 },
          { text: "Wait passively for instructions", score: -3 },
          { text: "Depart without checking NOTAMs/alternates", score: -10 },
        ],
        phase: P.inflight,
      },
      {
        message:
          "VIP charter: ICC requests route/crew/service approvals. Balance customer request vs limits.",
        choices: [
          { text: "Approve feasible requests; push back on non-compliant items", score: 7 },
          { text: "Approve everything without checks", score: -5 },
          { text: "Delay decision until service cannot be delivered", score: -6 },
        ],
        phase: P.briefing,
      },
      {
        message:
          "Cabin crew report a questionable comment by a pilot in the crew room. Your action?",
        choices: [
          { text: "Address respectfully and escalate via proper reporting channels", score: 10 },
          { text: "Ignore and move on", score: -8 },
          { text: "Discuss publicly with crew in front of others", score: -6 },
        ],
        phase: P.beforeWork,
      },
      {
        message:
          "Elderly passenger confused over seating; boarding agent asks for help.",
        choices: [
          { text: "Step in, resolve calmly, keep boarding on time", score: 8 },
          { text: "Pass to cabin crew without assisting", score: -4 },
          { text: "Ignore; let it escalate", score: -7 },
        ],
        phase: P.boarding,
      },
      {
        message:
          "You are attending a pilot outreach event; uniform shirt is missing epaulets.",
        choices: [
          { text: "Correct uniform before attending", score: 5 },
          { text: "Attend as is – “doesn’t matter”", score: -5 },
          { text: "Cancel attendance entirely", score: -4 },
        ],
        phase: P.debrief,
      },
      {
        message:
          "After long standby and positioning, you are asked to operate one more leg.",
        choices: [
          { text: "Check FDP/18hr guidance, personal fitness, and make safe call", score: 10 },
          { text: "Accept without considering guidance", score: -6 },
          { text: "Refuse without checking if within safe limits", score: -3 },
        ],
        phase: P.preflight,
      },
      {
        message:
          "APU inoperative at outstation with no GPU; hot conditions; boarding planned.",
        choices: [
          { text: "Coordinate ground support or adjust boarding sequence", score: 7 },
          { text: "Wait in cockpit hoping it resolves", score: -8 },
          { text: "Delay boarding without informing passengers", score: -5 },
        ],
        phase: P.boarding,
      },
    ];
  };

  // ---------- bootstrap game_state/locks, load state ----------
  useEffect(() => {
    const bootstrapState = async () => {
      await supabase.from("game_state").upsert([{ base, phase_index: 0 }], { onConflict: ["base"] });
      await supabase.from("locks").upsert([{ base, is_locked: false }], { onConflict: ["base"] });

      const { data: phaseData } = await supabase
        .from("game_state")
        .select("phase_index")
        .eq("base", base)
        .single();
      if (phaseData) setCurrentPhaseIndex(phaseData.phase_index ?? 0);

      const { data: lockData } = await supabase
        .from("locks")
        .select("is_locked")
        .eq("base", base)
        .single();
      if (lockData) setIsLocked(!!lockData.is_locked);
    };
    bootstrapState();
  }, [base]);

  // ---------- leaderboard + realtime ----------
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("id, name, surname, base, score")
        .eq("base", base)
        .order("score", { ascending: false });
      if (!error) setPlayers(data || []);
      else console.error("Leaderboard fetch error:", error.message);
    };
    load();

    const channel = supabase
      .channel(`admin-${base}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "players", filter: `base=eq.${base}` },
        (payload) => {
          setPlayers((prev) =>
            prev
              .map((p) => (p.id === payload.new.id ? { ...p, score: payload.new.score } : p))
              .sort((a, b) => b.score - a.score)
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state", filter: `base=eq.${base}` },
        (payload) => setCurrentPhaseIndex(payload.new.phase_index ?? 0)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "locks", filter: `base=eq.${base}` },
        (payload) => setIsLocked(!!payload.new.is_locked)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [base]);

  // ---------- lock/phase controls ----------
  const toggleLock = async () => {
    const next = !isLocked;
    setIsLocked(next); // optimistic
    const { error } = await supabase
      .from("locks")
      .upsert({ base, is_locked: next }, { onConflict: ["base"] });
    if (error) {
      console.error("Lock update error:", error.message);
      setIsLocked(!next);
    }
  };

  const updatePhase = async (idx) => {
    setCurrentPhaseIndex(idx); // optimistic
    const { error } = await supabase
      .from("game_state")
      .upsert({ base, phase_index: idx }, { onConflict: ["base"] });
    if (error) console.error("Phase update error:", error.message);
  };

  const handlePrevPhase = () => currentPhaseIndex > 0 && updatePhase(currentPhaseIndex - 1);
  const handleNextPhase = () =>
    currentPhaseIndex < GAME_PHASES.length - 1 && updatePhase(currentPhaseIndex + 1);

  // ---------- create single event ----------
  const handleNewEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message, choicesArray, phase } = newEvent;
      const { error } = await supabase.from("events").insert({
        message,
        choices: choicesArray,
        phase,
        base,
        timestamp: new Date().toISOString(), // change to created_at if needed
      });
      if (error) throw error;
      alert("Event added");
      setNewEvent({ message: "", phase: GAME_PHASES[0], choicesArray: [] });
    } catch (err) {
      console.error("Insert failed:", err.message);
      alert("Failed to add event");
    }
  };

  // ---------- seed training pack (current base or all bases) ----------
  const loadTrainingPack = async () => {
    try {
      setSeeding(true);
      setSeedMsg("");
      const targetBases = seedAllBases ? BASES : [base];
      const scenarios = trainingScenarios();

      let totalInserted = 0;
      for (const b of targetBases) {
        // Fetch existing messages for this base to avoid duplicates
        const { data: existing, error: selErr } = await supabase
          .from("events")
          .select("id,message")
          .eq("base", b);
        if (selErr) throw selErr;

        const existingSet = new Set((existing || []).map((r) => r.message));
        const rows = scenarios
          .filter((s) => !existingSet.has(s.message))
          .map((s) => ({
            message: s.message,
            choices: s.choices,
            phase: s.phase,
            base: b,
            timestamp: new Date().toISOString(),
          }));

        if (rows.length > 0) {
          const { error: insErr } = await supabase.from("events").insert(rows);
          if (insErr) throw insErr;
          totalInserted += rows.length;
        }
      }

      setSeedMsg(
        totalInserted > 0
          ? `✅ Training pack loaded. Inserted ${totalInserted} new event(s).`
          : "ℹ️ Training pack already present. No new events inserted."
      );
    } catch (e) {
      console.error("Training pack seed error:", e);
      setSeedMsg("❌ Failed to load training pack. See console for details.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="game-container">
      {/* Top bar */}
      <div className="hud-bar">
        <span><strong>Admin Dashboard</strong></span>
        <span>Base: {base}</span>
        <span>
          Phase:
          <span className="status-tag status-active" style={{ marginLeft: 8 }}>
            {GAME_PHASES[currentPhaseIndex]}
          </span>
        </span>
        <button className="lock-btn" onClick={toggleLock}>
          {isLocked ? "Unlock Players" : "Lock Players"}
        </button>
        <span className={`status-tag ${isLocked ? "status-inactive" : "status-active"}`}>
          {isLocked ? "Locked" : "Live"}
        </span>
      </div>

      <div className="admin-container">
        {/* Leaderboard */}
        <section className="admin-section">
          <h3>Leaderboard</h3>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Name</th>
                <th style={{ width: "28%" }}>Surname</th>
                <th style={{ width: "14%" }}>Base</th>
                <th style={{ width: "14%", textAlign: "right" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.surname}</td>
                  <td>{p.base}</td>
                  <td style={{ textAlign: "right" }}>{p.score}</td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ opacity: 0.7 }}>
                    No players yet for {base}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Event creation */}
        <section className="admin-section">
          <h3>Add New Event</h3>
          <form className="event-form" onSubmit={handleNewEventSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label>
                Message<br />
                <textarea
                  rows={3}
                  value={newEvent.message}
                  onChange={(e) => setNewEvent((s) => ({ ...s, message: e.target.value }))}
                  required
                />
              </label>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label><strong>Choices</strong></label>
              {newEvent.choicesArray?.map((choice, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Choice text"
                    value={choice.text}
                    onChange={(e) => {
                      const updated = [...newEvent.choicesArray];
                      updated[idx].text = e.target.value;
                      setNewEvent((s) => ({ ...s, choicesArray: updated }));
                    }}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={choice.score}
                    onChange={(e) => {
                      const updated = [...newEvent.choicesArray];
                      updated[idx].score = parseInt(e.target.value || "0", 10);
                      setNewEvent((s) => ({ ...s, choicesArray: updated }));
                    }}
                    style={{ width: 100 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewEvent((s) => ({
                        ...s,
                        choicesArray: s.choicesArray.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                style={{ marginTop: "0.5rem" }}
                onClick={() =>
                  setNewEvent((s) => ({
                    ...s,
                    choicesArray: [...(s.choicesArray || []), { text: "", score: 0 }],
                  }))
                }
              >
                + Add Choice
              </button>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>
                Phase<br />
                <select
                  value={newEvent.phase}
                  onChange={(e) => setNewEvent((s) => ({ ...s, phase: e.target.value }))}
                >
                  {GAME_PHASES.map((ph, i) => (
                    <option key={i} value={ph}>{ph}</option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit">Add Event</button>
          </form>
        </section>

        {/* Training Pack */}
        <section className="admin-section">
          <h3>Training Pack</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={seedAllBases}
                onChange={(e) => setSeedAllBases(e.target.checked)}
              />
              Apply to all bases ({BASES.join(", ")})
            </label>
            <button
              className="lock-btn"
              onClick={loadTrainingPack}
              disabled={seeding}
              title={seedAllBases ? "Insert scenarios for all bases" : `Insert scenarios for ${base}`}
            >
              {seeding ? "Seeding…" : "Load Training Pack"}
            </button>
            {seedMsg && <span style={{ opacity: 0.9 }}>{seedMsg}</span>}
          </div>
          <p style={{ marginTop: "0.75rem", opacity: 0.8, fontSize: "0.9rem" }}>
            This will insert 9 standard scenarios. If a scenario already exists (matched by message) it won’t be duplicated.
          </p>
        </section>

        {/* Phase controls */}
        <section className="admin-section">
          <h3>Phase Controls</h3>
          <div className="phase-controls">
            <button className="phase-prev" onClick={handlePrevPhase} disabled={currentPhaseIndex === 0}>
              Previous Phase
            </button>
            <button
              className="phase-next"
              onClick={handleNextPhase}
              disabled={currentPhaseIndex === GAME_PHASES.length - 1}
            >
              Next Phase
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
