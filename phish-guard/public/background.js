// --- BACKGROUND SCRIPT ---
// This runs in the background and handles browser-level tasks like the Icon Badge.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Listen for the "UPDATE_BADGE" command from content.js
    if (message.action === "UPDATE_BADGE") {
        const count = message.count;

        // We need the tab ID to know WHICH tab's icon to update
        // (sender.tab.id comes automatically from the message sender)
        const tabId = sender.tab?.id;

        if (tabId) {
            if (count > 0) {
                // 1. Set the text (e.g., "3")
                chrome.action.setBadgeText({ text: count.toString(), tabId: tabId });

                // 2. Set the background color (Red)
                chrome.action.setBadgeBackgroundColor({ color: "#FF0000", tabId: tabId });
            } else {
                // If 0 threats, remove the badge
                chrome.action.setBadgeText({ text: "", tabId: tabId });
            }
        }
    }
});