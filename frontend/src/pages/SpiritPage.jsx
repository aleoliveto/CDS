import React from "react";
import "../SpiritPage.css";

export default function SpiritPage() {
  const priorities = [
    {
      title: "Build Europe’s best network",
      blurb: "Grow frequency and depth on the most valuable routes.",
      icon: "✈️",
    },
    {
      title: "Transform revenue",
      blurb: "Smarter pricing, better bundles, and ancillaries customers love.",
      icon: "💶",
    },
    {
      title: "Deliver ease & reliability",
      blurb: "Irresistibly simple booking and on-time performance.",
      icon: "⚙️",
    },
    {
      title: "Drive our low-cost model",
      blurb: "Lean operations and automation that scale.",
      icon: "📉",
    },
  ];

  const values = [
    { label: "Be Safe", desc: "Safety at the heart of every decision" },
    { label: "Be Challenging", desc: "Question cost and complexity" },
    { label: "Be Bold", desc: "Ship, learn, improve" },
    { label: "Be Welcoming", desc: "Warm, clear, human" },
  ];

  return (
    <main className="spirit-modern" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">Our Orange Spirit</h1>
        <p className="strap">A focused plan to win customers, people, and shareholders.</p>
      </header>

      <section className="layout">
        {/* PURPOSE */}
        <aside className="card purpose" aria-labelledby="purpose-title">
          <h2 id="purpose-title" className="kicker">Purpose</h2>
          <h3 className="big">Make low-cost travel effortless</h3>
          <p className="muted">
            We remove friction end-to-end so travelling with us feels simple, fast, and fair.
          </p>
        </aside>

        {/* PRIORITIES — timeline */}
        <section className="card priorities" aria-labelledby="priorities-title">
          <h2 id="priorities-title" className="kicker">Priorities</h2>
          <ol className="timeline">
            {priorities.map((p, i) => (
              <li key={p.title} className="step">
                <span className="dot" aria-hidden="true">{p.icon}</span>
                <div className="content">
                  <h3>{p.title}</h3>
                  <p>{p.blurb}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* DESTINATION */}
        <section className="card destination" aria-labelledby="destination-title">
          <h2 id="destination-title" className="kicker">Destination</h2>
          <h3 className="big">Europe’s most trusted low-cost airline</h3>
          <ul className="kpis">
            <li>
              <span className="kpi">+8pt</span>
              <span className="kpi-label">NPS</span>
            </li>
            <li>
              <span className="kpi">95%</span>
              <span className="kpi-label">On-time</span>
            </li>
            <li>
              <span className="kpi">–6%</span>
              <span className="kpi-label">Unit cost</span>
            </li>
          </ul>
        </section>
      </section>

      {/* VALUES */}
      <section className="values" aria-labelledby="values-title">
        <h2 id="values-title" className="kicker center">Be Orange</h2>
        <ul className="chips">
          {values.map(v => (
            <li key={v.label} className="chip" tabIndex={0}>
              <strong>{v.label}</strong>
              <span>{v.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
