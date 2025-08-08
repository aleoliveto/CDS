import React, { useMemo, useState, useEffect } from "react";
import "../SpiritPage.css";

/**
 * easyJet Spirit — Board layout with inline dropdown quiz
 * - View Mode: static board (Purpose chevron, priorities w/ dotted leaders, Destination circle, BE ORANGE band + center box)
 * - Quiz Mode: same layout, phrases become dropdowns:
 *     • Purpose body
 *     • 4 Priorities rows
 *     • BE ORANGE center box “Living the Orange Spirit”
 *     • 4 BE ORANGE value subtitles
 *   (Destination circle stays read-only)
 * - One-way switch to Quiz Mode
 * - Feedback per field: ✅ fade green / ❌ shake red
 */

const DATA = {
  purpose: {
    correct: "Making low-cost travel easy",
    distractors: ["Making high-cost travel luxurious", "Making every seat free"],
  },
  destination:
    "Europe’s most loved airline — winning for our customers, shareholders and people.",
  priorities: [
    {
      id: "p1",
      correct: "Building Europe’s best network",
      distractors: [
        "Becoming the world’s biggest carrier",
        "Connecting every country in the world",
      ],
    },
    {
      id: "p2",
      correct: "Transforming revenue",
      distractors: ["Maximising flight occupancy", "Expanding customer loyalty"],
    },
    {
      id: "p3",
      correct: "Delivering ease and reliability",
      distractors: [
        "Improving cabin seating",
        "Offering the lowest fares always",
      ],
    },
    {
      id: "p4",
      correct: "Driving our low-cost model",
      distractors: [
        "Cutting all customer amenities",
        "Reducing aircraft maintenance",
      ],
    },
  ],
  beOrange: [
    {
      id: "bo-safe",
      title: "BE SAFE",
      correct: "Always with safety at our heart",
      distractors: ["Safety is optional", "Safety only for long flights"],
    },
    {
      id: "bo-challenging",
      title: "BE CHALLENGING",
      correct: "Always challenging cost",
      distractors: [
        "Always reducing ticket prices to zero",
        "Always ignoring costs",
      ],
    },
    {
      id: "bo-bold",
      title: "BE BOLD",
      correct: "Making a positive difference",
      distractors: ["Making a neutral impact", "Making a negative difference"],
    },
    {
      id: "bo-welcoming",
      title: "BE WELCOMING",
      correct: "Always warm and welcoming",
      distractors: ["Always distant and cold", "Always neutral and reserved"],
    },
  ],
  orangeCenter: {
    id: "bo-center",
    correct: "Living the Orange Spirit",
    distractors: ["Living the Green Spirit", "Embracing the Blue Vision"],
  },
};

