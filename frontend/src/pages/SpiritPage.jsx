// src/pages/SpiritPage.jsx

import React, { useState } from "react";
import "../SpiritPage.css"; // We'll create styles here

const dropdownOptions = {
  beOrange: [
    "Living the Orange Spirit",
    "Embracing the Orange Culture",
    "Leading with Orange Values",
  ],
  beSafe: [
    "Always with safety at our heart",
    "Safety first, always",
    "Committed to safety",
  ],
  beChallenging: [
    "Always challenging cost",
    "Constantly improving efficiency",
    "Challenging the status quo",
  ],
  beBold: [
    "Making a positive difference",
    "Taking bold steps",
    "Innovating for the future",
  ],
  beWelcoming: [
    "Always warm and welcoming",
    "Creating a welcoming environment",
    "Open and friendly at all times",
  ],
};

export default function SpiritPage() {
  const [selections, setSelections] = useState({
    beOrange: "",
    beSafe: "",
    beChallenging: "",
    beBold: "",
    beWelcoming: "",
  });

  const handleChange = (key, value) => {
    setSelections((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    alert("Your selections:\n" + JSON.stringify(selections, null, 2));
    // Here you can add backend saving logic
  };

  return (
    <div className="spirit-page">
      <h2 className="page-title">Living the Orange Spirit</h2>

      <div className="image-container">
        <img
          src="/spirit-background.png" // Add your uploaded image to public/spirit-background.png
          alt="Spirit Background"
          className="spirit-image"
        />

        {/* Dropdown overlays */}
        <select
          className="dropdown beOrange"
          value={selections.beOrange}
          onChange={(e) => handleChange("beOrange", e.target.value)}
        >
          <option value="">-- Select BE ORANGE --</option>
          {dropdownOptions.beOrange.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          className="dropdown beSafe"
          value={selections.beSafe}
          onChange={(e) => handleChange("beSafe", e.target.value)}
        >
          <option value="">-- Select BE SAFE --</option>
          {dropdownOptions.beSafe.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          className="dropdown beChallenging"
          value={selections.beChallenging}
          onChange={(e) => handleChange("beChallenging", e.target.value)}
        >
          <option value="">-- Select BE CHALLENGING --</option>
          {dropdownOptions.beChallenging.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          className="dropdown beBold"
          value={selections.beBold}
          onChange={(e) => handleChange("beBold", e.target.value)}
        >
          <option value="">-- Select BE BOLD --</option>
          {dropdownOptions.beBold.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          className="dropdown beWelcoming"
          value={selections.beWelcoming}
          onChange={(e) => handleChange("beWelcoming", e.target.value)}
        >
          <option value="">-- Select BE WELCOMING --</option>
          {dropdownOptions.beWelcoming.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Selections
      </button>
    </div>
  );
}
