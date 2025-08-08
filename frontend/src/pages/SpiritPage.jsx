import React, { useMemo, useState, useEffect } from "react";
import "../SpiritPage.css";

/**
 * easyJet SpiritPage — Board-Style Build
 * - View Mode: mirrors the internal “board” layout (chevron Purpose, dotted Priorities,
 *   Destination circle, BE ORANGE band)
 * - Quiz Mode: dropdown MCQs with randomized distractors, one-way switch
 * - Instant feedback: ✅ green fade / ❌ red shake
 * - Strict containment & responsive (desktop + iPad)
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
      hint: "Made possible by our people",
      distractors: ["Living the Green Spirit", "Embracing the Blue Vision"],
    },
    {
      label: "BE SAFE — Always with safety at our heart",
      hint: "—",
      distractors: ["Safety is optional", "Safety only for long flights"],
    },
    {
      label: "BE CHALLENGING — Always challenging cost",
      hint: "—",
      distractors: [
        "Always reducing ticket prices to zero",
        "Always ignoring costs",
      ],
    },
    {
      label: "BE BOLD — Making a positive difference",
      hint: "—",
      distractors: ["Making a neutral impact", "Making a negative difference"],
    },
    {
      label: "BE WELCOMING — Always warm and welcoming",
      hint: "Being true to our promises",
      distractors: [
        "Always distant and cold",
        "Always neutral and reserved",
      ],
    },
  ],
};

// Utils
function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
      prompt: `Choose the real phrase`,
      correct: v.label,
      options: shuffle([v.label, ...v.distractors]),
    })
  );
  return items;
}

// Small inline airplane icon
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

      {!quizMode ? (
        <main className="board-wrap" role="main">
          {/* TOP STRIP: PRIORITIES heading */}
          <div className="board-head">
            <div className="board-head-left">PRIORITIES</div>
            <div className="board-head-right">DESTINATION</div>
          </div>

          {/* CORE ROW: chevron purpose, priorities list, destination circle */}
          <section className="board-core">
            {/* Purpose chevron */}
            <aside className="purpose">
              <div className="purpose-inner">
                <div className="purpose-title">PURPOSE</div>
                <div className="purpose-body">
                  <div>Making</div>
                  <div>low-cost</div>
                  <div>travel easy</div>
                </div>
              </div>
              <div className="purpose-chevron" aria-hidden />
            </aside>

            {/* Priorities list with dotted leaders and plane icons */}
            <div className="prio-list">
              {DATA.priorities.map((p, i) => (
                <div key={i} className="prio-row">
                  <div className="prio-dot" />
                  <div className="prio-leader">
                    <Plane />
                    <span className="prio-text">{p.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Destination big circle */}
            <aside className="destination">
              <div className="dest-circle">
                <div className="dest-text">
                  Europe’s most loved airline — winning for our customers,
                  shareholders and people.
                </div>
              </div>
            </aside>
          </section>

          {/* BE ORANGE band */}
          <section className="orange-band">
            <div className="orange-band-top">
              <div className="band-col">Made possible by our people</div>
              <div className="band-center">BE ORANGE</div>
              <div className="band-col">Being true to our promises</div>
            </div>

            <div className="orange-pills">
              <div className="pill">
                <div className="pill-title">BE SAFE</div>
                <div className="pill-sub">Always with safety at our heart</div>
              </div>
              <div className="pill">
                <div className="pill-title">BE CHALLENGING</div>
                <div className="pill-sub">Always challenging cost</div>
              </div>
              <div className="pill">
                <div className="pill-title">BE BOLD</div>
                <div className="pill-sub">Making a positive difference</div>
              </div>
              <div className="pill">
                <div className="pill-title">BE WELCOMING</div>
                <div className="pill-sub">Always warm and welcoming</div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="quiz-wrap" role="main">
          <section className="quiz-head">
            <h2>Quiz Mode</h2>
            <p>
              Select the real easyJet phrase from each dropdown. Instant
              feedback will confirm your choices. Once in Quiz Mode, you can’t
              return to View Mode.
            </p>
          </section>

          {["Purpose", "Destination", "Priorities", "BE ORANGE"].map((group) => (
            <section key={group} className="quiz-group">
              <div className="quiz-group-head">
                <span className="chip">{group}</span>
                <h3>{group}</h3>
              </div>

              {quizItems
                .filter((q) => q.group === group)
                .map((q) => {
                  const st = status[q.id];
                  const val = answers[q.id] ?? "";
                  const ok = st === "correct";
                  const no = st === "wrong";

                  return (
                    <div
                      id={`row-${q.id}`}
                      key={q.id}
                      className={`quiz-row ${ok ? "ok" : no ? "no" : ""}`}
                    >
                      <label htmlFor={`sel-${q.id}`}>{q.prompt}</label>

                      <div className="select-wrap">
                        <select
                          id={`sel-${q.id}`}
                          className={`ej-select ${ok ? "is-correct" : no ? "is-wrong" : ""}`}
                          value={val}
                          onChange={(e) => handleSelect(q.id, e.target.value, q.correct)}
                        >
                          <option value="" disabled>
                            Select the correct phrase…
                          </option>
                          {q.options.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>

                        {ok && <span className="mark ok-mark">✅</span>}
                        {no && <span className="mark no-mark">❌</span>}
                      </div>
                    </div>
                  );
                })}
            </section>
          ))}
        </main>
      )}

      <footer className="ej-footer">
        <span>easyJet • Spirit</span>
        <span className="foot-pill">Internal training UI</span>
      </footer>
    </div>
  );
}
