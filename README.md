# PhishGuard 🛡️

## AI-Powered Phishing Detection Extension for Chrome

PhishGuard is a browser extension designed to protect users from phishing attacks in real-time. It analyzes both the **Address Bar URL** and **Page Content** (links inside emails/websites) to detect suspicious patterns, typosquatting, and raw IP usage.

Built with **React**, **Vite**, and the **Chrome Extension Manifest V3**.

> **Note:** Replace this text with a screenshot of your extension later!

---

## 🚀 Features

**1. Dual-Layer Scanning**
* **Layer 1:** Scans the browser address bar for IP addresses, long URLs, and fake domains.
* **Layer 2:** Scans the actual content of the webpage (perfect for Gmail/Outlook) to find hidden trap links.

**2. Heuristic Detection Engine**
* **Typosquatting:** Detects fake brands like `faceboook.com` or `goggle.com`.
* **IP Detection:** Flags URLs that use raw IP addresses (e.g., `http://192.168.1.5`).
* **Bait & Switch:** Detects links where the text says "Google" but the link goes to "EvilSite".

**3. User Interface**
* **Nano-Style UI:** Modern, clean interface with real-time progress animations.
* **Dark Mode:** Automatically adapts to your system theme.
* **Privacy First:** All scanning happens locally on the user's device.

---

## 🛠️ Tech Stack

* **Frontend:** React (v18)
* **Build Tool:** Vite
* **Extension Core:** Manifest V3, Chrome Scripting API
* **Styling:** CSS3

---

## 📦 Installation (For Developers)

Since this project uses React, you need to build it before installing it in Chrome.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/PhishGuard.git](https://github.com/your-username/PhishGuard.git)
cd PhishGuard
