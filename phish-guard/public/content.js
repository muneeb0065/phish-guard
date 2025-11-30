// This script runs INSIDE the web page (e.g., inside Gmail)

// Listen for a message from the React Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "SCAN_PAGE") {
        console.log("PhishGuard: Scanning all links on page...");

        // 1. Get ALL links on the page
        const allLinks = document.querySelectorAll('a');
        let threatsFound = [];

        // 2. Loop through every link
        allLinks.forEach(link => {
            const url = link.href;
            const text = link.innerText; // The text the user sees (e.g., "Click Here")

            // --- HEURISTIC RULES ---

            // Rule A: IP Address
            if (url.match(/^[a-zA-Z]+:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
                threatsFound.push({
                    url: url,
                    reason: "Link points to a raw IP address"
                });
                // Highlight the bad link on the page visually
                link.style.border = "3px solid red";
                link.style.backgroundColor = "yellow";
            }

            // Rule B: Typosquatting (Fake Brands)
            const badBrands = ["faceboook", "goggle", "paypaI", "amazonn"];
            if (badBrands.some(brand => url.includes(brand))) {
                threatsFound.push({
                    url: url,
                    reason: "Suspicious brand spelling (Typosquatting)"
                });
                link.style.border = "3px solid red";
            }

            // Rule C: Mismatched Text (The " Bait and Switch")
            // Example: Text says "google.com" but link goes to "evil.com"
            if (text.includes("google.com") && !url.includes("google.com")) {
                threatsFound.push({
                    url: url,
                    reason: "Link text does not match the actual destination"
                });
                link.style.border = "3px solid red";
            }
        });

        // 3. Send the list of bad links back to React
        sendResponse({
            count: threatsFound.length,
            threats: threatsFound
        });
    }
});