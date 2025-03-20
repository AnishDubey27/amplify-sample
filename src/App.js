import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Note: Install framer-motion: npm install framer-motion
// Add to index.html: <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
// Sign up at currentsapi.services for an API key

function App() {
  const canvasRef = useRef(null);
  const [explode, setExplode] = useState(false);
  const [articles, setArticles] = useState([]);
  const API_KEY = 'ANzLVzqk3aEvyOpNF7wNA-nrmRclYn_M946UWMF488jhcAys'; // Replace with your key

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

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollPosition >= documentHeight - 50) {
        setExplode(true);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch Articles from Currents API
    const fetchArticles = async () => {
      const queries = [
        { category: 'Macroeconomic', keywords: 'inflation interest rates' },
        { category: 'Industry/Transaction', keywords: 'merger IPO earnings' },
        { category: 'Op-Ed', keywords: 'opinion economy policy' },
      ];
      const fetchedArticles = [];

      for (const query of queries) {
        try {
          const response = await fetch(
            `https://api.currentsapi.services/v1/search?keywords=${query.keywords}&language=en&apiKey=${API_KEY}`
          );
          const data = await response.json();
          if (data.status === 'ok' && data.news.length > 0) {
            fetchedArticles.push({
              category: query.category,
              title: data.news[0].title,
              content: data.news[0].description || 'No description available.',
            });
          }
        } catch (error) {
          console.error(`Error fetching ${query.category} article:`, error);
        }
      }
      setArticles(fetchedArticles);
    };

    fetchArticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [API_KEY]);

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

      {/* Exploding Black Hole */}
      <motion.div
        style={styles.blackHole}
        animate={{
          rotate: explode ? 0 : 360,
          scale: explode ? 2 : 1,
          opacity: explode ? 0 : 1,
        }}
        transition={{
          rotate: { duration: 20, repeat: explode ? 0 : Infinity, ease: 'linear' },
          scale: { duration: 1, ease: 'easeOut', delay: explode ? 0 : 0 },
          opacity: { duration: 1, delay: explode ? 0.5 : 0 },
        }}
      >
        <div style={styles.eventHorizon}>
          {explode && (
            <motion.div
              style={styles.explosion}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          )}
        </div>
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
              top: `${Math.random() * 300}vh`,
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

      {/* Scrollable Content with Articles */}
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

        {/* Articles Section */}
        <div style={styles.articlesContainer}>
          <h2 style={styles.articlesTitle}>Cosmic Knowledge Base</h2>
          <p style={styles.articlesSubtitle}>Inspired by Jim Donovan’s WSJ Reading Strategy</p>
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <motion.div
                key={index}
                style={styles.articleCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 style={styles.articleCategory}>{article.category}</h3>
                <h4 style={styles.articleTitle}>{article.title}</h4>
                <p style={styles.articleContent}>{article.content}</p>
              </motion.div>
            ))
          ) : (
            <p style={styles.loadingText}>Fetching cosmic insights...</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  app: {
    minHeight: '300vh',
    background: 'linear-gradient(180deg, #0a001f 0%, #000000 100%)',
    position: 'relative',
    overflowX: 'hidden',
    fontFamily: "'Orbitron', sans-serif",
  },
  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1,
    height: '100vh',
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
    position: 'relative',
    overflow: 'hidden',
  },
  explosion: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, #ffffff 10%, #ff00cc 50%, transparent 70%)',
    borderRadius: '50%',
    top: 0,
    left: 0,
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
    paddingTop: '100vh',
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
  articlesContainer: {
    maxWidth: '1000px',
    margin: '50px auto',
    padding: '20px',
  },
  articlesTitle: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #ff00cc, #3333ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 15px rgba(255, 0, 204, 0.5)',
    marginBottom: '10px',
  },
  articlesSubtitle: {
    fontSize: '1.2rem',
    color: '#d1d1d1',
    marginBottom: '30px',
  },
  articleCard: {
    background: 'rgba(10, 0, 31, 0.8)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 0 20px rgba(255, 0, 204, 0.2)',
  },
  articleCategory: {
    fontSize: '1.1rem',
    color: '#ff00cc',
    textTransform: 'uppercase',
    marginBottom: '5px',
  },
  articleTitle: {
    fontSize: '1.8rem',
    color: '#ffffff',
    marginBottom: '10px',
  },
  articleContent: {
    fontSize: '1rem',
    color: '#d1d1d1',
    lineHeight: '1.5',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#ff00cc',
  },
};

export default App;