import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.location.href = "https://anishdubey27.github.io";
  }, []);

  return (
    <div className="App">
      <h1>Redirecting...</h1>
      <p>If you're not redirected, <a href="https://anishdubey27.github.io">click here</a>.</p>
    </div>
  );
}

export default App;
