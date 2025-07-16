chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getAllAttempts') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                sendResponse({ error: `Querying tabs failed: ${chrome.runtime.lastError.message}` });
                return;
            }

            if (tabs && tabs.length > 0) {
                const targetTab = tabs[0];
                chrome.scripting.executeScript({
                    target: { tabId: targetTab.id },
                    files: ['content.js']
                }, () => {
                    if (chrome.runtime.lastError) {
                        sendResponse({ error: `Script injection failed: ${chrome.runtime.lastError.message}` });
                        return;
                    }
                    chrome.tabs.sendMessage(targetTab.id, request, (response) => {
                        if (chrome.runtime.lastError) {
                            sendResponse({ error: `Sending message to tab failed: ${chrome.runtime.lastError.message}` });
                        } else {
                            sendResponse(response);
                        }
                    });
                });

            } else {
                sendResponse({ error: "No active tab found." });
            }
        });
        return true; // Keep the message channel open for the asynchronous response
    }
});