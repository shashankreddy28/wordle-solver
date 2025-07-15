// solver.js

// Store previous attempts in memory
let previousAttempts = [];

function addAttempt(guess, feedback) {
    previousAttempts.push({ guess, feedback });
}

function resetAttempts() {
    previousAttempts = [];
}

function filterWords(wordList, guess, feedback) {
    // For backward compatibility, allow single filtering
    return filterWordsWithAttempts(wordList, [...previousAttempts, { guess, feedback }]);
}

function filterWordsWithAttempts(wordList, attempts) {
    return wordList.filter(word => attempts.every(({ guess, feedback }) => isValid(word, guess, feedback)));
}

function isValid(word, guess, feedback) {
    // Convert to arrays if not already
    let wordLetters = word.split('');
    let guessLetters = guess.split('');
    let feedbackArr = Array.isArray(feedback) ? feedback : feedback.split('');

    // Track letter usage for G and Y
    let usedInWord = Array(5).fill(false);
    let usedInGuess = Array(5).fill(false);

    // 1. Greens
    for (let i = 0; i < 5; i++) {
        if (feedbackArr[i] === 'G') {
            if (guessLetters[i] !== wordLetters[i]) return false;
            usedInWord[i] = true;
            usedInGuess[i] = true;
        }
    }

    // 2. Yellows
    for (let i = 0; i < 5; i++) {
        if (feedbackArr[i] === 'Y') {
            if (guessLetters[i] === wordLetters[i]) return false;
            // Find a matching letter elsewhere in the word that hasn't been used
            let found = false;
            for (let j = 0; j < 5; j++) {
                if (!usedInWord[j] && wordLetters[j] === guessLetters[i] && i !== j) {
                    usedInWord[j] = true;
                    usedInGuess[i] = true;
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
    }

    // 3. Blacks (B): For each letter in guess with B, ensure the word does not have more occurrences than already matched by G/Y
    for (let i = 0; i < 5; i++) {
        if (feedbackArr[i] === 'B') {
            let guessChar = guessLetters[i];
            // Count how many times this letter is marked G or Y in guess
            let requiredCount = 0;
            for (let k = 0; k < 5; k++) {
                if (guessLetters[k] === guessChar && (feedbackArr[k] === 'G' || feedbackArr[k] === 'Y')) {
                    requiredCount++;
                }
            }
            // Count total occurrences in word
            let wordCount = wordLetters.filter(c => c === guessChar).length;
            if (wordCount > requiredCount) return false;
        }
    }

    return true;
}

// Example usage:
// addAttempt('slate', 'YYYBG');
// let filtered = filterWordsWithAttempts(WORD_LIST, previousAttempts);
// resetAttempts();

