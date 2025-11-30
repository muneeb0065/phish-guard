/* global chrome */
// The line above tells the editor that 'chrome' is a real tool provided by the browser.

import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // --- 1. STATE (THE MEMORY) ---
  // These variables store data. When they change, the screen updates automatically.

  // 'loading': Are we currently working? (true/false)
  const [loading, setLoading] = useState(true);
  // 'progress': The number (0-100) for the loading bar animation.
  const [progress, setProgress] = useState(0);
  // 'showInfo': Tracks if the "About" text is open or closed.
  const [showInfo, setShowInfo] = useState(false);

  // URL Analysis (Address Bar) Memory
  const [urlStatus, setUrlStatus] = useState("Safe");
  const [urlRiskReason, setUrlRiskReason] = useState(null);
  const [currentDomain, setCurrentDomain] = useState("");

  // Content Analysis (Page Links) Memory
  const [contentStatus, setContentStatus] = useState("Safe");
  const [contentThreats, setContentThreats] = useState([]);


  // --- 2. AUTOMATION (STARTUP) ---
  // useEffect runs code immediately when the popup opens.
  useEffect(() => {
    runFullScan(); // Start the detective work right away!
  }, []);

  // This useEffect handles the "Fake" Loading Bar animation
  useEffect(() => {
    if (loading) {
      // Every 100ms, increase the bar by 10%
      const interval = setInterval(() => {
        setProgress((oldValue) => {
          if (oldValue >= 90) return oldValue; // Stop at 90% until real work is done
          return oldValue + 10;
        });
      }, 100);
      return () => clearInterval(interval); // Cleanup when done
    } else {
      setProgress(100); // If loading finishes, jump to 100%
    }
  }, [loading]);


  // --- 3. THE MASTER SCAN FUNCTION ---
  const runFullScan = () => {
    // Reset everything to "Checking" mode
    setLoading(true);
    setProgress(0);
    setUrlStatus("Safe");
    setContentStatus("Safe");

    // Check if we are inside Chrome (Real Extension Mode)
    if (typeof chrome !== "undefined" && chrome.tabs) {

      // Ask Chrome: "Give me the tab the user is looking at"
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Clean the URL (remove http://, www, etc.) to get just the name
        const hostname = new URL(activeTab.url).hostname;
        setCurrentDomain(hostname);

        // JOB A: Scan the Address Bar (The URL at the top)
        analyzeAddressBar(hostname);

        // JOB B: Scan the Page Content (The links inside the email/site)
        scanPageLinks(activeTab.id);
      });

    } else {
      // Test Mode (If running on localhost without extension)
      setCurrentDomain("localhost");
      setTimeout(() => setLoading(false), 1500); // Pretend to load
    }
  };


  // --- JOB A: ADDRESS BAR DETECTIVE ---
  const analyzeAddressBar = (domain) => {
    let risk = null;

    // Rule 1: Is it just numbers? (e.g., 192.168.1.1) -> Danger
    if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(domain)) {
      risk = "Raw IP Address detected (Unsafe)";
    }
    // Rule 2: Is it suspiciously long? -> Danger
    else if (domain.length > 50) {
      risk = "URL is suspiciously long (Hidden Trap)";
    }
    // Rule 3: Is it a fake brand? (Typosquatting) -> Danger
    else {
      const typos = ["faceboook", "goggle", "paypaI", "amazonn"];
      if (typos.some(t => domain.includes(t))) {
        risk = "Typosquatting detected (Fake Brand Name)";
      }
    }

    // If we found a risk, update the status to Red (Danger)
    if (risk) {
      setUrlStatus("Danger");
      setUrlRiskReason(risk);
    }
  };


  // --- JOB B: PAGE CONTENT DETECTIVE ---
  const scanPageLinks = (tabId) => {
    // Send a message to the 'content.js' script living inside the web page
    chrome.tabs.sendMessage(tabId, { action: "SCAN_PAGE" }, (response) => {
      setLoading(false); // Stop the spinner

      // If there was an error (like page didn't load), show Error
      if (chrome.runtime.lastError) {
        setContentStatus("Error");
        return;
      }

      // If 'content.js' replied with threats, update the screen
      if (response && response.count > 0) {
        setContentStatus("Danger");
        setContentThreats(response.threats);
      }
    });
  };

  // Helper: Are both checks completely safe?
  const isOverallSafe = urlStatus === "Safe" && contentStatus === "Safe";

  // --- 4. THE VISUAL INTERFACE (HTML) ---
  return (
    <div className="container">
      {/* HEADER: Logo and Help Button */}
      <header className="app-header">
        <div className="logo-area">
          <span className="shield-icon">{isOverallSafe ? '🛡️' : '🚨'}</span>
          <h1>PhishGuard</h1>
        </div>
        <button
          className="info-btn"
          onClick={() => setShowInfo(!showInfo)}
          title="What does this do?"
        >
          ℹ️
        </button>
      </header>

      {/* ABOUT PANEL (Hidden by default) */}
      {showInfo && (
        <div className="info-panel">
          <p><strong>What does this extension do?</strong></p>
          <ul>
            <li>Checks if the URL is a fake brand.</li>
            <li>Scans all links on the page for hidden traps.</li>
            <li>Detects unsecure IP-based websites.</li>
          </ul>
        </div>
      )}

      {/* MAIN SCORE CARD */}
      <div className={`main-card ${isOverallSafe ? 'safe-theme' : 'danger-theme'}`}>
        <div className="domain-label">Current Site</div>
        <h2 className="domain-name">{currentDomain}</h2>

        {/* Show Progress Bar OR Score */}
        {loading ? (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <span className="loading-text">Scanning ecosystem...</span>
          </div>
        ) : (
          <div className="score-display">
            <span className="score-val">{isOverallSafe ? '100%' : '0%'}</span>
            <span className="score-label">SAFETY SCORE</span>
          </div>
        )}
      </div>

      {/* DETAILS AREA (Only shows when scan finishes) */}
      {!loading && (
        <div className="details-grid">

          {/* Box 1: Address Bar Results */}
          <div className="detail-card">
            <div className="detail-header">
              <span>URL Scan</span>
              <span className={`badge ${urlStatus.toLowerCase()}`}>{urlStatus}</span>
            </div>
            {urlRiskReason && <div className="risk-text">{urlRiskReason}</div>}
          </div>

          {/* Box 2: Page Content Results */}
          <div className="detail-card">
            <div className="detail-header">
              <span>Page Links</span>
              <span className={`badge ${contentStatus.toLowerCase()}`}>{contentStatus}</span>
            </div>

            {contentStatus === "Danger" && (
              <div className="threat-summary">
                Found <strong>{contentThreats.length}</strong> bad links.
              </div>
            )}

            {contentStatus === "Error" && (
              <div className="risk-text">Please refresh the page to scan.</div>
            )}
          </div>

          {/* Box 3: List of specific threats found */}
          {contentThreats.length > 0 && (
            <div className="threat-list">
              {contentThreats.map((t, index) => (
                <div key={index} className="threat-item">
                  <div className="reason">⚠️ {t.reason}</div>
                  <div className="url">{t.url}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FOOTER BUTTON */}
      <button className="rescan-btn" onClick={runFullScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Run New Scan'}
      </button>
    </div>
  )
}

export default App