import React, { useMemo, useState, useEffect } from "react";
import "../SpiritPage.css";

/**
 * easyJet SpiritPage — Presentation Build
 * - View Mode: branded, premium layout
 * - Quiz Mode: randomized dropdown MCQs with instant feedback
 * - One-way switch to Quiz Mode (locked)
 * - Strict containment: no overflow/clipping at any breakpoint
 */

const DATA = {
  purpose: {
    label: "Purpose",
    value: "Making low-cost travel easy",
    distractors: ["Making high-cost travel luxurious", "Making every seat free"],
  },
  destination: {
    label: "Destination",
    value:
      "Europe’s most loved airline — winning for our customers, shareholders and people.",
    distractors: [
      "The world’s most luxurious airline — delighting VIPs only.",
      "The biggest airline on Earth — at any cost.",
    ],
  },
  priorities: [
    {
      label: "Building Europe’s best network",
      distractors: [
        "Becoming the world’s biggest carrier",
        "Connecting every country in the world",
      ],
    },
    {
      label: "Transforming revenue",
      distractors: ["Maximising flight occupancy", "Expanding customer loyalty"],
    },
    {
      label: "Delivering ease and reliability",
      distractors: [
        "Improving cabin seating",
        "Offering the lowest fares always",
      ],
    },
    {
      label: "Driving our low-cost model",
      distractors: [
        "Cutting all customer amenities",
        "Reducing aircraft maintenance",
      ],
    },
  ],
  beOrange: [
    {
      label: "Living the Orange Spirit",
      hint: "Orange Spirit",
      distractors: ["Living the Green Spirit", "Embracing the Blue Vision"],
    },
    {
      label: "BE SAFE — Always with safety at our heart",
      hint: "BE SAFE",
      distractors: ["Safety is optional", "Safety only for long flights"],
    },
    {
      label: "BE CHALLENGING — Always challenging cost",
      hint: "BE CHALLENGING",
      distractors: [
        "Always reducing ticket prices to zero",
        "Always ignoring costs",
      ],
    },
    {
      label: "BE BOLD — Making a positive difference",
      hint: "BE BOLD",
      distractors: ["Making a neutral impact", "Making a negative difference"],
    },
    {
      label: "BE WELCOMING — Always warm and welcoming",
      hint: "BE WELCOMING",
      distractors: [
        "Always distant and cold",
        "Always neutral and reserved",
      ],
    },
  ],
};

// Shuffle (Fisher–Yates)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuizItems() {
  const items = [];
  items.push({
    id: "purpose",
    group: "Purpose",
    prompt: "Select the correct Purpose phrase",
    correct: DATA.purpose.value,
    options: shuffle([DATA.purpose.value, ...DATA.purpose.distractors]),
  });
  items.push({
    id: "destination",
    group: "Destination",
    prompt: "Select the correct Destination phrase",
    correct: DATA.destination.value,
    options: shuffle([DATA.destination.value, ...DATA.destination.distractors]),
  });
  DATA.priorities.forEach((p, i) =>
    items.push({
      id: `priority-${i}`,
      group: "Priorities",
      prompt: "Choose the real priority",
      correct: p.label,
      options: shuffle([p.label, ...p.distractors]),
    })
  );
  DATA.beOrange.forEach((v, i) =>
    items.push({
      id: `orange-${i}`,
      group: "BE ORANGE",
      prompt: `Choose the real phrase for ${v.hint}`,
      correct: v.label,
      options: shuffle([v.label, ...v.distractors]),
    })
  );
  return items;
}

const Tag = ({ children, tone = "primary" }) => (
  <span className={`ej-tag ej-tag-${tone}`}>{children}</span>
);

const Card = ({ children, className = "" }) => (
  <article className={`ej-card ${className}`}>{children}</article>
);

