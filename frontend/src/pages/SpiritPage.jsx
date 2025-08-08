import React, { useState } from "react";
import "../SpiritPage.css";

const priorities = [
  "Building Europe’s best network",
  "Transforming revenue",
  "Delivering ease and reliability",
  "Driving our low-cost model",
];

const beOrangeValues = [
  { label: "Living the Orange Spirit" },
  { label: "Always with safety at our heart" },
  { label: "Always challenging cost" },
  { label: "Making a positive difference" },
  { label: "Always warm and welcoming" },
];

// distractors for quiz mode
const distractors = {
  "Building Europe’s best network": [
    "Expanding across the Atlantic",
    "Building Asia’s best network",
  ],
  "Transforming revenue": [
    "Transforming customer support",
    "Maximising route coverage",
  ],
  "Delivering ease and reliability": [
    "Delivering new aircraft quickly",
    "Maximising booking complexity",
  ],
  "Driving our low-cost model": [
    "Driving our premium service",
    "Increasing fuel consumption",
  ],
  "Living the Orange Spirit": [
    "Living the Blue Spirit",
    "Flying the Orange Sky",
  ],
  "Always with safety at our heart": [
    "Safety as a secondary goal",
    "Occasionally thinking of safety",
  ],
  "Always challenging cost": [
    "Always challenging passengers",
    "Always challenging destinations",
  ],
  "Making a positive difference": [
    "Making a difference only in summer",
    "Focusing only on profits",
  ],
  "Always warm and welcoming": [
    "Always cold and distant",
    "Sometimes welcoming",
  ],
};

export default function SpiritPage() {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleAnswerChange = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setScore(null);
    setAnswers({});
  };

  const submitQuiz = () => {
    let correctCount = 0;
    priorities.forEach((p) => {
      if (answers[p] === p) correctCount++;
    });
    beOrangeValues.forEach((v) => {
      if (answers[v.label] === v.label) correctCount++;
    });
    setScore(correctCount);
  };

  const getOptions = (correct) => {
    const wrong = distractors[correct] || [];
    const all = [correct, ...wrong];
    return all.sort(() => Math.random() - 0.5);
  };

  return (
    <div className="spirit-outer">
      <div className="spirit-frame">
        <div className="spirit-header">
          <h1>Our Purpose</h1>
          <p>Making low-cost travel easy</p>
        </div>

        {!isQuizMode && (
          <>
            <div className="spirit-section priorities">
              <h2>Priorities</h2>
              <div className="priority-list">
                {priorities.map((p, i) => (
                  <div key={i} className="priority-card fade-in">
                    <span className="priority-index">{i + 1}</span>
                    <p>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="spirit-section destination">
              <h2>Destination</h2>
              <p>
                Europe’s most loved airline — winning for our customers,
                shareholders and people.
              </p>
            </div>

            <div className="spirit-section be-orange">
              <h2>BE ORANGE</h2>
              <div className="orange-values">
                {beOrangeValues.map((v, i) => (
                  <div key={i} className="value-card fade-in">
                    <p>{v.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="spirit-footer">
              <button className="start-btn" onClick={startQuiz}>
                Start Test
              </button>
            </div>
          </>
        )}

        {isQuizMode && (
          <>
            <div className="spirit-section priorities">
              <h2>Priorities (Quiz)</h2>
              {priorities.map((p, i) => (
                <div key={i} className="quiz-row">
                  <label>{i + 1}.</label>
                  <select
                    value={answers[p] || ""}
                    onChange={(e) => handleAnswerChange(p, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {getOptions(p).map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="spirit-section be-orange">
              <h2>BE ORANGE (Quiz)</h2>
              {beOrangeValues.map((v, i) => (
                <div key={i} className="quiz-row">
                  <label>{i + 1}.</label>
                  <select
                    value={answers[v.label] || ""}
                    onChange={(e) => handleAnswerChange(v.label, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {getOptions(v.label).map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="spirit-footer">
              <button className="submit-btn" onClick={submitQuiz}>
                Submit Answers
              </button>
              {score !== null && (
                <div className="score-display">
                  Your score: {score} / {priorities.length + beOrangeValues.length}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
