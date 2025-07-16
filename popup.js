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

// Add a button to import all attempts from the Wordle page
if (!document.getElementById('importAllBtn')) {
    const importBtn = document.createElement('button');
    importBtn.id = 'importAllBtn';
    importBtn.textContent = 'Import All Attempts';
    importBtn.style.marginTop = '10px';
    document.querySelector('.container').appendChild(importBtn);
    importBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'getAllAttempts' }, (response) => {
            if (chrome.runtime.lastError) {
                document.getElementById('result').textContent = `Error: ${chrome.runtime.lastError.message}`;
                return;
            }
            if (response && response.attempts) {
                resetAttempts();
                response.attempts.forEach(({ guess, feedback }) => addAttempt(guess, feedback));
                const filtered = filterWordsWithAttempts(WORD_LIST, previousAttempts);
                wordList = filtered;
                document.getElementById('result').textContent = filtered.slice(0, 10).join(', ') || 'No suggestions left.';
                renderAttempts();
            } else if (response && response.error) {
                document.getElementById('result').textContent = response.error;
            }
        });
    });
}