export default function SpiritPage() {
  const [quizMode, setQuizMode] = useState(false);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({});

  const quizItems = useMemo(buildQuizItems, []);

  useEffect(() => {
    if (quizMode) setLocked(true);
  }, [quizMode]);

  const handleSelect = (id, value, correct) => {
    const ok = value === correct;
    setAnswers((p) => ({ ...p, [id]: value }));
    setStatus((p) => ({ ...p, [id]: ok ? "correct" : "wrong" }));

    if (!ok) {
      const row = document.getElementById(`row-${id}`);
      if (row) {
        row.classList.remove("shake-now");
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        row.offsetHeight;
        row.classList.add("shake-now");
        setTimeout(() => row.classList.remove("shake-now"), 550);
      }
    }
  };

  return (
    <div className="spirit-root">
      <div className="ej-rail" aria-hidden />

      <header className="ej-header">
        <div className="ej-brand">
          <div className="ej-logo-dot" />
          <h1 className="ej-title">easyJet Spirit</h1>
        </div>
        <div className="ej-mode">
          <span className={`mode-pill ${quizMode ? "active" : ""}`}>
            {quizMode ? "Quiz Mode (locked)" : "View Mode"}
          </span>
          <button
            className="ej-btn"
            onClick={() => setQuizMode(true)}
            disabled={locked}
            aria-disabled={locked}
            title={locked ? "Quiz Mode is locked" : "Switch to Quiz Mode"}
          >
            {locked ? "Quiz Mode" : "Start Quiz"}
          </button>
        </div>
      </header>

      {/* Guarded canvas to prevent any bleed/clipping */}
      <div className="ej-guard">
        {!quizMode ? (
          <main className="ej-content">
            {/* Purpose / Destination */}
            <section className="ej-grid ej-grid-2">
              <Card className="card-hero fade-in">
                <div className="ej-card-head">
                  <Tag>Purpose</Tag>
                  <h2 className="ej-h2">Making low-cost travel easy</h2>
                </div>
                <p className="ej-lead">
                  We exist to make travel simple, affordable, and accessible —
                  with the reliability our customers expect.
                </p>
              </Card>

              <Card className="card-hero fade-in">
                <div className="ej-card-head">
                  <Tag tone="neutral">Destination</Tag>
                  <h2 className="ej-h2">
                    Europe’s most loved airline — winning for our customers,
                    shareholders and people.
                  </h2>
                </div>
                <p className="ej-lead">
                  Our destination is clear: the airline people choose, trust and
                  recommend.
                </p>
              </Card>
            </section>

            {/* Priorities */}
            <section className="ej-section">
              <div className="ej-section-head">
                <Tag>Priorities</Tag>
                <h3 className="ej-h3">How we win</h3>
              </div>

              <div className="ej-grid ej-grid-4">
                {DATA.priorities.map((p, i) => (
                  <Card key={i} className="slide-in">
                    <h4 className="ej-card-title">{p.label}</h4>
                    <p className="ej-card-copy">
                      Focused execution to strengthen the core and unlock
                      growth.
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* BE ORANGE */}
            <section className="ej-section">
              <div className="ej-section-head">
                <Tag>BE ORANGE</Tag>
                <h3 className="ej-h3">How we show up</h3>
              </div>

              <div className="ej-grid ej-grid-3">
                {DATA.beOrange.map((v, i) => (
                  <Card key={i} className="fade-in">
                    <div className="ej-subtle">{v.hint}</div>
                    <h4 className="ej-card-title">{v.label}</h4>
                    <p className="ej-card-copy">
                      The orange thread in everything we do — for customers,
                      colleagues and our communities.
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          </main>
        ) : (
          <main className="ej-content">
            <section className="ej-quiz-head">
              <h2 className="ej-h2">Quiz Mode</h2>
              <p className="ej-muted">
                Select the real easyJet phrase from each dropdown. Instant
                feedback will confirm your choices. Once in Quiz Mode, you can’t
                return to View Mode.
              </p>
            </section>

            <section className="ej-quiz">
              {["Purpose", "Destination", "Priorities", "BE ORANGE"].map(
                (group) => (
                  <div key={group} className="ej-quiz-group">
                    <div className="ej-section-head compact">
                      <Tag>{group}</Tag>
                      <h3 className="group-title ej-h3">{group}</h3>
                    </div>

                    <div className="quiz-list">
                      {quizItems
                        .filter((q) => q.group === group)
                        .map((q) => {
                          const st = status[q.id];
                          const val = answers[q.id] ?? "";
                          const isCorrect = st === "correct";
                          const isWrong = st === "wrong";

                          return (
                            <div
                              id={`row-${q.id}`}
                              key={q.id}
                              className={`quiz-row ${
                                isCorrect ? "ok" : isWrong ? "no" : ""
                              }`}
                            >
                              <label
                                htmlFor={`sel-${q.id}`}
                                className="quiz-label"
                              >
                                {q.prompt}
                              </label>

                              <div className="quiz-input-wrap">
                                <select
                                  id={`sel-${q.id}`}
                                  className={`ej-select ${
                                    isCorrect
                                      ? "is-correct"
                                      : isWrong
                                      ? "is-wrong"
                                      : ""
                                  }`}
                                  value={val}
                                  onChange={(e) =>
                                    handleSelect(
                                      q.id,
                                      e.target.value,
                                      q.correct
                                    )
                                  }
                                >
                                  <option value="" disabled>
                                    Select the correct phrase…
                                  </option>
                                  {q.options.map((opt, idx) => (
                                    <option key={idx} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>

                                {isCorrect && (
                                  <span className="quiz-mark ok-mark">✅</span>
                                )}
                                {isWrong && (
                                  <span className="quiz-mark no-mark">❌</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )
              )}
            </section>
          </main>
        )}
      </div>

      <footer className="ej-footer">
        <div className="ej-foot-left">
          <span className="ej-kicker">easyJet</span>
          <span className="ej-divider" />
          <span className="ej-kicker">Spirit</span>
        </div>
        <div className="ej-foot-right">
          <span className="ej-pill">Premium Training UI</span>
        </div>
      </footer>
    </div>
  );
}
