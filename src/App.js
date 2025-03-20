import { motion } from 'framer-motion';

function App() {
  return (
    <div style={styles.app}>
      {/* Animated Welcome Section */}
      <motion.div 
        style={styles.animatedText}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h1>Journey Through the Universe</h1>
      </motion.div>

      <motion.div
        style={styles.subText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        <p>Explore the cosmic wonders and survive the void...</p>
      </motion.div>

      <motion.div
        style={styles.glowingEffect}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
      >
        <div style={styles.pulse}></div>
      </motion.div>

      {/* Scroll Down Section with Galaxy Effect */}
      <div style={styles.scrollDown}>Scroll down for a cosmic experience 👇</div>

      {/* Galaxy and Stars Animation */}
      <div style={styles.galaxy}>
        {[...Array(100)].map((_, i) => (
          <div key={i} style={{ ...styles.star, top: `${Math.random() * 100}vh`, left: `${Math.random() * 100}vw` }}></div>
        ))}
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  app: {
    backgroundColor: '#000',
    backgroundImage: 'radial-gradient(circle at 50% 50%, #111 0%, #000 80%)',
    color: '#c9d1d9',
    height: '200vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', sans-serif",
    overflowX: 'hidden',
    position: 'relative'
  },
  animatedText: {
    fontSize: '4rem',
    background: 'linear-gradient(135deg, #8A2BE2, #4B0082)',
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
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  pulse: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(138, 43, 226, 0.2)',
    boxShadow: '0 0 30px 15px rgba(138, 43, 226, 0.5)',
    animation: 'pulse-animation 1.5s infinite alternate'
  },
  scrollDown: {
    marginTop: '30vh',
    fontSize: '1.5rem',
    color: '#8A2BE2',
    textAlign: 'center'
  },
  galaxy: {
    position: 'absolute',
    top: '100vh',
    width: '100%',
    height: '100vh',
    background: 'radial-gradient(circle at center, #000 10%, #090a0f 80%)',
    zIndex: -1
  },
  star: {
    position: 'absolute',
    width: '3px',
    height: '3px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    animation: 'twinkle 2s infinite alternate'
  }
};

export default App;
