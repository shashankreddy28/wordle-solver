// content.js

/**
 * Recursively searches for an element matching the selector, piercing through all open shadow DOMs.
 * @param {Node} rootNode - The node to start the search from (e.g., document).
 * @param {string} selector - The CSS selector to find.
 * @returns {Element|null} - The found element or null.
 */
function findElementInShadows(rootNode, selector) {
    const found = rootNode.querySelector(selector);
    if (found) {
        return found;
    }
    const allElements = rootNode.querySelectorAll('*');
    for (const element of allElements) {
        if (element.shadowRoot) {
            const foundInShadow = findElementInShadows(element.shadowRoot, selector);
            if (foundInShadow) {
                return foundInShadow;
            }
        }
    }
    return null;
}

function handleRequest(request, sendResponse) {
    const findGameData = (attempt = 0) => {
        const gameContainer = findElementInShadows(document, '#board-container, #board, div[class^="Board-module_boardContainer"], div[class^="Board-module_board"]');

        if (gameContainer) {
            extractData(request, sendResponse, gameContainer);
        } else if (attempt < 15) { // Try for up to 3 seconds
            setTimeout(() => findGameData(attempt + 1), 200);
        } else {
            sendResponse({ error: "Could not find the Wordle game board on the page." });
        }
    };

    findGameData();
}

function extractData(request, sendResponse, gameContainer) {
    if (request.type === "getAllAttempts") {
        try {
            let attempts = [];

            // Try Wordle Archive selectors first
            const archiveRows = gameContainer.querySelectorAll('game-row[letters]');
            if (archiveRows.length > 0) {
                archiveRows.forEach(row => {
                    const guess = row.getAttribute('letters');
                    if (guess && guess.length === 5 && row.shadowRoot) {
                        const tileNodes = row.shadowRoot.querySelectorAll('game-tile');
                        if (tileNodes.length === 5) {
                            const feedback = Array.from(tileNodes).map(tile => {
                                const state = tile.getAttribute('evaluation');
                                if (state === 'correct') return 'G';
                                if (state === 'present') return 'Y';
                                if (state === 'absent') return 'B';
                                return '';
                            }).join('');
                            if (feedback.length === 5) { attempts.push({ guess, feedback }); }
                        }
                    }
                });
            }

            // If no attempts found from Wordle Archive, try NYT selectors
            if (attempts.length === 0) {
                const nytRows = gameContainer.querySelectorAll('div[class^="Row-module_row"]');
                nytRows.forEach(row => {
                    const tiles = row.querySelectorAll('div[class^="Tile-module_tile"]');
                    if (tiles.length === 5 && tiles[0].getAttribute('data-state') !== 'empty') {
                        const guess = Array.from(tiles).map(tile => tile.textContent.toLowerCase()).join('');
                        const feedback = Array.from(tiles).map(tile => {
                            const state = tile.getAttribute('data-state');
                            if (state === 'correct') return 'G';
                            if (state === 'present') return 'Y';
                            if (state === 'absent') return 'B';
                            return '';
                        }).join('');
                        if (feedback.length === 5) { attempts.push({ guess, feedback }); }
                    }
                });
            }
            sendResponse({ attempts });
        } catch (e) { sendResponse({ error: `An error occurred: ${e.message}` }); }
    }
}

if (!window.hasWordleSolverListener) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleRequest(request, sendResponse);
        return true; // Keep channel open for async response
    });
    window.hasWordleSolverListener = true;
}
