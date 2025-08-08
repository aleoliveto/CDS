import React, { useMemo, useState } from "react";
import "../SpiritPage.css";

export default function SpiritPage() {
  // ===== DATA =====
  const priorities = [
    "Building Europe’s best network",
    "Transforming revenue",
    "Delivering ease and reliability",
    "Driving our low-cost model",
  ];

  const values = [
    { label: "BE SAFE", desc: "Always with safety at our heart" },
    { label: "BE CHALLENGING", desc: "Always challenging cost" },
    { label: "BE BOLD", desc: "Making a positive difference" },
    { label: "BE WELCOMING", desc: "Always warm and welcoming" },
  ];

  // Similar-but-different distractors for quiz selects
  const priorityOptions = [
    "Building Europe’s best network",
    "Transforming revenue",
    "Delivering ease and reliability",
    "Driving our low-cost model",
    "Expanding premium services",
    "Reducing our flight frequency",
    "Focusing only on long-haul",
    "Improving airport lounges",
  ];

  // ===== QUIZ STATE =====
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [checked, setChecked] = useState(false);

  const score = useMemo(() => {
    if (!checked) return null;
    let s = 0;
    priorities.forEach((p, i) => {
      if (answers[i] === p) s++;
    });
    return s;
  }, [checked, answers, priorities]);

  function updateAnswer(i, value) {
    const next = answers.slice();
    next[i] = value;
    setAnswers(next);
  }

  function onCheck() {
    setChecked(true);
  }

  function onReset() {
    setAnswers(["", "", "", ""]);
    setChecked(false);
  }

  // ===== VIEW UI =====
  return (
    <section className="spirit-container" aria-label="easyJet Orange Spirit">
      {/* Top controls */}
      <div className="spirit-toolbar">
        <button
          type="button"
          className="btn-toggle"
          onClick={() => setQuizMode(v => !v)}
          aria-pressed={quizMode}
        >
          {quizMode ? "Switch to View Mode" : "Switch to Quiz Mode"}
        </button>
        {quizMode && (
          <div className="quiz-legend" aria-hidden="true">
            <span className="pill correct">Correct</span>
            <span className="pill wrong">Wrong</span>
            <span className="pill neutral">Unanswered</span>
          </div>
        )}
      </div>

      {/* ===== TOP (white) ===== */}
      <div className="spirit-header">
        {/* LEFT: PURPOSE chevron */}
        <div className="spirit-left">
          <svg
            className="chevron"
            viewBox="0 0 320 360"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,0 250,180 0,360" fill="#ff6600" />
          </svg>

          <div className="purpose-text" aria-labelledby="purpose-title">
            <h2 id="purpose-title">PURPOSE</h2>
            <p>
              Making low-cost
              <br />
              travel easy
            </p>
          </div>
        </div>

        {/* MIDDLE: PRIORITIES (view or quiz) */}
        <div className="spirit-priorities">
          <h2 className="section-title">PRIORITIES</h2>

          {!quizMode ? (
            <ul className="priority-list">
              {priorities.map((text) => (
                <li key={text} className="priority-row">
                  <span className="dot" aria-hidden="true" />
                  <span className="dotted-line" aria-hidden="true" />
                  <span className="plane-icon" aria-hidden="true">
                    <img
                      src="https://img.icons8.com/ios-filled/50/ff6600/airplane-take-off.png"
                      alt=""
                      width="20"
                      height="20"
                    />
                  </span>
                  <span className="priority-label">{text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="priority-list">
              {priorities.map((correct, i) => {
                const state =
                  !checked || answers[i] === ""
                    ? "neutral"
                    : answers[i] === correct
                    ? "correct"
                    : "wrong";
                return (
                  <li key={correct} className={`priority-row quiz-row ${state}`}>
                    <span className="dot" aria-hidden="true" />
                    <span className="dotted-line" aria-hidden="true" />
                    <span className="plane-icon" aria-hidden="true">
                      <img
                        src="https://img.icons8.com/ios-filled/50/ff6600/airplane-take-off.png"
                        alt=""
                        width="20"
                        height="20"
                      />
                    </span>

                    {/* iPad-friendly select (no libs) */}
                    <label className="sr-only" htmlFor={`priority-${i}`}>
                      Priority {i + 1}
                    </label>
                    <select
                      id={`priority-${i}`}
                      className="priority-select"
                      value={answers[i]}
                      onChange={(e) => updateAnswer(i, e.target.value)}
                    >
                      <option value="">Select the correct priority…</option>
                      {priorityOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* RIGHT: DESTINATION */}
        <div className="spirit-destination">
          <h2 className="section-title">DESTINATION</h2>
          <div className="destination-circle" role="figure" aria-label="Destination statement">
            Europe’s most loved airline —
            <br />
            winning for our customers,
            <br />
            shareholders and people.
          </div>
        </div>
      </div>

      {/* ===== FOOTER (grey) ===== */}
      <div className="spirit-footer">
        <div className="footer-header">
          <span>Made possible by our people</span>
          <h2>BE ORANGE</h2>
          <span>Being true to our promises</span>
        </div>

        <div className="orange-core" aria-label="Living the Orange Spirit">
          Living the Orange Spirit
        </div>

        <div className="value-grid">
          {values.map((v) => (
            <div className="value-box" key={v.label}>
              <h3>{v.label}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Quiz controls & score */}
        {quizMode && (
          <div className="quiz-controls">
            <button
              type="button"
              className="btn-primary"
              onClick={onCheck}
              disabled={checked && answers.every(a => a !== "")}
            >
              Check answers
            </button>
            <button type="button" className="btn-secondary" onClick={onReset}>
              Reset
            </button>

            {checked && (
              <div className="quiz-score" role="status" aria-live="polite">
                Score: <strong>{score}</strong> / {priorities.length}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
