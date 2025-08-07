// SpiritPage.jsx
import React from 'react';
import './SpiritPage.css';

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
      <div className="spirit-card">
        <div className="spirit-top">
          <div className="spirit-left">
            <svg className="triangle-shape" viewBox="0 0 300 600" preserveAspectRatio="none">
              <polygon points="0,0 300,300 0,600" fill="#ff6600" />
            </svg>
            <div className="purpose-content">
              <h2>PURPOSE</h2>
              <p>Making low-cost<br />travel easy</p>
            </div>
          </div>

          <div className="spirit-middle">
            <h2 className="section-title">PRIORITIES</h2>
            <div className="priority-list">
              {priorities.map((text, index) => (
                <div className="priority-item" key={index}>
                  <div className="dot" />
                  <div className="dotted-line" />
                  <div className="plane">
                    <img src="https://img.icons8.com/ios-filled/50/ff6600/airplane-take-off.png" alt="Plane icon" />
                  </div>
                  <div className="priority-text">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="spirit-right">
            <h2 className="section-title">DESTINATION</h2>
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
          <div className="orange-box">Living the Orange Spirit</div>
          <div className="values-grid">
            {values.map((item, index) => (
              <div className="value" key={index}>
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritPage;
