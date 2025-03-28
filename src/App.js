import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Install framer-motion: npm install framer-motion
// Add to index.html: <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">

function App() {
  const canvasRef = useRef(null);
  const [explode, setExplode] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isUsingStatic, setIsUsingStatic] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(-10); // Start at -10 seconds
  const API_KEY = process.env.REACT_APP_API_KEY;

  // Static Articles (used as fallback if API fails or content is too short)
  const fallbackArticles = [
    {
      category: 'Macroeconomic',
      title: 'Global Inflation Rates Show Signs of Stabilization in 2025',
      content: 'Economists report that global inflation rates are stabilizing after years of volatility. Central banks are cautiously optimistic, with many maintaining interest rates to ensure sustained growth. Key sectors like energy and technology are driving this recovery.',
    },
    {
      category: 'Industry/Transaction',
      title: 'AI Startups See Record Funding in Q1 2025',
      content: 'Artificial intelligence startups have raised over $20 billion in Q1 2025, marking a record-breaking quarter. Investors are particularly interested in generative AI and automation technologies, which are expected to revolutionize industries like healthcare and finance.',
    },
    {
      category: 'Op-Ed',
      title: 'The Future of Work: Embracing Remote and Hybrid Models',
      content: 'Dr. Sarah Johnson explores how remote and hybrid work models are reshaping the global workforce. She argues that companies embracing flexibility see higher productivity and employee satisfaction, but warns of challenges in maintaining company culture.',
    },
  ];

  // Timer Logic: Start at -10 seconds and count up
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Format elapsed time into hh:mm:ss, handling negative values
  const formatTime = (seconds) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const hrs = Math.floor(absSeconds / 3600);
    const mins = Math.floor((absSeconds % 3600) / 60);
    const secs = absSeconds % 60;
    const timeString = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${isNegative ? 'T-' : 'T+'} ${isNegative ? `-${timeString}` : timeString}`;
  };

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

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      const queries = [
        { category: 'Macroeconomic', keywords: 'economy' },
        { category: 'Industry/Transaction', keywords: 'business' },
        { category: 'Op-Ed', keywords: 'opinion' },
      ];
      const fetchedArticles = [];
      let usingStatic = false;

      for (const query of queries) {
        try {
          const response = await fetch(
            `https://content.guardianapis.com/search?q=${query.keywords}&api-key=${API_KEY}`
          );
          const data = await response.json();
          console.log(`${query.category} response:`, data);

          if (data.response && data.response.results.length > 0) {
            const article = data.response.results[0];
            fetchedArticles.push({
              category: query.category,
              title: article.webTitle,
              content: article.fields?.trailText || 'No description available.',
              url: article.webUrl || null,
            });
          } else {
            console.warn(`${query.category} - No articles found in response`);
            const fallback = fallbackArticles.find(a => a.category === query.category);
            fetchedArticles.push(fallback);
            usingStatic = true;
          }
        } catch (error) {
          console.error(`Error fetching ${query.category} article:`, error);
          const fallback = fallbackArticles.find(a => a.category === query.category);
          fetchedArticles.push(fallback);
          usingStatic = true;
        }
      }

      setArticles(fetchedArticles);
      setIsUsingStatic(usingStatic);
    };

    fetchArticles();
  }, [API_KEY]);

  return (
    <div style={styles.app}>
      {/* Background GIF Layer (Fullscreen) */}
      <div style={styles.backgroundGif} />
      <canvas ref={canvasRef} style={styles.canvas} />
      <motion.div
        style={styles.nebula}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
        
      <div style={styles.starField}>
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            style={{ ...styles.star, top: `${Math.random() * 300}vh`, left: `${Math.random() * 100}vw` }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>
      <div style={styles.scrollContent}>
        <div style={styles.articlesContainer}>
          <h2 style={styles.articlesTitle}>Cosmic Knowledge Base</h2>
          <p style={styles.articlesSubtitle}>Inspired by Jim Donovan’s WSJ Reading Strategy</p>
          {isUsingStatic && (
            <p style={styles.apiNotice}>
              Warning: Our cosmic data stream got sucked into a black hole! Some of these articles are from our emergency stasis pod—still stellar, but not all fresh from the galaxy.
            </p>
          )}
          {articles.map((article, index) => (
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
              {article.url && (
                <a href={article.url} target="_blank" rel="noopener noreferrer" style={styles.readMoreLink}>
                  Read More
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Timer at the Bottom */}
      <div style={styles.timer}>
        <span style={styles.timerText}>{formatTime(elapsedTime)}</span>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '300vh',
    background: 'linear-gradient(180deg, #0a001f 0%, #000000 100%)',
    position: 'relative',
    overflowX: 'hidden',
    fontFamily: "'Orbitron', sans-serif",
  },
  backgroundGif: {
    position: 'fixed',
    top: 0, // Fullscreen: top-left corner
    left: 0,
    width: '100vw', // Full viewport width
    height: '100vh', // Full viewport height
    background: `url('https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/f19202e1-6548-49a1-8449-e9faca547934/landing-part-2.gif?t=1729176809') no-repeat center center`,
    backgroundSize: 'cover', // Scale to cover the entire viewport
    opacity: 0.8, // Keep opacity for visibility of other elements
    zIndex: 0, // Behind articles, timer, and other elements
    boxShadow: '0 0 20px rgba(255, 0, 204, 0.3)', // Subtle glow
  },
  canvas: { position: 'fixed', top: 0, left: 0, zIndex: 1, height: '100vh' },
  nebula: { position: 'fixed', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,0,204,0.3) 0%, rgba(51,51,255,0) 70%)', borderRadius: '50%', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 },
  starField: { position: 'absolute', width: '100%', height: '100%', zIndex: -1 },
  star: { position: 'absolute', width: '2px', height: '2px', backgroundColor: '#ffffff', borderRadius: '50%', boxShadow: '0 0 5px rgba(255,255,255,0.8)' },
  scrollContent: { position: 'relative', zIndex: 2, paddingTop: '20vh', paddingBottom: '50vh', color: '#ffffff', textAlign: 'center' },
  articlesContainer: { maxWidth: '1000px', margin: '50px auto', padding: '20px' },
  articlesTitle: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #ff00cc, #3333ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 5px rgba(255, 0, 204, 0.2), 0 0 10px rgba(111, 0, 255, 0.6)', // Glow effect
    WebkitTextStroke: '1px rgba(0, 0, 0, 0.9)', // Black border around text
    marginBottom: '10px',
  },
  articlesSubtitle: {
    fontSize: '1.2rem',
    color: '#d1d1d1',
    textShadow: '0 0 3px rgba(255, 255, 255, 0.8)', // Subtle border effect
    WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.8)', // Thin white border
    marginBottom: '10px',
  },
  apiNotice: {
    fontSize: '1rem',
    color: '#ff00cc',
    fontStyle: 'italic',
    textShadow: '0 0 3px rgba(255, 255, 255, 0.8)', // Subtle border effect
    WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.8)', // Thin white border
    marginBottom: '20px',
  },
  articleCard: { background: 'rgba(10, 0, 31, 0.8)', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 0 20px rgba(255, 0, 204, 0.2)' },
  articleCategory: { fontSize: '1.1rem', color: '#ff00cc', textTransform: 'uppercase', marginBottom: '5px' },
  articleTitle: { fontSize: '1.8rem', color: '#ffffff', marginBottom: '10px' },
  articleContent: { fontSize: '1rem', color: '#d1d1d1', lineHeight: '1.5', marginBottom: '10px' },
  readMoreLink: { color: '#ff00cc', textDecoration: 'underline', fontSize: '0.9rem' },
  timer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(10, 0, 31, 0.8)',
    padding: '10px 20px',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(255, 0, 204, 0.3)',
    zIndex: 3,
  },
  timerText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ff00cc, #3333ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 10px rgba(255, 0, 204, 0.5)',
  },
};

export default App;
