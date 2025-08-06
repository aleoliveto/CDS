import React from 'react';

const OrangeVision = () => {
  const priorities = [
    'Building Europe’s best network',
    'Transforming revenue',
    'Delivering ease and reliability',
    'Driving our low-cost model'
  ];

  return (
    <div style={styles.outerWrapper}>
      <div className="container" style={styles.container}>
        <div style={styles.topSection}>
          {/* Left Triangle Purpose */}
          <div style={styles.purposeWrapper}>
            <svg viewBox="0 0 300 600" preserveAspectRatio="none" style={styles.purposeTriangle}>
              <polygon points="0,0 300,300 0,600" fill="#ff6600" />
            </svg>
            <div style={styles.purposeText}>
              <strong>PURPOSE</strong><br />
              Making low-cost<br />
              travel easy
            </div>
          </div>

          {/* Middle Section */}
          <div style={styles.middleSection}>
            <h2 style={styles.heading}>PRIORITIES</h2>
            <div style={styles.priorityTopDot}></div>
            {priorities.map((text, index) => (
              <div style={styles.priorityItem} key={index}>
                <div style={styles.leftSide}>
                  <span style={styles.circleDot} />
                  <div style={styles.dottedLine} />
                  <div style={styles.iconCircle}>
                    <img
                      src="https://img.icons8.com/ios-filled/50/ff6600/airplane-take-off.png"
                      alt="Plane"
                      style={styles.planeIcon}
                    />
                  </div>
                  <div style={styles.extendedDottedLine} />
                </div>
                <div style={styles.priorityTextContainer}>
                  <span style={styles.priorityText}>{text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Destination Circle */}
          <div style={styles.destinationBox}>
            <h2 style={styles.heading}>DESTINATION</h2>
            <div style={styles.destinationCircle}>
              Europe’s most loved airline —<br />
              winning for our customers,<br />
              shareholders and people.
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div style={styles.footerSection}>
          <svg viewBox="0 0 300 50" preserveAspectRatio="none" style={styles.footerBlendTriangle}>
            <polygon points="0,0 0,50 50,50" fill="#ff6600" />
          </svg>
          <div style={styles.footerTop}>
            <span>Made possible by our people</span>
            <h2 style={styles.orangeTitle}>BE ORANGE</h2>
            <span>Being true to our promises</span>
          </div>

          <div style={styles.beOrangeDropdown}>
            <select style={styles.selectBoxLarge}>
              <option>Living the Orange Spirit</option>
              <option>Collaboration & Ownership</option>
              <option>Great Service & Progress</option>
            </select>
          </div>

          <div style={styles.dropdownRow}>
            {[
              { label: 'BE SAFE', value: 'Always with safety at our heart' },
              { label: 'BE CHALLENGING', value: 'Always challenging cost' },
              { label: 'BE BOLD', value: 'Making a positive difference' },
              { label: 'BE WELCOMING', value: 'Always warm and welcoming' }
            ].map((item, i) => (
              <div style={styles.dropdownBox} key={i}>
                <label style={styles.dropdownLabel}>{item.label}</label>
                <select style={styles.selectBox}>
                  <option>{item.value}</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerWrapper: {
    backgroundColor: '#fff',
    padding: '10px',
    border: '10px solid #ff6600',
    boxSizing: 'border-box',
    width: '100%',
    overflow: 'hidden'
  },
  container: {
    fontFamily: 'EasyJetBold, Segoe UI, sans-serif',
    maxWidth: '1300px',
    margin: '0 auto',
    backgroundColor: '#fff',
    boxSizing: 'border-box'
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '2rem 2rem 1rem',
    gap: '1rem',
    position: 'relative'
  },
  purposeWrapper: {
    position: 'relative',
    width: '300px',
    minHeight: '600px',
    flexShrink: 0
  },
  purposeTriangle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1
  },
  purposeText: {
    position: 'absolute',
    top: '30%',
    left: '25px',
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 1.4,
    fontSize: '1.25rem',
    textAlign: 'left',
    zIndex: 2
  },
  middleSection: {
    flex: 1,
    paddingLeft: '1rem',
    paddingRight: '1rem',
    position: 'relative'
  },
  heading: {
    color: '#ff6600',
    fontWeight: 'bold',
    fontSize: '2.2rem',
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  priorityTopDot: {
    width: '14px',
    height: '14px',
    border: '3px solid #ff6600',
    borderRadius: '50%',
    margin: '0 auto 2rem'
  },
  priorityItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '3.2rem',
    position: 'relative'
  },
  leftSide: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  circleDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid #ff6600',
    marginRight: '10px'
  },
  dottedLine: {
    flexGrow: 1,
    height: '0',
    borderTop: '2px dotted #ff6600',
    marginRight: '10px'
  },
  extendedDottedLine: {
    flexGrow: 1,
    height: '0',
    borderTop: '2px dotted #ff6600',
    marginLeft: '10px'
  },
  iconCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '3px solid #ff6600',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  planeIcon: {
    width: '20px',
    height: '20px'
  },
  priorityTextContainer: {
    position: 'absolute',
    top: '-1.6rem',
    left: 'calc(50%)',
    transform: 'translateX(-50%)'
  },
  priorityText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1d1d1d'
  },
  destinationBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  destinationCircle: {
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    backgroundColor: '#ff6600',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.05rem',
    padding: '1rem',
    marginTop: '4.6rem',
    zIndex: 1,
    position: 'relative'
  },
  footerSection: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#f2f2f2',
    position: 'relative',
    zIndex: 1
  },
  footerBlendTriangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50px',
    height: '50px',
    zIndex: 2
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  orangeTitle: {
    color: '#ff6600',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1
  },
  beOrangeDropdown: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  selectBoxLarge: {
    padding: '0.75rem',
    border: '2px solid #ff6600',
    borderRadius: '4px',
    width: '60%',
    fontSize: '1rem'
  },
  dropdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  dropdownBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 1 22%'
  },
  dropdownLabel: {
    color: '#ff6600',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    fontSize: '0.95rem'
  },
  selectBox: {
    padding: '0.5rem',
    border: '2px solid #ff6600',
    borderRadius: '4px',
    width: '100%',
    fontSize: '0.9rem'
  }
};

export default OrangeVision;
