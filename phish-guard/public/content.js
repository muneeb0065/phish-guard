// --- CONTENT SCRIPT ---
// This file does NOT run in the popup. 
// It runs INSIDE the actual web page (e.g., inside the Gmail tab).

// 1. Listen for messages from the Popup (App.jsx)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // If the popup says "SCAN_PAGE", we start working
    if (request.action === "SCAN_PAGE") {
        console.log("PhishGuard: Scanning all links on page...");

        // 2. Get every single <a> tag (link) on the screen
        const allLinks = document.querySelectorAll('a');
        let threatsFound = [];

        // 3. Loop through each link to check it
        allLinks.forEach(link => {
            const url = link.href;       // The real destination (where it goes)
            const text = link.innerText; // The visible text (what you read)

            // --- HEURISTIC RULES (The Logic) ---

            // Rule A: IP Address Check
            // Does the link look like http://192.168.1.1?
            if (url.match(/^[a-zA-Z]+:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
                threatsFound.push({
                    url: url,
                    reason: "Link points to a raw IP address"
                });

                // Highlight the bad link in Red/Yellow so the user sees it
                link.style.border = "3px solid red";
                link.style.backgroundColor = "yellow";
            }

            // Rule B: Typosquatting (Fake Brands)
            // Does it look like "faceboook" or "goggle"?
            const badBrands = ["faceboook", "goggle", "paypaI", "amazonn"];
            if (badBrands.some(brand => url.includes(brand))) {
                threatsFound.push({
                    url: url,
                    reason: "Suspicious brand spelling (Typosquatting)"
                });
                link.style.border = "3px solid red";
            }

            // Rule C: The "Bait and Switch"
            // Does the text say "google.com" but the link goes to "evil.com"?
            if (text.includes("google.com") && !url.includes("google.com")) {
                threatsFound.push({
                    url: url,
                    reason: "Link text does not match the actual destination"
                });
                link.style.border = "3px solid red";
            }
        });

        // 4. Send the report back to the Popup
        sendResponse({
            count: threatsFound.length,
            threats: threatsFound
        });
    }
});