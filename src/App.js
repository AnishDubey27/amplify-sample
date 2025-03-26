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
  const API_KEY = 'NvcH5CjyAs8RLjPVrY5bRFrOwqCUo7UlcZORfmNE39qOSKtP

-nrmRclYn_M946UWMF488jhcAys';

  // Static Articles (used as fallback if API fails or content is too short)
  const fallbackArticles = [
    {
      category: 'Macroeconomic',
      title: 'Fed Signals Caution on Rate Cuts as Inflation Ticks Up in Q1 2025',
      content: 'The Federal Reserve hinted at a slower pace of interest rate cuts in 2025, citing a modest uptick in inflation to 2.4% in February, driven by rising energy costs and supply chain pressures from new tariffs. Economists suggest this could mean only two rate cuts this year, potentially keeping the benchmark rate above 4% through mid-2025.',
    },
    {
      category: 'Industry/Transaction',
      title: 'Tech Giant’s $15 Billion Merger Faces Regulatory Hurdles',
      content: 'A $15 billion merger between two cloud computing firms faces antitrust scrutiny, just as Q1 2025 earnings loom. The deal aims to bolster AI infrastructure, but delays could impact a tech sector already volatile. Meanwhile, a renewable energy IPO surged 20% on debut.',
    },
    {
      category: 'Op-Ed',
      title: 'Tariffs Won’t Fix the Economy—They’ll Fracture It',
      content: 'Dr. Elena Martinez argues against 2025’s new tariffs, warning they’ll raise consumer costs and disrupt supply chains. She advocates for innovation subsidies, citing historical data showing tariffs shrink GDP growth by 0.2–0.5% in their first year.',
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

    const fetchArticles = async () => {
      const queries = [
        { category: 'Macroeconomic', keywords: 'economy' },
        { category: 'Industry/Transaction', keywords: 'business' },
        { category: 'Op-Ed', keywords: 'opinion' },
      ];
      const fetchedArticles = [];
      let usingStatic = false;

      for (const query of queries) {
        let attempts = 0;
        const maxAttempts = 3;
        let success = false;

        while (attempts < maxAttempts && !success) {
          try {
            const response = await fetch(
              `https://api.currentsapi.services/v1/search?keywords=${query.keywords}&language=en&apiKey=${API_KEY}`
            );
            if (response.status === 429) {
              throw new Error('429 Too Many Requests');
            }
            const data = await response.json();
            console.log(`${query.category} response:`, data);
            if (data.status === 'ok' && data.news?.length > 0) {
              const article = data.news[0];
              const description = article.description || 'No description available.';
              if (description.length < 50) {
                console.warn(`${query.category} - Description too short: ${description}`);
                const fallback = fallbackArticles.find(a => a.category === query.category);
                fetchedArticles.push(fallback);
                usingStatic = true;
              } else {
                fetchedArticles.push({
                  category: query.category,
                  title: article.title,
                  content: description,
                  url: article.url || null,
                });
              }
              success = true;
            } else {
              console.warn(`${query.category} - No articles found in response`);
            }
          } catch (error) {
            console.error(`Error fetching ${query.category} article (Attempt ${attempts + 1}):`, error);
            attempts++;
            if (error.message === '429 Too Many Requests') {
              fetchedArticles.push({
                category: query.category,
                title: 'API Quota Exceeded',
                content: 'Oh, you’ve burned through the API quota faster than a supernova! Guess the universe isn’t ready for your cosmic curiosity—try again tomorrow, space cowboy.',
              });
              usingStatic = true;
              break;
            }
            if (attempts === maxAttempts) {
              console.warn(`Max attempts reached for ${query.category}. Using fallback.`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (!success && !fetchedArticles.some(article => article.category === query.category)) {
          const fallback = fallbackArticles.find(article => article.category === query.category);
          fetchedArticles.push(fallback);
          usingStatic = true;
        }
      }
      setArticles(fetchedArticles);
      setIsUsingStatic(usingStatic);
    };

    fetchArticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
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
      <motion.div
        style={styles.blackHole}
        animate={{ rotate: explode ? 0 : 360, scale: explode ? 2 : 1, opacity: explode ? 0 : 1 }}
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
              Warning: Our cosmic data stream got sucked into a black hole! These articles are from our emergency stasis pod—still stellar, but not fresh from the galaxy.
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
  blackHole: { position: 'fixed', width: '200px', height: '200px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 },
  eventHorizon: { width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, #000000 40%, #ff00cc 70%, #3333ff 100%)', boxShadow: '0 0 40px 20px rgba(255, 0, 204, 0.3)', position: 'relative', overflow: 'hidden' },
  explosion: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, #ffffff 10%, #ff00cc 50%, transparent 70%)', borderRadius: '50%', top: 0, left: 0 },
  starField: { position: 'absolute', width: '100%', height: '100%', zIndex: -1 },
  star: { position: 'absolute', width: '2px', height: '2px', backgroundColor: '#ffffff', borderRadius: '50%', boxShadow: '0 0 5px rgba(255,255,255,0.8)' },
  scrollContent: { position: 'relative', zIndex: 2, paddingTop: '20vh', paddingBottom: '50vh', color: '#ffffff', textAlign: 'center' },
  articlesContainer: { maxWidth: '1000px', margin: '50px auto', padding: '20px' },
  articlesTitle: { fontSize: '2.5rem', background: 'linear-gradient(135deg, #ff00cc, #3333ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 15px rgba(255, 0, 204, 0.5)', marginBottom: '10px' },
  articlesSubtitle: { fontSize: '1.2rem', color: '#d1d1d1', marginBottom: '10px' },
  apiNotice: { fontSize: '1rem', color: '#ff00cc', marginBottom: '20px', fontStyle: 'italic' },
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
