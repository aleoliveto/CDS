import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GAME_PHASES } from "../phases";
import "../FlightDeck.css";
import CockpitTools from "../components/CockpitTools";
import { supabase } from "../supabaseClient";

const EVENT_DURATION_SECONDS = 120;

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null); // { id, name, surname, base, aircraft }
  const [currentPhase, setCurrentPhase] = useState(0);
  const [log, setLog] = useState([]);
  const [eventFeed, setEventFeed] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EVENT_DURATION_SECONDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const timerRef = useRef(null);
  const handledIdsRef = useRef(new Set());   // local session "handled"
  const submittedIdsRef = useRef(new Set()); // server-persisted handled

  // Helpers
  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  // Bootstrap player from router or localStorage
  useEffect(() => {
    const statePlayer = location.state;
    if (statePlayer?.playerId) {
      setPlayer({
        id: statePlayer.playerId,
        name: statePlayer.name,
        surname: statePlayer.surname,
        base: statePlayer.base,
        aircraft: statePlayer.aircraft || null,
      });
      return;
    }
    const stored = localStorage.getItem("player");
    if (stored) {
      try {
        const p = JSON.parse(stored);
        if (p?.id) setPlayer(p);
      } catch (err) {
        console.warn("Invalid player JSON in localStorage, clearing.", err);
        localStorage.removeItem("player");
      }
    }
  }, [location.state]);

  // If no player, bounce to login
  useEffect(() => {
    if (player === null) return; // still checking
    if (!player) navigate("/");
  }, [player, navigate]);

  // Load player's score/phase and subscribe to row changes; seed submissions
  useEffect(() => {
    if (!player?.id) return;

    let isMounted = true;

    const loadPlayerRow = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("phase_index, score, aircraft")
        .eq("id", player.id)
        .single();
      if (!isMounted) return;
      if (!error && data) {
        setCurrentPhase(data.phase_index ?? 0);
        setScore(data.score ?? 0);
        if (data.aircraft) {
          setPlayer((prev) => ({ ...prev, aircraft: data.aircraft }));
          localStorage.setItem(
            "player",
            JSON.stringify({ ...player, aircraft: data.aircraft })
          );
        }
      }
    };

    const loadSubmissionsSnapshot = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("event_id")
        .eq("player_id", player.id);
      if (!isMounted) return;
      if (!error && Array.isArray(data)) {
        const ids = new Set(data.map((r) => r.event_id));
        submittedIdsRef.current = ids;
        handledIdsRef.current = new Set(ids); // handled includes submitted
      }
    };

    loadPlayerRow();
    loadSubmissionsSnapshot();

    const channel = supabase.channel(`player-${player.id}`);
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "players", filter: `id=eq.${player.id}` },
      (payload) => {
        const row = payload.new;
        if (typeof row.score === "number") setScore(row.score);
        if (typeof row.phase_index === "number") setCurrentPhase(row.phase_index);
      }
    );
    channel.subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [player?.id, player]);

  // Fetch events + realtime for current base/phase. Also refresh submissions snapshot.
  useEffect(() => {
    if (!player?.base) return;

    let isMounted = true;

    // Refresh submissions snapshot when base/phase changes
    const refreshSubmissions = async () => {
      if (!player?.id) return;
      const { data } = await supabase
        .from("submissions")
        .select("event_id")
        .eq("player_id", player.id);
      const ids = new Set((data || []).map((r) => r.event_id));
      submittedIdsRef.current = ids;
      handledIdsRef.current = new Set(ids);
    };

    const fetchEvents = async () => {
      setLoadingEvents(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("base", player.base)
        .eq("phase", GAME_PHASES[currentPhase])
        .order("timestamp", { ascending: false }); // change to created_at if needed

      if (!isMounted) return;

      if (!error) {
        const rows = data || [];

        // Filter out events already submitted by this player
        const filtered = rows.filter((e) => !submittedIdsRef.current.has(e.id));
        setEventFeed(filtered);

        const firstUnseen = filtered.find((e) => !handledIdsRef.current.has(e.id));
        if (firstUnseen && !isLocked) {
          setActiveEvent(firstUnseen);
        } else {
          setActiveEvent(null);
        }
      } else {
        setFetchError("Failed to load events. Please try again later.");
        console.error(error.message);
      }

      setLoadingEvents(false);
    };

    (async () => {
      await refreshSubmissions();
      await fetchEvents();
    })();

    const channel = supabase.channel(`game-${player.base}-${GAME_PHASES[currentPhase]}`);

    // New events for this base
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "events",
        filter: `base=eq.${player.base}`,
      },
      (payload) => {
        const newEvent = payload.new;

        // Only react to current phase
        if (newEvent.phase !== GAME_PHASES[currentPhase]) return;

        // If already submitted by this player, ignore
        if (submittedIdsRef.current.has(newEvent.id)) return;

        setEventFeed((prev) => {
          const exists = prev.some((e) => e.id === newEvent.id);
          return exists ? prev : [newEvent, ...prev];
        });

        if (
          !handledIdsRef.current.has(newEvent.id) &&
          !activeEvent &&
          !isModalOpen &&
          !isLocked
        ) {
          setActiveEvent(newEvent);
        } else {
          setToastMessage("📣 New event received");
          setTimeout(() => setToastMessage(null), 2500);
        }
      }
    );

    // Phase changes from Admin (global)
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "game_state",
        filter: `base=eq.${player.base}`,
      },
      async (payload) => {
        const idx = payload.new.phase_index ?? 0;
        setCurrentPhase(idx);
        setEventFeed([]);
        setActiveEvent(null);
        setTimeLeft(EVENT_DURATION_SECONDS);
        setIsModalOpen(false);
        handledIdsRef.current.clear();

        setLog((prev) => [...prev, `✈ Phase updated to "${GAME_PHASES[idx]}"`]);

        // Mirror on player row
        if (player?.id) {
          await supabase.from("players").update({ phase_index: idx }).eq("id", player.id);
        }

        // Refresh submissions for the new phase context
        const { data } = await supabase
          .from("submissions")
          .select("event_id")
          .eq("player_id", player.id);
        const ids = new Set((data || []).map((r) => r.event_id));
        submittedIdsRef.current = ids;
        handledIdsRef.current = new Set(ids);
      }
    );

    // Locks from Admin
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "locks",
        filter: `base=eq.${player.base}`,
      },
      (payload) => {
        const locked = payload.new.is_locked;
        setIsLocked(locked);
        setIsModalOpen(false);
        setActiveEvent(null);
        setTimeLeft(EVENT_DURATION_SECONDS);
        setLog((prev) => [
          ...prev,
          locked
            ? "🚫 Admin locked the game. Waiting for unlock."
            : "✅ Game unlocked by Admin. You may resume.",
        ]);
      }
    );

    channel.subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [player?.base, currentPhase]); // keep deps minimal to avoid refetch loops

  // Timeout handler (records submission)
  const handleTimeout = useCallback(() => {
    (async () => {
      if (player?.id && activeEvent?.id) {
        const { error } = await supabase.from("submissions").insert({
          player_id: player.id,
          event_id: activeEvent.id,
          status: "timeout",
          choice_text: null,
          score_delta: 0,
        });
        if (error) console.error("submissions timeout insert error:", error);
        submittedIdsRef.current.add(activeEvent.id);
      }
      if (activeEvent?.id) handledIdsRef.current.add(activeEvent.id);
      setLog((prev) => [
        ...prev,
        `${GAME_PHASES[currentPhase]}: Event timed out without response.`,
      ]);
      setIsModalOpen(false);
      setActiveEvent(null);
    })();
  }, [player?.id, activeEvent?.id, currentPhase]);

  // Open/close modal based on activeEvent
  useEffect(() => {
    if (activeEvent?.choices?.length > 0) {
      setIsModalOpen(true);
      setTimeLeft(EVENT_DURATION_SECONDS);
    } else {
      setIsModalOpen(false);
    }
  }, [activeEvent]);

  // Countdown while modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isModalOpen, handleTimeout]);

  // After closing a modal, auto-open the next unseen event in the feed
  useEffect(() => {
    if (isModalOpen || activeEvent) return;
    const nextUnseen = eventFeed.find((e) => !handledIdsRef.current.has(e.id));
    if (nextUnseen && !isLocked) {
      setActiveEvent(nextUnseen);
    }
  }, [isModalOpen, eventFeed, isLocked, activeEvent]);

  const handleEventChoice = async (choice) => {
    const delta = choice?.score ?? 0;
    const newScore = (score ?? 0) + delta;

    setScore(newScore);
    setLog((prev) => [
      ...prev,
      `${GAME_PHASES[currentPhase]}: Event "${activeEvent?.message}" - Choice: "${choice?.text}" (+${delta})`,
    ]);

    // Persist submission
    if (player?.id && activeEvent?.id) {
      const { error } = await supabase.from("submissions").insert({
        player_id: player.id,
        event_id: activeEvent.id,
        status: "answered",
        choice_text: choice?.text ?? null,
        score_delta: delta,
      });
      if (error) console.error("submissions insert error:", error);
      submittedIdsRef.current.add(activeEvent.id);
    }

    // Update score on players
    if (player?.id) {
      const { error } = await supabase
        .from("players")
        .update({ score: newScore })
        .eq("id", player.id);
      if (error) console.error("players score update error:", error);
    }

    if (activeEvent?.id) handledIdsRef.current.add(activeEvent.id);
    setIsModalOpen(false);
    setActiveEvent(null);
    setTimeLeft(EVENT_DURATION_SECONDS);
  };

  const handleCloseModal = () => {
    if (
      window.confirm(
        "Are you sure you want to dismiss this event? You won't be able to respond."
      )
    ) {
      (async () => {
        if (player?.id && activeEvent?.id) {
          const { error } = await supabase.from("submissions").insert({
            player_id: player.id,
            event_id: activeEvent.id,
            status: "dismissed",
            choice_text: null,
            score_delta: 0,
          });
          if (error) console.error("submissions dismiss insert error:", error);
          submittedIdsRef.current.add(activeEvent.id);
        }
        if (activeEvent?.id) handledIdsRef.current.add(activeEvent.id);
        setIsModalOpen(false);
        setActiveEvent(null);
        setTimeLeft(EVENT_DURATION_SECONDS);
      })();
    }
  };

  const handleLogAction = async (msg, scoreBoost = 0) => {
    setLog((prev) => [...prev, `${GAME_PHASES[currentPhase]}: ${msg}`]);
    if (scoreBoost > 0) {
      const newScore = (score ?? 0) + scoreBoost;
      setScore(newScore);
      if (player?.id) {
        const { error } = await supabase
          .from("players")
          .update({ score: newScore })
          .eq("id", player.id);
        if (error) console.error("players score update error:", error);
      }
    }
  };

  const handlePhaseAdvance = async () => {
    if (currentPhase < GAME_PHASES.length - 1) {
      const next = currentPhase + 1;
      setCurrentPhase(next);
      setEventFeed([]);
      setActiveEvent(null);
      setTimeLeft(EVENT_DURATION_SECONDS);
      setIsModalOpen(false);
      handledIdsRef.current.clear();

      if (player?.id) {
        const { error } = await supabase
          .from("players")
          .update({ phase_index: next })
          .eq("id", player.id);
        if (error) console.error("players phase update error:", error);
      }

      // refresh submissions snapshot for new phase context
      if (player?.id) {
        const { data } = await supabase
          .from("submissions")
          .select("event_id")
          .eq("player_id", player.id);
        const ids = new Set((data || []).map((r) => r.event_id));
        submittedIdsRef.current = ids;
        handledIdsRef.current = new Set(ids);
      }
    }
  };

  if (!player) {
    return (
      <div className="game-container">
        <p style={{ color: "white" }}>Loading player…</p>
      </div>
    );
  }

  return (
    <div className="game-container" role="main">
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            backgroundColor: "#ff6600",
            color: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
            fontWeight: "bold",
            animation: "fadein 0.3s ease-out",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content">
            <h2>Game Paused</h2>
            <p>The Admin has temporarily locked this session.</p>
          </div>
        </div>
      )}

      <div className="hud-bar" aria-label="Captain Info">
        <span>
          <strong>Captain:</strong> {player.name} {player.surname}
        </span>
        <span>
          <strong>Base:</strong> {player.base}
        </span>
        <span>
          <strong>Aircraft:</strong> {player.aircraft || "—"}
        </span>
        <span>
          <strong>Phase:</strong> {GAME_PHASES[currentPhase]}
        </span>
        <span>
          <strong>Score:</strong> {score}
        </span>
      </div>

      <div className="score-bar-container" aria-label="Score progress bar">
        <div
          className="score-bar"
          style={{ width: `${Math.min(score, 100)}%` }}
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      <div className="timeline">
        {GAME_PHASES.map((phase, index) => (
          <div
            key={index}
            className={`timeline-step ${index === currentPhase ? "active" : ""}`}
          >
            {phase}
          </div>
        ))}
      </div>

      {isModalOpen && activeEvent && (
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          aria-describedby="event-modal-description"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close event modal"
            >
              &times;
            </button>
            <h3 id="event-modal-title">{activeEvent.message}</h3>
            <p id="event-modal-description">Time left: {formatTime(timeLeft)}</p>

            {activeEvent.choices?.map((choice, idx) => (
              <button
                key={idx}
                className="modal-choice-btn"
                onClick={() => handleEventChoice(choice)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="event-feed" aria-live="polite" aria-atomic="true">
        <h3>Event Feed (Historic)</h3>
        {loadingEvents && <p>Loading events...</p>}
        {fetchError && <p className="error-text">{fetchError}</p>}
        {!loadingEvents && !fetchError && eventFeed.length === 0 && <p>No events yet.</p>}
        {!loadingEvents &&
          !fetchError &&
          eventFeed.length > 0 &&
          eventFeed.map((event) => (
            <div key={event.id} className="event-msg">
              {event.message}
            </div>
          ))}
      </div>

      <div className="tools-panel">
        <h3>Cockpit Tools</h3>
        <CockpitTools
          currentPhase={currentPhase}
          base={player.base}
          onLogAction={handleLogAction}
          onScoreBoost={(amount) => console.log(`+${amount} bonus points earned`)}
        />
      </div>

      <div className="advance-phase">
        <button
          onClick={handlePhaseAdvance}
          disabled={isModalOpen || activeEvent !== null || isLocked}
          style={{
            opacity: isModalOpen || activeEvent !== null || isLocked ? 0.6 : 1,
            cursor:
              isModalOpen || activeEvent !== null || isLocked
                ? "not-allowed"
                : "pointer",
          }}
          aria-disabled={isModalOpen || activeEvent !== null || isLocked}
          title={
            isLocked
              ? "Game is locked by Admin"
              : isModalOpen || activeEvent !== null
              ? "Please respond to or dismiss the current event before proceeding."
              : undefined
          }
        >
          Proceed to Next Phase
        </button>
      </div>

      <div className="log-panel">
        <h4>Captain Log</h4>
        <ul>
          {log.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
