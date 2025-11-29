/* global chrome */
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState("Checking...")
  const [siteName, setSiteName] = useState("Loading...")
  const [riskReason, setRiskReason] = useState(null)

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      // 1. EXTENSION MODE
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab) {
          const hostname = new URL(currentTab.url).hostname;
          setSiteName(hostname);
          analyzeSafety(hostname);
        }
      });
    } else {
      // 2. TEST MODE (When running on localhost)
      // Defaults to example.com so you can see the simulation work immediately
      const testSite = "example.com";
      setSiteName(testSite);
      analyzeSafety(testSite);
    }
  }, []);

  // --- THE LOGIC ---
  const analyzeSafety = async (domain) => {

    // 1. LOCAL CHECKS (Instant)
    if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(domain)) {
      setStatus("Danger");
      setRiskReason("This site uses a raw IP address.");
      return;
    }

    if (domain.length > 50) {
      setStatus("Danger");
      setRiskReason("The URL is suspiciously long.");
      return;
    }

    const suspiciousTypos = ["faceboook", "goggle", "paypaI", "amazonn"];
    if (suspiciousTypos.some(t => domain.includes(t))) {
      setStatus("Danger");
      setRiskReason("This looks like a fake version of a popular brand.");
      return;
    }

    // 2. REMOTE CHECKS (The "FBI" Database)
    // If it passed local checks, we simulate an API call
    setStatus("Checking DB..."); // <--- You should see this text appear!

    // We wait for our fake database to answer
    const isKnownPhishing = await checkPhishingDatabase(domain);

    if (isKnownPhishing) {
      setStatus("Danger");
      setRiskReason("Flagged by Global Security Database as unsafe (SIMULATION).");
    } else {
      setStatus("Safe");
      setRiskReason(null);
    }
  };

  // --- MOCK API FUNCTION ---
  const checkPhishingDatabase = async (domain) => {
    return new Promise((resolve) => {
      console.log(`Checking database for: ${domain}`); // Check your console for this!
      setTimeout(() => {
        // SIMULATION: "example.com" triggers the alarm
        if (domain === "example.com") {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1500); // 1.5 second delay
    });
  };

  const handleRescan = () => {
    setStatus("Scanning...");
    setRiskReason(null);
    setTimeout(() => {
      // Force re-check of the current site name
      analyzeSafety(siteName);
    }, 500);
  };

  return (
    <div className="container">
      <header>
        {/* LOOK FOR THIS PURPLE TEXT TO CONFIRM UPDATE */}
        <h1>PhishGuard 🛡️ <span style={{ fontSize: '12px', color: 'purple' }}>(v6.0 FINAL)</span></h1>
      </header>

      <div className="card">
        <p>You are visiting:</p>
        <h2>{siteName}</h2>

        {riskReason && (
          <div className="warning-box">
            ⚠️ {riskReason}
          </div>
        )}

        {/* This messy code handles the CSS class names for colors */}
        <div className={`status-box ${status.toLowerCase().replace(/\./g, '').replace(' ', '-')}`}>
          Status: {status}
        </div>

        <button onClick={handleRescan}>
          Re-Scan Page
        </button>
      </div>
    </div>
  )
}

export default App