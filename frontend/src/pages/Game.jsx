import React, { useState, useEffect, useRef } from "react";
import { GAME_PHASES } from "../phases";
import "../FlightDeck.css";
import CockpitTools from "../components/CockpitTools";
import { supabase } from "../supabaseClient";

const EVENT_DURATION_SECONDS = 120;

export default function Game() {
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

  const [captain] = useState({
    name: "Alessandro Oliveto",
    base: "LTN",
    aircraft: "G-EZUK",
  });

  // Fetch events and listen for updates
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setFetchError(null);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("base", captain.base)
        .eq("phase", GAME_PHASES[currentPhase])
        .order("timestamp", { ascending: false });

      if (!error) {
        setEventFeed(data);
        if (data && data.length > 0) setActiveEvent(data[0]);
      } else {
        setFetchError("Failed to load events. Please try again later.");
        console.error(error.message);
      }

      setLoadingEvents(false);
    };

    fetchEvents();

    const channel = supabase.channel(`game-${captain.base}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
          filter: `base=eq.${captain.base},phase=eq.${GAME_PHASES[currentPhase]}`,
        },
        (payload) => {
          const newEvent = payload.new;

          setEventFeed((prev) => {
            const alreadyExists = prev.some((e) => e.id === newEvent.id);
            if (alreadyExists) return prev;
            return [newEvent, ...prev];
          });

          if (!activeEvent && !isModalOpen && !isLocked) {
            setActiveEvent(newEvent);
          } else {
            setToastMessage("📣 New event received!");
            setTimeout(() => setToastMessage(null), 3000);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_state",
          filter: `base=eq.${captain.base}`,
        },
        (payload) => {
          setCurrentPhase(payload.new.phase_index);
          setEventFeed([]);
          setActiveEvent(null);
          setTimeLeft(EVENT_DURATION_SECONDS);
          setIsModalOpen(false);
          setLog((prev) => [
            ...prev,
            `✈ Phase updated remotely to "${GAME_PHASES[payload.new.phase_index]}"`,
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "locks",
          filter: `base=eq.${captain.base}`,
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
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [captain.base, currentPhase, activeEvent, isModalOpen, isLocked]);

  useEffect(() => {
    if (
      activeEvent &&
      activeEvent.choices &&
      activeEvent.choices.length > 0 &&
      currentPhase !== 1
    ) {
      setIsModalOpen(true);
      setTimeLeft(EVENT_DURATION_SECONDS);
    } else {
      setIsModalOpen(false);
    }
  }, [activeEvent, currentPhase]);

  useEffect(() => {
    if (!isModalOpen) return;

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
  }, [isModalOpen]);

  const handleTimeout = () => {
    setLog((prev) => [
      ...prev,
      `${GAME_PHASES[currentPhase]}: Event timed out without response.`,
    ]);
    setIsModalOpen(false);
    setActiveEvent(null);
  };

  const handleEventChoice = (choice) => {
    setScore((prev) => prev + choice.score);
    setLog((prev) => [
      ...prev,
      `${GAME_PHASES[currentPhase]}: Event "${activeEvent.message}" - Choice: "${choice.text}" (+${choice.score})`,
    ]);
    setIsModalOpen(false);
    setActiveEvent(null);
  };

  const handleCloseModal = () => {
    if (
      window.confirm(
        "Are you sure you want to dismiss this event? You won't be able to respond."
      )
    ) {
      setIsModalOpen(false);
      setActiveEvent(null);
      setTimeLeft(EVENT_DURATION_SECONDS);
    }
  };

  const handleLogAction = (msg, scoreBoost = 0) => {
    setLog((prev) => [...prev, `${GAME_PHASES[currentPhase]}: ${msg}`]);
    if (scoreBoost > 0) setScore((prev) => prev + scoreBoost);
  };

  const handlePhaseAdvance = () => {
    if (currentPhase < GAME_PHASES.length - 1) {
      setCurrentPhase((prev) => prev + 1);
      setEventFeed([]);
      setActiveEvent(null);
      setTimeLeft(EVENT_DURATION_SECONDS);
      setIsModalOpen(false);
    }
  };

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="game-container" role="main">
      {/* Toast notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            backgroundColor: "#ff6600",
            color: "#fff",
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

      {/* Lock screen overlay */}
      {isLocked && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content">
            <h2>Game Paused</h2>
            <p>The Admin has temporarily locked this session.</p>
          </div>
        </div>
      )}

      <div className="hud-bar" aria-label="Captain Info">
        <span><strong>Captain:</strong> {captain.name}</span>
        <span><strong>Base:</strong> {captain.base}</span>
        <span><strong>Aircraft:</strong> {captain.aircraft}</span>
        <span><strong>Phase:</strong> {GAME_PHASES[currentPhase]}</span>
        <span><strong>Score:</strong> {score}</span>
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

      {isModalOpen && (
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

            {activeEvent.choices.map((choice, idx) => (
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
        {!loadingEvents && !fetchError && eventFeed.length === 0 && (
          <p>No events yet.</p>
        )}
        {!loadingEvents && !fetchError && eventFeed.length > 0 &&
          eventFeed.map((event) => (
            <div key={event.id} className="event-msg">
              {event.message}
            </div>
          ))
        }
      </div>

      <div className="tools-panel">
        <h3>Cockpit Tools</h3>
        <CockpitTools
          currentPhase={currentPhase}
          base={captain.base}
          onLogAction={handleLogAction}
          onScoreBoost={(amount) =>
            console.log(`+${amount} bonus points earned`)
          }
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
