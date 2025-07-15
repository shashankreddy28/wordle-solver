chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getGuessFeedback") {
        try {
            // NYT Wordle: get last completed row
            const nytRows = document.querySelectorAll('div[class^="Row-module_row"]');
            let lastGuessRow = null;
            for (let i = nytRows.length - 1; i >= 0; i--) {
                const row = nytRows[i];
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
    // Extract all attempts for both NYT and wordlearchive.com
    else if (request.type === "getAllAttempts") {
        try {
            let attempts = [];
            // NYT Wordle
            const nytRows = document.querySelectorAll('div[class^="Row-module_row"]');
            for (let i = 0; i < nytRows.length; i++) {
                const row = nytRows[i];
                const tiles = row.querySelectorAll('div[class^="Tile-module_tile"]');
                if (tiles.length === 5) {
                    const firstTileState = tiles[0].getAttribute('data-state');
                    if (firstTileState && firstTileState !== 'empty' && firstTileState !== 'tbd') {
                        const guess = Array.from(tiles).map(tile => tile.textContent.toLowerCase()).join('');
                        const feedback = Array.from(tiles).map(tile => {
                            const state = tile.getAttribute('data-state');
                            if (state === 'correct') return 'G';
                            if (state === 'present') return 'Y';
                            if (state === 'absent') return 'B';
                            return '';
                        }).join('');
                        if (guess.length === 5 && feedback.length === 5) {
                            attempts.push({ guess, feedback });
                        }
                    }
                }
            }
            // wordlearchive.com
            if (attempts.length === 0) {
                const board = document.querySelector('#board');
                if (board) {
                    const archiveRows = board.querySelectorAll('game-row[letters]');
                    archiveRows.forEach(row => {
                        const guess = row.getAttribute('letters');
                        if (guess && guess.length === 5) {
                            const tileNodes = row.querySelectorAll('.row > game-tile');
                            let feedback = '';
                            if (tileNodes.length === 5) {
                                feedback = Array.from(tileNodes).map(tile => {
                                    const state = tile.getAttribute('evaluation');
                                    if (state === 'correct') return 'G';
                                    if (state === 'present') return 'Y';
                                    if (state === 'absent') return 'B';
                                    return '';
                                }).join('');
                            }
                            if (feedback.length === 5) {
                                attempts.push({ guess, feedback });
                            }
                        }
                    });
                }
            }
            sendResponse({ attempts });
        } catch (e) {
            sendResponse({ error: `An error occurred: ${e.message}` });
        }
    }
    return true; // Indicates that the response is sent asynchronously
});