import React, { useState } from "react";
import "../SpiritPage.css";

export default function SpiritPage() {
  const [quizMode, setQuizMode] = useState(false);

  const toggleQuizMode = () => {
    if (!quizMode) setQuizMode(true);
  };

  const priorities = [
    {
      title: "Building Europe’s best network",
      correct: "Building Europe’s best network",
      options: [
        "Becoming the world’s biggest carrier",
        "Connecting every country in the world",
        "Building Europe’s best network"
      ]
    },
    {
      title: "Transforming revenue",
      correct: "Transforming revenue",
      options: [
        "Maximising flight occupancy",
        "Expanding customer loyalty",
        "Transforming revenue"
      ]
    },
    {
      title: "Delivering ease and reliability",
      correct: "Delivering ease and reliability",
      options: [
        "Improving cabin seating",
        "Offering the lowest fares always",
        "Delivering ease and reliability"
      ]
    },
    {
      title: "Driving our low-cost model",
      correct: "Driving our low-cost model",
      options: [
        "Cutting all customer amenities",
        "Reducing aircraft maintenance",
        "Driving our low-cost model"
      ]
    }
  ];

  const beOrange = [
    {
      title: "BE SAFE",
      correct: "Always with safety at our heart",
      options: [
        "Safety is optional",
        "Safety only for long flights",
        "Always with safety at our heart"
      ]
    },
    {
      title: "BE CHALLENGING",
      correct: "Always challenging cost",
      options: [
        "Always reducing ticket prices to zero",
        "Always ignoring costs",
        "Always challenging cost"
      ]
    },
    {
      title: "BE BOLD",
      correct: "Making a positive difference",
      options: [
        "Making a neutral impact",
        "Making a negative difference",
        "Making a positive difference"
      ]
    },
    {
      title: "BE WELCOMING",
      correct: "Always warm and welcoming",
      options: [
        "Always distant and cold",
        "Always neutral and reserved",
        "Always warm and welcoming"
      ]
    }
  ];

  const handleSelect = (e, correct) => {
    if (e.target.value === correct) {
      e.target.classList.add("correct");
      e.target.classList.remove("incorrect");
    } else {
      e.target.classList.add("incorrect");
      e.target.classList.remove("correct");
    }
  };

  return (
    <div className="spirit-page">
      <header>
        <h1>easyJet Spirit</h1>
        <button
          className={quizMode ? "quiz-btn-locked" : "quiz-btn"}
          onClick={toggleQuizMode}
        >
          {quizMode ? "Quiz Mode (locked)" : "Start Quiz"}
        </button>
      </header>

      <div className="spirit-card">
        <h2 className="section-title">PRIORITIES</h2>
        <h2 className="section-title right">DESTINATION</h2>

        <div className="purpose-box">
          <h3>PURPOSE</h3>
          {!quizMode ? (
            <p>Making low-cost travel easy</p>
          ) : (
            <select onChange={(e) => handleSelect(e, "Making low-cost travel easy")}>
              <option>Select the correct phrase..</option>
              <option>Making low-cost travel easy</option>
              <option>Making high-cost travel luxurious</option>
              <option>Making every seat free</option>
            </select>
          )}
        </div>

        <div className="destination-circle">
          {!quizMode ? (
            <p>
              Europe’s most loved airline — winning for our customers, shareholders
              and people.
            </p>
          ) : (
            <select
              onChange={(e) =>
                handleSelect(
                  e,
                  "Europe’s most loved airline — winning for our customers, shareholders and people."
                )
              }
            >
              <option>Select the correct phrase..</option>
              <option>
                Europe’s most loved airline — winning for our customers, shareholders
                and people.
              </option>
              <option>Becoming the world’s most luxurious airline</option>
              <option>Connecting every continent</option>
            </select>
          )}
        </div>

        <div className="priority-list">
          {priorities.map((item, idx) => (
            <div key={idx} className="priority-item">
              {!quizMode ? (
                <span>{item.title}</span>
              ) : (
                <select onChange={(e) => handleSelect(e, item.correct)}>
                  <option>Select the correct phrase..</option>
                  {item.options.sort(() => Math.random() - 0.5).map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <section className="orange-band">
        <div className="orange-band-top">
          <div className="band-col">Made possible by our people</div>
          <div className="band-center">BE ORANGE</div>
          <div className="band-col">Being true to our promises</div>
          <div className="orange-center-box">
            {!quizMode ? (
              <span>Living the Orange Spirit</span>
            ) : (
              <select
                onChange={(e) => handleSelect(e, "Living the Orange Spirit")}
              >
                <option>Select the correct phrase..</option>
                <option>Living the Orange Spirit</option>
                <option>Living the Green Spirit</option>
                <option>Embracing the Blue Vision</option>
              </select>
            )}
          </div>
        </div>

        <div className="orange-pills">
          {beOrange.map((item, idx) => (
            <div key={idx} className="pill">
              <h3>{item.title}</h3>
              {!quizMode ? (
                <span>{item.correct}</span>
              ) : (
                <select onChange={(e) => handleSelect(e, item.correct)}>
                  <option>Select the correct phrase..</option>
                  {item.options.sort(() => Math.random() - 0.5).map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
