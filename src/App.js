import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Note: Install framer-motion: npm install framer-motion
// Add to index.html: <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">

function App() {
  const canvasRef = useRef(null);

  // Black Hole Particle Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }

      update() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = 100 / distance;

        this.x += (dx / distance) * force + this.speedX;
        this.y += (dy / distance) * force + this.speedY;

        if (distance < 50) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.app}>
      {/* Canvas for Black Hole Particle Effect */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Fade-in Cosmic Title */}
      <motion.div
        style={styles.titleContainer}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <h1 style={styles.title}>Cosmic Void Explorer</h1>
      </motion.div>

      {/* Fade-in Subtitle */}
      <motion.div
        style={styles.subtitle}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
      >
        <p>Enter the realm of black holes and stellar wonders</p>
      </motion.div>

      {/* Pulsating Nebula */}
      <motion.div
        style={styles.nebula}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Rotating Black Hole */}
      <motion.div
        style={styles.blackHole}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div style={styles.eventHorizon} />
      </motion.div>

      {/* Cosmic Navigation */}
      <motion.div
        style={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 20, 0] }}
        transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
      >
        <p>Descend into the Cosmos ↓</p>
      </motion.div>

      {/* Star Field */}
      <div style={styles.starField}>
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.star,
              top: `${Math.random() * 300}vh`, // Increased for more scrollable area
              left: `${Math.random() * 100}vw`,
            }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Additional Scrollable Content */}
      <div style={styles.scrollContent}>
        <motion.div
          style={styles.section}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={styles.sectionTitle}>The Black Hole Abyss</h2>
          <p style={styles.sectionText}>
            Venture deeper into the mysteries of the universe where light bends and time warps.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  app: {
    minHeight: '300vh', // Increased height to enable scrolling
    background: 'linear-gradient(180deg, #0a001f 0%, #000000 100%)',
    position: 'relative',
    overflowX: 'hidden', // Changed to allow vertical scroll
    fontFamily: "'Orbitron', sans-serif",
  },
  canvas: {
    position: 'fixed', // Fixed to stay in viewport
    top: 0,
    left: 0,
    zIndex: 1,
    height: '100vh', // Keeps canvas at viewport height
  },
  titleContainer: {
    position: 'relative',
    zIndex: 2,
    paddingTop: '20vh',
    textAlign: 'center',
  },
  title: {
    fontSize: '4.5rem',
    background: 'linear-gradient(135deg, #ff00cc, #3333ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 20px rgba(255, 0, 204, 0.7)',
  },
  subtitle: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '1.5rem',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  },
  nebula: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,0,204,0.3) 0%, rgba(51,51,255,0) 70%)',
    borderRadius: '50%',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  },
  blackHole: {
    position: 'fixed',
    width: '200px',
    height: '200px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
  },
  eventHorizon: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #000000 40%, #ff00cc 70%, #3333ff 100%)',
    boxShadow: '0 0 40px 20px rgba(255, 0, 204, 0.3)',
  },
  scrollIndicator: {
    position: 'fixed',
    bottom: '10vh',
    width: '100%',
    textAlign: 'center',
    color: '#ff00cc',
    fontSize: '1.3rem',
    zIndex: 2,
  },
  starField: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    width: '2px',
    height: '2px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    boxShadow: '0 0 5px rgba(255,255,255,0.8)',
  },
  scrollContent: {
    position: 'relative',
    zIndex: 2,
    paddingTop: '100vh', // Starts after initial viewport
    paddingBottom: '50vh',
    color: '#ffffff',
    textAlign: 'center',
  },
  section: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #ff00cc, #3333ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 15px rgba(255, 0, 204, 0.5)',
  },
  sectionText: {
    fontSize: '1.2rem',
    color: '#d1d1d1',
    textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
  },
};

export default App;