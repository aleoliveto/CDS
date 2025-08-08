import React, { useMemo, useState } from "react";
import "../SpiritPage.css";

export default function SpiritPage() {
  // ===== CONTENT =====
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

  // ===== QUIZ OPTIONS =====
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

  const pillCorrect = "Living the Orange Spirit";
  const pillOptions = [
    "Living the Orange Spirit",
    "Leading with the Orange Heart",
    "Following the Orange Way",
    "Keeping the Orange Promise",
  ];

  const valueDescOptions = [
    "Always with safety at our heart",
    "Always challenging cost",
    "Making a positive difference",
    "Always warm and welcoming",
    "Delivering effortless service",
    "Winning with reliability",
  ];

  // ===== QUIZ STATE =====
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({
    priorities: ["", "", "", ""],
    pill: "",
    values: ["", "", "", ""],
  });
  const [checked, setChecked] = useState(false);

  const totalQuestions = 9; // 4 priorities + 1 pill + 4 values

  const score = useMemo(() => {
    if (!checked) return null;
    let s = 0;
    priorities.forEach((p, i) => answers.priorities[i] === p && s++);
    answers.pill === pillCorrect && s++;
    values.forEach((v, i) => answers.values[i] === v.desc && s++);
    return s;
  }, [checked, answers, priorities, values]);

  // helpers
  const updatePriority = (i, v) =>
    setAnswers((prev) => ({ ...prev, priorities: prev.priorities.map((x, idx) => (idx === i ? v : x)) }));
  const updatePill = (v) => setAnswers((prev) => ({ ...prev, pill: v }));
  const updateValueDesc = (i, v) =>
    setAnswers((prev) => ({ ...prev, values: prev.values.map((x, idx) => (idx === i ? v : x)) }));

  const startQuiz = () => setQuizStarted(true); // one-way
  const onCheck = () => setChecked(true);
  const onReset = () => {
    setChecked(false);
    setAnswers({ priorities: ["", "", "", ""], pill: "", values: ["", "", "", ""] });
  };

  // ===== UI =====
  return (
    <section className="spirit-container" aria-label="easyJet Orange Spirit">
      {/* Toolbar */}
      <div className="spirit-toolbar">
        {!quizStarted ? (
          <button type="button" className="btn-toggle" onClick={startQuiz}>
            Start Quiz
          </button>
        ) : (
          <div className="quiz-legend" aria-hidden="true">
            <span className="pill correct">Correct</span>
            <span className="pill wrong">Wrong</span>
            <span className="pill neutral">Unanswered</span>
          </div>
        )}
      </div>

      {/* ===== TOP ===== */}
      <div className="spirit-header">
        {/* PURPOSE */}
        <div className="spirit-left">
          <svg className="chevron" viewBox="0 0 320 360" preserveAspectRatio="none" aria-hidden="true">
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

        {/* PRIORITIES */}
        <div className="spirit-priorities">
          <h2 className="section-title">PRIORITIES</h2>

          {!quizStarted ? (
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
                const a = answers.priorities[i];
                const state = !checked || a === "" ? "neutral" : a === correct ? "correct" : "wrong";
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
                    <label className="sr-only" htmlFor={`priority-${i}`}>
                      Priority {i + 1}
                    </label>
                    <select
                      id={`priority-${i}`}
                      className="priority-select"
                      value={answers.priorities[i]}
                      onChange={(e) => updatePriority(i, e.target.value)}
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

        {/* DESTINATION */}
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

      {/* ===== FOOTER ===== */}
      <div className="spirit-footer">
        <div className="footer-header">
          <span>Made possible by our people</span>
          <h2>BE ORANGE</h2>
          <span>Being true to our promises</span>
        </div>

        {/* Pill (view) or select (quiz) — still centered */}
        <div className="orange-core-wrap">
          {!quizStarted ? (
            <div className="orange-core" aria-label="Living the Orange Spirit">
              Living the Orange Spirit
            </div>
          ) : (
            <div
              className={`orange-core-box ${
                !checked || answers.pill === ""
                  ? "neutral"
                  : answers.pill === pillCorrect
                  ? "correct"
                  : "wrong"
              }`}
            >
              <h3>Be Orange</h3>
              <select
                className="orange-core-select"
                value={answers.pill}
                onChange={(e) => updatePill(e.target.value)}
                aria-label="Select the core statement"
              >
                <option value="">Select the core statement…</option>
                {pillOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="value-grid">
          {values.map((v, i) => {
            const a = answers.values[i];
            const state =
              !quizStarted ? "" : !checked || a === "" ? "neutral" : a === v.desc ? "correct" : "wrong";
            return (
              <div className={`value-box ${state}`} key={v.label}>
                <h3>{v.label}</h3>
                {!quizStarted ? (
                  <p>{v.desc}</p>
                ) : (
                  <>
                    <label className="sr-only" htmlFor={`value-${i}`}>
                      {v.label} description
                    </label>
                    <select
                      id={`value-${i}`}
                      className="value-select"
                      value={answers.values[i]}
                      onChange={(e) => updateValueDesc(i, e.target.value)}
                    >
                      <option value="">Choose the matching description…</option>
                      {valueDescOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {quizStarted && (
          <div className="quiz-controls">
            <button type="button" className="btn-primary" onClick={onCheck}>
              Check answers
            </button>
            <button type="button" className="btn-secondary" onClick={onReset}>
              Reset
            </button>
            {checked && (
              <div className="quiz-score" role="status" aria-live="polite">
                Score: <strong>{score}</strong> / {totalQuestions}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
