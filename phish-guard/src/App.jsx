/* global chrome */
import { useState } from 'react'
import './App.css'

function App() {
  const [scanStatus, setScanStatus] = useState("Idle");
  const [threatCount, setThreatCount] = useState(0);
  const [threats, setThreats] = useState([]);

  const scanPageContent = () => {
    setScanStatus("Scanning...");
    setThreats([]);

    // 1. Find the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // 2. Send a message to the content.js script inside that tab
      // We say: "Hey content script, please SCAN_PAGE now!"
      chrome.tabs.sendMessage(activeTab.id, { action: "SCAN_PAGE" }, (response) => {

        // 3. Handle the response from the page
        if (response) {
          setThreatCount(response.count);
          setThreats(response.threats);

          if (response.count > 0) {
            setScanStatus("Danger");
          } else {
            setScanStatus("Safe");
          }
        } else {
          // If content script fails (e.g., on a settings page)
          setScanStatus("Error");
        }
      });
    });
  };

  return (
    <div className="container">
      <header>
        <h1>PhishGuard 🛡️</h1>
        <p style={{ fontSize: '12px', color: '#666' }}>Content Scanner</p>
      </header>

      <div className="card">
        <button onClick={scanPageContent} className="scan-btn">
          SCAN LINKS ON PAGE
        </button>

        <div className={`status-box ${scanStatus.toLowerCase()}`}>
          Status: {scanStatus}
        </div>

        {/* Display the list of threats found */}
        {threatCount > 0 && (
          <div className="threat-list">
            <h3>Found {threatCount} Threats:</h3>
            <ul>
              {threats.map((t, index) => (
                <li key={index} className="threat-item">
                  <strong>Reason:</strong> {t.reason}<br />
                  <small>{t.url}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App