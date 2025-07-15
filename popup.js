document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guess').value = 'crane';
    renderAttempts();
});

let wordList = WORD_LIST; // from wordlist.js

function renderAttempts() {
    const attemptsDiv = document.getElementById('attempts');
    if (!attemptsDiv) return;
    attemptsDiv.innerHTML = '';
    if (previousAttempts.length === 0) {
        attemptsDiv.textContent = 'No previous attempts.';
        return;
    }
    previousAttempts.forEach(({ guess, feedback }, idx) => {
        const el = document.createElement('div');
        el.textContent = `Attempt ${idx + 1}: ${guess.toUpperCase()} (${feedback.toUpperCase()})`;
        attemptsDiv.appendChild(el);
    });
}

document.getElementById('solveBtn').addEventListener('click', () => {
    const guess = document.getElementById('guess').value.toLowerCase();
    const feedback = document.getElementById('feedback').value.toUpperCase();

    if (guess.length !== 5 || feedback.length !== 5) {
        alert('Guess and feedback must be 5 characters');
        return;
    }

    addAttempt(guess, feedback);
    // Always filter from the full word list using all attempts
    const filtered = filterWordsWithAttempts(WORD_LIST, previousAttempts);
    wordList = filtered;
    const result = filtered.slice(0, 10).join(', ');
    document.getElementById('result').textContent = result || 'No suggestions left.';
    renderAttempts();
});

document.getElementById('getFeedbackBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getGuessFeedback" }, (response) => {
            if (response && response.row) {
                const feedbackString = response.row.map(tile => {
                    if (tile.feedback === 'correct') return 'G';
                    if (tile.feedback === 'present') return 'Y';
                    if (tile.feedback === 'absent') return 'B';
                    return '';
                }).join('');
                document.getElementById('feedback').value = feedbackString;
                document.getElementById('guess').value = response.row.map(tile => tile.letter).join('');
            } else if (response && response.error) {
                document.getElementById('result').textContent = response.error;
            } else {
                document.getElementById('result').textContent = 'Could not get feedback. Make sure you are on the Wordle page and have made a guess.';
            }
        });
    });
});

// Add a Reset button to clear attempts and reset the word list
if (!document.getElementById('resetBtn')) {
    const resetBtn = document.createElement('button');
    resetBtn.id = 'resetBtn';
    resetBtn.textContent = 'Reset Game';
    resetBtn.style.marginTop = '10px';
    document.querySelector('.container').appendChild(resetBtn);
    resetBtn.addEventListener('click', () => {
        resetAttempts();
        wordList = WORD_LIST;
        document.getElementById('result').textContent = '';
        renderAttempts();
    });
}

// Add a div to display previous attempts if not present
if (!document.getElementById('attempts')) {
    const attemptsDiv = document.createElement('div');
    attemptsDiv.id = 'attempts';
    attemptsDiv.style.marginTop = '10px';
    document.querySelector('.container').appendChild(attemptsDiv);
    renderAttempts();
}