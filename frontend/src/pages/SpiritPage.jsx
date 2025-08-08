import React, { useState } from "react";
import "../SpiritPage.css";

const SpiritPage = () => {
  const [mode, setMode] = useState("normal"); // 'normal' or 'quiz'

  const priorities = [
    {
      text: "Building Europe’s best network",
      options: [
        "Building Europe’s best network",
        "Expanding across Asia",
        "Cutting routes entirely",
      ],
    },
    {
      text: "Transforming revenue",
      options: [
        "Transforming revenue",
        "Focusing only on costs",
        "Reducing ticket sales",
      ],
    },
    {
      text: "Delivering ease and reliability",
      options: [
        "Delivering ease and reliability",
        "Focusing on complex processes",
        "Making travel harder",
      ],
    },
    {
      text: "Driving our low-cost model",
      options: [
        "Driving our low-cost model",
        "Raising fares dramatically",
        "Ignoring efficiency",
      ],
    },
  ];

  const beOrangeValues = [
    {
      label: "BE SAFE",
      value: "Always with safety at our heart",
      options: [
        "Always with safety at our heart",
        "Safety is optional",
        "Ignore safety protocols",
      ],
    },
    {
      label: "BE CHALLENGING",
      value: "Always challenging cost",
      options: [
        "Always challenging cost",
        "Avoid cost control",
        "Spend without limits",
      ],
    },
    {
      label: "BE BOLD",
      value: "Making a positive difference",
      options: [
        "Making a positive difference",
        "Avoid making change",
        "Follow the crowd",
      ],
    },
    {
      label: "BE WELCOMING",
      value: "Always warm and welcoming",
      options: [
        "Always warm and welcoming",
        "Cold and unapproachable",
        "Avoid passenger contact",
      ],
    },
  ];

  return (
    <div className="spirit-container">
      {/* Toggle button for demo (remove in final) */}
      {mode === "normal" && (
        <button
          className="mode-btn"
          onClick={() => setMode("quiz")}
        >
          Switch to Quiz Mode
        </button>
      )}

      <div className="spirit-layout">
        {/* Purpose Section */}
        <div className="purpose-section">
          <div className="purpose-content">
            <h3>PURPOSE</h3>
            <p>Making low-cost travel easy</p>
          </div>
        </div>

        {/* Priorities */}
        <div className="priorities-section">
          <h2>PRIORITIES</h2>
          <div className="priorities-list">
            {priorities.map((item, idx) => (
              <div className="priority-card" key={idx}>
                {mode === "normal" ? (
                  <span>{item.text}</span>
                ) : (
                  <select>
                    {item.options.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Destination */}
        <div className="destination-section">
          <h2>DESTINATION</h2>
          <div className="destination-circle">
            Europe’s most loved airline —
            <br />
            winning for our customers,
            <br />
            shareholders and people.
          </div>
        </div>
      </div>

      {/* BE ORANGE */}
      <div className="be-orange-section">
        <h2>BE ORANGE</h2>
        <div className="be-orange-values">
          {beOrangeValues.map((item, idx) => (
            <div className="value-card" key={idx}>
              <label>{item.label}</label>
              {mode === "normal" ? (
                <span>{item.value}</span>
              ) : (
                <select>
                  {item.options.map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiritPage;
