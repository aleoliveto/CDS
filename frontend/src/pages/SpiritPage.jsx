import React, { useState } from "react";
import "../SpiritPage.css";

const SpiritPage = () => {
  const [quizMode, setQuizMode] = useState(false);

  const priorities = [
    "Building Europe’s best network",
    "Transforming revenue",
    "Delivering ease and reliability",
    "Driving our low-cost model"
  ];

  const beOrangeValues = [
    { label: "Living the Orange Spirit", correct: "Living the Orange Spirit", options: ["Living the Orange Spirit", "Living the Blue Spirit", "Flying the Orange Sky"] },
    { label: "BE SAFE", correct: "Always with safety at our heart", options: ["Always with safety at our heart", "Sometimes safety", "Only safety at takeoff"] },
    { label: "BE CHALLENGING", correct: "Always challenging cost", options: ["Always challenging cost", "Sometimes challenging cost", "Never challenging cost"] },
    { label: "BE BOLD", correct: "Making a positive difference", options: ["Making a positive difference", "Making a small change", "Avoiding any difference"] },
    { label: "BE WELCOMING", correct: "Always warm and welcoming", options: ["Always warm and welcoming", "Sometimes welcoming", "Never welcoming"] }
  ];

  return (
    <div className="spirit-container">
      {/* Header */}
      <header className="spirit-header">
        <h1>easyJet Spirit</h1>
        <button
          className="quiz-toggle"
          onClick={() => setQuizMode(true)}
          disabled={quizMode}
        >
          {quizMode ? "Quiz Mode Active" : "Switch to Quiz Mode"}
        </button>
      </header>

      {/* Purpose */}
      <section className="purpose-card">
        <h2>PURPOSE</h2>
        <p>Making low-cost travel easy</p>
      </section>

      {/* Priorities */}
      <section className="priorities-section">
        <h2>PRIORITIES</h2>
        <div className="priorities-grid">
          {priorities.map((item, i) => (
            <div key={i} className="priority-card">
              {quizMode ? (
                <select className="quiz-select">
                  {[item, "Another option", "Different answer"].map(
                    (opt, idx) => (
                      <option key={idx}>{opt}</option>
                    )
                  )}
                </select>
              ) : (
                <p>{item}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Destination */}
      <section className="destination-banner">
        <h2>DESTINATION</h2>
        <p>
          Europe’s most loved airline — winning for our customers, shareholders
          and people.
        </p>
      </section>

      {/* BE ORANGE */}
      <section className="be-orange-section">
        <h2>BE ORANGE</h2>
        <div className="be-orange-grid">
          {beOrangeValues.map((value, i) => (
            <div key={i} className="be-orange-card">
              <h3>{value.label}</h3>
              {quizMode ? (
                <select className="quiz-select">
                  {value.options.map((opt, idx) => (
                    <option key={idx}>{opt}</option>
                  ))}
                </select>
              ) : (
                <p>{value.correct}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="spirit-footer">
        Made possible by our people
      </footer>
    </div>
  );
};

export default SpiritPage;
