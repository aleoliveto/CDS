// SpiritPage.jsx
import React from 'react';
import '../SpiritPage.css';

const SpiritPage = () => {
  const priorities = [
    'Building Europe’s best network',
    'Transforming revenue',
    'Delivering ease and reliability',
    'Driving our low-cost model'
  ];

  const values = [
    { label: 'BE SAFE', desc: 'Always with safety at our heart' },
    { label: 'BE CHALLENGING', desc: 'Always challenging cost' },
    { label: 'BE BOLD', desc: 'Making a positive difference' },
    { label: 'BE WELCOMING', desc: 'Always warm and welcoming' }
  ];

  return (
    <div className="spirit-wrapper">
      <div className="spirit-top">
        <div className="spirit-purpose">
          <div className="triangle-left" />
          <div className="purpose-text">
            <h2>PURPOSE</h2>
            <p>Making low-cost<br />travel easy</p>
          </div>
        </div>

        <div className="spirit-priorities">
          <h2 className="orange-title">PRIORITIES</h2>
          {priorities.map((p, i) => (
            <div className="priority-row" key={i}>
              <div className="dot" />
              <div className="dotted-line" />
              <div className="plane-icon">
                <img
                  src="https://img.icons8.com/ios-filled/50/ff6600/airplane-take-off.png"
                  alt="Plane"
                />
              </div>
              <div className="priority-text">{p}</div>
            </div>
          ))}
        </div>

        <div className="spirit-destination">
          <h2 className="orange-title">DESTINATION</h2>
          <div className="destination-circle">
            Europe’s most loved airline —<br />
            winning for our customers,<br />
            shareholders and people.
          </div>
        </div>
      </div>

      <div className="spirit-footer">
        <div className="footer-row">
          <span>Made possible by our people</span>
          <h2 className="orange-title">BE ORANGE</h2>
          <span>Being true to our promises</span>
        </div>
        <div className="spirit-living-box">
          Living the Orange Spirit
        </div>
        <div className="spirit-values">
          {values.map((val, i) => (
            <div className="value-box" key={i}>
              <h3>{val.label}</h3>
              <div className="value-desc">{val.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiritPage;
