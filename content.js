chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getGuessFeedback") {
        try {
            const gameRows = document.querySelectorAll('div[class^="Row-module_row"]');
            let lastGuessRow = null;

            for (let i = gameRows.length - 1; i >= 0; i--) {
                const row = gameRows[i];
                const tiles = row.querySelectorAll('div[class^="Tile-module_tile"]');
                
                if (tiles.length === 5) {
                    const firstTileState = tiles[0].getAttribute('data-state');
                    if (firstTileState && firstTileState !== 'empty' && firstTileState !== 'tbd') {
                        lastGuessRow = Array.from(tiles).map(tile => ({
                            letter: tile.textContent.toLowerCase(),
                            feedback: tile.getAttribute('data-state') // correct, present, absent
                        }));
                        break;
                    }
                }
            }

            if (lastGuessRow) {
                sendResponse({ row: lastGuessRow });
            } else {
                sendResponse({ error: "Could not find a completed guess. Please make a guess first." });
            }
        } catch (e) {
            sendResponse({ error: `An error occurred: ${e.message}` });
        }
    }
    return true; // Indicates that the response is sent asynchronously
});