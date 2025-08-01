import React, { useState } from "react";
import Modal from "./Modal";
import "../FlightDeck.css";

const cockpitToolConfig = {
  0: [ 
    { label: "Contact Dispatch", value: "dispatch", boost: 5 },
    { label: "Review Weather Charts", value: "weather", boost: 5 },
  ],
  1: [
    { label: "Check NOTAMs", value: "notams", boost: 5 },
    { label: "Check FDP Table on Docunet", value: "fdp", boost: 10, modal: true },
  ],
  2: [
    { label: "Run Through Briefing Checklist", value: "briefing", boost: 5 },
  ],
  3: [
    { label: "Make a PA", value: "pa", boost: 5 },
    { label: "Talk to Cabin Crew", value: "crew", boost: 5 },
  ],
  4: [
    { label: "Monitor Weather Radar", value: "radar", boost: 5 },
    { label: "Use Cabin Interphone", value: "interphone", boost: 5 },
  ],
  5: [
    { label: "Review Taxi Route", value: "taxi", boost: 5 },
  ],
  6: [
    { label: "Log Safety Occurrences", value: "safety", boost: 5 },
  ],
};

const CockpitTools = ({ currentPhase, base, onLogAction, onScoreBoost }) => {
  const [usedToolsByPhase, setUsedToolsByPhase] = useState({});
  const [modalImage, setModalImage] = useState(null);

  const tools = cockpitToolConfig[currentPhase] || [];
  const usedTools = usedToolsByPhase[currentPhase] || [];

  const handleToggle = (tool) => {
    let updatedTools;

    if (usedTools.includes(tool.value)) {
      updatedTools = usedTools.filter((t) => t !== tool.value);
      onLogAction(`${tool.label} reverted`);
      onScoreBoost(-tool.boost);
    } else {
      updatedTools = [...usedTools, tool.value];
      onLogAction(`${tool.label} completed`);
      onScoreBoost(tool.boost);

      if (tool.modal && tool.value === "fdp") {
        setModalImage(`/fdp-tables/${base}.png`);
      }
    }

    setUsedToolsByPhase((prev) => ({
      ...prev,
      [currentPhase]: updatedTools,
    }));
  };

  return (
    <div className="cockpit-tools">
      {tools.length === 0 && <p>No tools available for this phase.</p>}

      {tools.map((tool) => (
        <label key={tool.value} className="tool-item">
          <input
            type="checkbox"
            onChange={() => handleToggle(tool)}
            checked={usedTools.includes(tool.value)}
          />
          <span>{tool.label}</span>
        </label>
      ))}

      {modalImage && (
        <Modal onClose={() => setModalImage(null)}>
          <img
            src={modalImage}
            alt="FDP Table"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </Modal>
      )}
    </div>
  );
};

export default CockpitTools;
