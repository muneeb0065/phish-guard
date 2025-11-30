PhishGuard 🛡️

AI-Powered Phishing Detection Extension for Chrome

PhishGuard is a browser extension designed to protect users from phishing attacks in real-time. It analyzes both the Address Bar URL and Page Content (links inside emails/websites) to detect suspicious patterns, typosquatting, and raw IP usage.

Built with React, Vite, and the Chrome Extension Manifest V3.

(Replace this link with a screenshot of your extension later)

🚀 Features

Dual-Layer Scanning:

Layer 1: Scans the browser address bar for IP addresses, long URLs, and fake domains.

Layer 2: Scans the actual content of the webpage (perfect for Gmail/Outlook) to find hidden trap links.

Heuristic Detection Engine:

Typosquatting: Detects fake brands like faceboook.com or goggle.com.

IP Detection: Flags URLs that use raw IP addresses (e.g., http://192.168.1.5).

Bait & Switch: Detects links where the text says "Google" but the link goes to "EvilSite".

Nano-Style UI: Modern, clean interface with real-time progress animations and dark mode support.

Privacy First: All scanning happens locally on the user's device (unless API key is configured).

🛠️ Tech Stack

Frontend: React (v18)

Build Tool: Vite

Extension Core: Manifest V3, Chrome Scripting API

Styling: CSS3 (with Dark Mode support)

📦 Installation (For Developers)

Since this project uses React, you need to build it before installing it in Chrome.

Clone the repository

git clone [https://github.com/your-username/PhishGuard.git](https://github.com/your-username/PhishGuard.git)
cd PhishGuard


Install Dependencies

npm install


Build the Extension

npm run build


This creates a dist folder. This is your actual extension.

Load into Chrome

Open Chrome and go to chrome://extensions.

Enable Developer Mode (top right switch).

Click Load Unpacked.

Select the dist folder from your project.

📖 How to Use

Pin the Extension: Click the puzzle piece in Chrome and pin PhishGuard.

Visit a Page: Go to any website or open a suspicious email.

Scan: Click the PhishGuard shield icon.

It will automatically scan the URL and the page links.

Green Shield = Safe.

Red Siren = Threats Found.

Review Threats: If threats are found, scroll down in the popup to see exactly which links are dangerous and why.

🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.