// --- CONTENT SCRIPT ---
// Runs inside the web page. Scans for bad links and adds warning bubbles.

// 1. AUTO-START: Run scanning 1 second after page load
setTimeout(() => {
    runScanner();
}, 1000);

// 2. LISTEN FOR POPUP COMMANDS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCAN_PAGE") {
        const results = runScanner();
        sendResponse(results);
    }
});

function runScanner() {
    console.log("PhishGuard: Scanning...");

    // CLEANUP: Remove old bubbles to avoid duplicates
    const oldBubbles = document.querySelectorAll('.phishguard-bubble');
    oldBubbles.forEach(b => b.remove());

    const allLinks = document.querySelectorAll('a');
    let threatsFound = [];

    // --- STEP 1: CHECK ADDRESS BAR ---
    const currentHostname = window.location.hostname;
    let mainUrlThreat = null;

    if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(currentHostname)) {
        mainUrlThreat = "Address Bar is Raw IP";
    } else {
        const badBrands = ["faceboook", "goggle", "paypaI", "amazonn"];
        if (badBrands.some(brand => currentHostname.includes(brand))) {
            mainUrlThreat = "Address Bar is Fake Brand";
        }
    }

    if (mainUrlThreat) {
        threatsFound.push({ url: window.location.href, reason: mainUrlThreat });
    }

    // --- STEP 2: CHECK LINKS ---
    allLinks.forEach(link => {
        const url = link.href;
        const text = link.innerText;
        let threatReason = null;

        // Rule A: IP Address
        if (url.match(/^[a-zA-Z]+:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
            threatReason = "Raw IP Address";
        }
        // Rule B: Typosquatting
        else {
            const badBrands = ["faceboook", "goggle", "paypaI", "amazonn"];
            if (badBrands.some(brand => url.includes(brand))) {
                threatReason = "Fake Brand Name";
            }
        }
        // Rule C: Bait and Switch
        if (text.toLowerCase().includes("google.com") && !url.includes("google.com")) {
            threatReason = "Mismatched URL";
        }

        // --- ACTION IF THREAT FOUND ---
        if (threatReason) {
            threatsFound.push({ url: url, reason: threatReason });

            // Red Border Highlight (Visual Warning)
            link.style.border = "2px solid red";
            link.style.backgroundColor = "rgba(255, 0, 0, 0.1)";

            // Show Warning Bubble with X button
            createDismissibleBubble(link, threatReason);
        }
    });

    // Update Icon Badge
    try {
        chrome.runtime.sendMessage({ action: "UPDATE_BADGE", count: threatsFound.length });
    } catch (e) { console.log(e); }

    return { count: threatsFound.length, threats: threatsFound };
}

// --- VISUAL HELPER: Draw Bubble with 'X' ---
function createDismissibleBubble(linkElement, reason) {
    // 1. Create Container
    const bubble = document.createElement("div");
    bubble.className = "phishguard-bubble";

    // 2. Styling
    bubble.style.position = "absolute";
    bubble.style.backgroundColor = "#ff4444";
    bubble.style.color = "white";
    bubble.style.padding = "4px 8px";
    bubble.style.borderRadius = "4px";
    bubble.style.fontSize = "12px";
    bubble.style.fontWeight = "bold";
    bubble.style.zIndex = "99999";
    bubble.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    bubble.style.whiteSpace = "nowrap";
    bubble.style.pointerEvents = "auto"; // Ensure clicks work

    // 3. Add Warning Text
    const textSpan = document.createElement("span");
    textSpan.innerText = `⚠️ ${reason}  `;
    bubble.appendChild(textSpan);

    // 4. Add 'X' Close Button
    const closeBtn = document.createElement("span");
    closeBtn.innerText = "✖";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.marginLeft = "5px";
    closeBtn.style.color = "#ffcccc";
    closeBtn.title = "Dismiss warning";

    // 5. Click Logic: Clean cleanup
    closeBtn.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();

        // A. Hide the bubble immediately
        bubble.style.display = "none";

        // B. Remove the bubble from HTML completely
        bubble.remove();

        // C. ALSO Remove the Red Highlight on the link (Clean up everything)
        linkElement.style.border = "";
        linkElement.style.backgroundColor = "";
    };

    bubble.appendChild(closeBtn);

    // 6. Positioning
    const rect = linkElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    bubble.style.top = `${rect.top + scrollTop - 32}px`;
    bubble.style.left = `${rect.left + scrollLeft}px`;

    document.body.appendChild(bubble);
}