// tiny plane icon for priorities
const Plane = () => (
  <svg className="plane-ic" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M2 13l8 0 4 7 2-1-2-6 5 0 2 3 2-1-2-3 2-3-2-1-2 3-5 0 2-6-2-1-4 7-8 0z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

// utils
function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function SpiritPage() {
  const [quizMode, setQuizMode] = useState(false);
  const [locked, setLocked] = useState(false);

  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({}); // id -> 'correct'|'wrong'

  // build randomized options once per mount
  const opts = useMemo(() => {
    const o = {};
    o.purpose = shuffle([DATA.purpose.correct, ...DATA.purpose.distractors]);
    o[DATA.orangeCenter.id] = shuffle([
      DATA.orangeCenter.correct,
      ...DATA.orangeCenter.distractors,
    ]);
    DATA.priorities.forEach((r) => {
      o[r.id] = shuffle([r.correct, ...r.distractors]);
    });
    DATA.beOrange.forEach((t) => {
      o[t.id] = shuffle([t.correct, ...t.distractors]);
    });
    return o;
  }, []);

  useEffect(() => {
    if (quizMode) setLocked(true);
  }, [quizMode]);

  const mark = (id, ok) => {
    setStatus((s) => ({ ...s, [id]: ok ? "correct" : "wrong" }));
    if (!ok) {
      const el = document.getElementById(`row-${id}`);
      if (el) {
        el.classList.remove("shake-now");
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        el.offsetHeight;
        el.classList.add("shake-now");
        setTimeout(() => el.classList.remove("shake-now"), 550);
      }
    }
  };

  const onSelect = (id, val, correct) => {
    setAnswers((a) => ({ ...a, [id]: val }));
    mark(id, val === correct);
  };

  return (
    <div className="spirit-root">
      <header className="ej-header">
        <h1 className="ej-title">easyJet Spirit</h1>
        <div className="ej-mode">
          <span className={`mode-pill ${quizMode ? "active" : ""}`}>
            {quizMode ? "Quiz Mode (locked)" : "View Mode"}
          </span>
          <button
            className="ej-btn"
            onClick={() => setQuizMode(true)}
            disabled={locked}
            aria-disabled={locked}
          >
            {locked ? "Quiz Mode" : "Start Quiz"}
          </button>
        </div>
      </header>

      <main className="board-wrap" role="main">
        {/* Head strip */}
        <div className="board-head">
          <div className="board-head-left">PRIORITIES</div>
          <div className="board-head-right">DESTINATION</div>
        </div>

        {/* Core row */}
        <section className="board-core">
          {/* PURPOSE chevron/box */}
          <aside
            id="row-purpose"
            className={`purpose ${quizMode ? status.purpose || "" : ""}`}
          >
            <div className="purpose-inner">
              <div className="purpose-title">PURPOSE</div>

              {!quizMode ? (
                <div className="purpose-body">
                  <div>Making</div>
                  <div>low-cost</div>
                  <div>travel easy</div>
                </div>
              ) : (
                <div className="purpose-select-wrap">
                  <select
                    className={`ej-select ${
                      status.purpose === "correct"
                        ? "is-correct"
                        : status.purpose === "wrong"
                        ? "is-wrong"
                        : ""
                    }`}
                    value={answers.purpose || ""}
                    onChange={(e) =>
                      onSelect("purpose", e.target.value, DATA.purpose.correct)
                    }
                  >
                    <option value="" disabled>
                      Select the correct phrase…
                    </option>
                    {opts.purpose.map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  {status.purpose === "correct" && (
                    <span className="mark ok-mark">✅</span>
                  )}
                  {status.purpose === "wrong" && (
                    <span className="mark no-mark">❌</span>
                  )}
                </div>
              )}
            </div>
            <div className="purpose-chevron" aria-hidden />
          </aside>

          {/* PRIORITIES with dotted leaders */}
          <div className="prio-list">
            {DATA.priorities.map((row) => {
              const st = status[row.id];
              const val = answers[row.id] || "";
              return (
                <div
                  id={`row-${row.id}`}
                  key={row.id}
                  className={`prio-row ${quizMode ? st || "" : ""}`}
                >
                  <div className="prio-dot" />
                  <div className="prio-leader">
                    <Plane />
                    {!quizMode ? (
                      <span className="prio-text">{row.correct}</span>
                    ) : (
                      <div className="prio-select">
                        <select
                          className={`ej-select ${
                            st === "correct"
                              ? "is-correct"
                              : st === "wrong"
                              ? "is-wrong"
                              : ""
                          }`}
                          value={val}
                          onChange={(e) =>
                            onSelect(row.id, e.target.value, row.correct)
                          }
                        >
                          <option value="" disabled>
                            Select the correct phrase…
                          </option>
                          {opts[row.id].map((v, i) => (
                            <option key={i} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        {st === "correct" && (
                          <span className="mark ok-mark">✅</span>
                        )}
                        {st === "wrong" && (
                          <span className="mark no-mark">❌</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESTINATION circle (read-only) */}
          <aside className="destination">
            <div className="dest-circle">
              <div className="dest-text">{DATA.destination}</div>
            </div>
          </aside>
        </section>

        {/* BE ORANGE band */}
        <section className="orange-band">
          <div className="orange-band-top">
            <div className="band-col">Made possible by our people</div>
            <div className="band-center">BE ORANGE</div>
            <div className="band-col">Being true to our promises</div>

            {/* Centered box under BE ORANGE */}
            <div
              id={`row-${DATA.orangeCenter.id}`}
              className={`orange-center-box ${quizMode ? status[DATA.orangeCenter.id] || "" : ""}`}
            >
              {!quizMode ? (
                <span>Living the Orange Spirit</span>
              ) : (
                <>
                  <select
                    className={`ej-select ${
                      status[DATA.orangeCenter.id] === "correct"
                        ? "is-correct"
                        : status[DATA.orangeCenter.id] === "wrong"
                        ? "is-wrong"
                        : ""
                    }`}
                    value={answers[DATA.orangeCenter.id] || ""}
                    onChange={(e) =>
                      onSelect(
                        DATA.orangeCenter.id,
                        e.target.value,
                        DATA.orangeCenter.correct
                      )
                    }
                  >
                    <option value="" disabled>
                      Select the correct phrase…
                    </option>
                    {opts[DATA.orangeCenter.id].map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  {status[DATA.orangeCenter.id] === "correct" && (
                    <span className="mark ok-mark">✅</span>
                  )}
                  {status[DATA.orangeCenter.id] === "wrong" && (
                    <span className="mark no-mark">❌</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Value tiles */}
          <div className="orange-pills">
            {DATA.beOrange.map((tile) => {
              const st = status[tile.id];
              const val = answers[tile.id] || "";
              return (
                <div
                  id={`row-${tile.id}`}
                  key={tile.id}
                  className={`pill ${quizMode ? st || "" : ""}`}
                >
                  <h3 className="pill-title">{tile.title}</h3>
                  {!quizMode ? (
                    <div className="pill-sub">{tile.correct}</div>
                  ) : (
                    <div className="pill-select">
                      <select
                        className={`ej-select ${
                          st === "correct"
                            ? "is-correct"
                            : st === "wrong"
                            ? "is-wrong"
                            : ""
                        }`}
                        value={val}
                        onChange={(e) =>
                          onSelect(tile.id, e.target.value, tile.correct)
                        }
                      >
                        <option value="" disabled>
                          Select the correct phrase…
                        </option>
                        {opts[tile.id].map((v, i) => (
                          <option key={i} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                      {st === "correct" && (
                        <span className="mark ok-mark">✅</span>
                      )}
                      {st === "wrong" && (
                        <span className="mark no-mark">❌</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="ej-footer">
        <span>easyJet • Spirit</span>
        <span className="foot-pill">Internal training UI</span>
      </footer>
    </div>
  );
}
