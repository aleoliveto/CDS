import React from "react";
import "../SpiritPage.css";

export default function SpiritPage() {
  const priorities = [
    "Building Europe’s best network",
    "Transforming revenue",
    "Delivering ease and reliability",
    "Driving our low-cost model",
  ];

  const values = [
    { label: "BE SAFE", desc: "Always with safety at our heart" },
    { label: "BE CHALLENGING", desc: "Always challenging cost" },
    { label: "BE BOLD", desc: "Making a positive difference" },
    { label: "BE WELCOMING", desc: "Always warm and welcoming" },
  ];

  return (
    <section className="spirit-frame" aria-label="easyJet Orange Spirit">
      {/* TOP (white) */}
      <div className="spirit-top">
        {/* PURPOSE + orange chevron */}
        <div className="purpose">
          <svg className="chevron" viewBox="0 0 340 360" preserveAspectRatio="none" aria-hidden="true">
            {/* tuned chevron */}
            <polygon points="0,0 260,180 0,360" fill="#ff6600" />
          </svg>

          <div className="purpose-text" aria-labelledby="purpose-title">
            <h2 id="purpose-title">PURPOSE</h2>
            <p>
              Making low-cost
              <br />
              travel easy
            </p>
          </div>
        </div>

        {/* PRIORITIES */}
        <div className="priorities">
          <h2 className="section-title main">PRIORITIES</h2>

          <ul className="priority-list">
            {priorities.map((t) => (
              <li key={t} className="priority-row">
                <span className="dot" aria-hidden="true" />
                <span className="dotted" aria-hidden="true" />
                <span className="plane" aria-hidden="true">
                  <img
                    src="https://img.icons8.com/ios-filled/50/ff6600/airplane-take-off.png"
                    alt=""
                    width="20"
                    height="20"
                  />
                </span>
                <span className="priority-text">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DESTINATION */}
        <div className="destination">
          <h2 className="section-title main">DESTINATION</h2>
          <div className="dest-bubble" role="figure" aria-label="Destination statement">
            Europe’s most loved airline —
            <br />
            winning for our customers,
            <br />
            shareholders and people.
          </div>
        </div>
      </div>

      {/* FOOTER (grey) */}
      <div className="spirit-footer">
        <div className="footer-top">
          <span>Made possible by our people</span>
          <h2 className="be-orange">BE ORANGE</h2>
          <span>Being true to our promises</span>
        </div>

        <div className="orange-pill" aria-label="Living the Orange Spirit">
          Living the Orange Spirit
        </div>

        <div className="values">
          {values.map((v) => (
            <div className="value" key={v.label}>
              <h3>{v.label}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
