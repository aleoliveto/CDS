import React, { useState } from "react";
import "../SpiritPage.css";

const SpiritPage = () => {
  const [quizMode, setQuizMode] = useState(false);

  const priorities = [
    "Building Europe’s best network",
    "Transforming revenue",
    "Delivering ease and reliability",
    "Driving our low-cost model",
  ];

  const beOrangeValues = [
    { label: "BE SAFE", value: "Always with safety at our heart" },
    { label: "BE CHALLENGING", value: "Always challenging cost" },
    { label: "BE BOLD", value: "Making a positive difference" },
    { label: "BE WELCOMING", value: "Always warm and welcoming" },
  ];

  const dropdownOptions = (correct) => {
    const distractors = [
      "Keeping our passengers entertained",
      "Always flying to new destinations",
      "Making ticket prices higher",
    ];
    return [correct, ...distractors].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="spirit-wrapper">
      {/* Header */}
      <header className="spirit-header">
        <h1 className="spirit-title">OUR PURPOSE</h1>
        <p className="spirit-subtitle">Making low-cost travel easy</p>
        {!quizMode && (
          <button className="quiz-btn" onClick={() => setQuizMode(true)}>
            Switch to Quiz Mode
          </button>
        )}
      </header>

      {/* Priorities */}
      <section className="priorities-section">
        <h2 className="section-heading">OUR PRIORITIES</h2>
        <div className="priorities-grid">
          {priorities.map((priority, idx) => (
            <div key={idx} className="priority-card">
              {quizMode ? (
                <select className="quiz-select">
                  {dropdownOptions(priority).map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              ) : (
                <p>{priority}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Destination */}
      <section className="destination-section">
        <h2 className="section-heading">DESTINATION</h2>
        <p>
          Europe’s most loved airline — winning for our customers,
          shareholders, and people.
        </p>
      </section>

      {/* BE ORANGE */}
      <section className="be-orange-section">
        <h2 className="section-heading">BE ORANGE</h2>
        <div className="be-orange-grid">
          <div className="be-orange-card main-card">
            {quizMode ? (
              <select className="quiz-select">
                {dropdownOptions("Living the Orange Spirit").map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
            ) : (
              <p>Living the Orange Spirit</p>
            )}
          </div>
          {beOrangeValues.map((item, idx) => (
            <div key={idx} className="be-orange-card">
              <h3>{item.label}</h3>
              {quizMode ? (
                <select className="quiz-select">
                  {dropdownOptions(item.value).map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              ) : (
                <p>{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SpiritPage;
