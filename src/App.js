import { useEffect, useState } from 'react';
import './App.css'; // Add some simple CSS for the effect

function App() {
  const [showFlashingScreen, setShowFlashingScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlashingScreen(false);
      window.location.href = "https://anishdubey27.github.io";
    }, 3000); // Show flashing screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showFlashingScreen ? (
        <div className="flashing-screen">
          <h1>🚨 Loading... 🚨</h1>
        </div>
      ) : (
        <h1>Redirecting...</h1>
      )}
    </div>
  );
}

export default App;
