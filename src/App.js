import { useEffect } from 'react';
import { motion } from 'framer-motion'; // For smooth animations

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://anishdubey27.github.io";
    }, 4000); // 4-second animation before redirect

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.app}>
      {/* Main Heading Animation */}
      <motion.h1 
        style={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        Welcome to the Future
      </motion.h1>

      {/* Sub-text Animation */}
      <motion.p 
        style={styles.subText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        Great things are coming...
      </motion.p>

      {/* Glowing Effect */}
      <motion.div 
        style={styles.glowingEffect}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
      >
        <div style={styles.pulse}></div>
      </motion.div>
    </div>
  );
}

// Inline CSS Styles
const styles = {
  app: {
    margin: 0,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d1117',
    color: '#c9d1d9',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden',
    textAlign: 'center',
    position: 'relative'
  },
  heading: {
    fontSize: '4rem',
    background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subText: {
    fontSize: '1.5rem',
    color: '#8b949e',
    marginTop: '10px'
  },
  glowingEffect: {
    position: 'absolute',
    top: '60%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  pulse: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(0, 114, 255, 0.2)',
    boxShadow: '0 0 20px 10px rgba(0, 114, 255, 0.5)',
    animation: 'pulse-animation 1.5s infinite alternate'
  }
};

export default App;
