# Wordle Solver Assistant

A Chrome extension to help you solve Wordle puzzles by suggesting the best next guess based on your previous attempts.

---

## Features

- 💡 Suggests optimal next guesses based on your input.
- ⚡ **Automatically imports all attempts** directly from both NYT Wordle and Wordle Archive game pages.
- 🖱️ Clean, intuitive popup interface.
- 🚀 Fast, privacy-friendly—no data leaves your browser.
- 📝 Uses a large, built-in list of valid 5-letter words.

---

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the project directory.
5. The extension icon will appear in your toolbar.

---

## Usage

1. Play Wordle on [nytimes.com/games/wordle](https://www.nytimes.com/games/wordle/) or [wordlearchive.com](https://www.wordlearchive.com/).
2. Click the Wordle Solver Assistant extension icon.
3. Click **Import All Attempts** to automatically fetch your current game's guesses and feedback.
4. Alternatively, enter your guess and feedback manually (G for Green, Y for Yellow, B for Black).
5. Click **Suggest Next Word** to see the top suggestions.
6. Click **Reset Game** to clear all attempts and start fresh.

---

## Technical Overview

- **popup.html / popup.js**: The user interface and logic for input and displaying suggestions.
- **background.js**: Manages communication between the popup and content scripts, and programmatically injects the content script.
- **content.js**: Injected into the Wordle game page, it robustly extracts game data (guesses and feedback) from both NYT Wordle and Wordle Archive, handling complex page structures including Shadow DOM.
- **solver.js**: Implements the filtering algorithm to suggest valid words.
- **wordlist.js**: Contains the list of valid 5-letter words.
- **manifest.json**: Chrome extension manifest (permissions, scripts, etc).
- **styles.css**: Styles for the popup UI.
- **icon.png**: Extension icon.

### How it Works

1. **Game Data Extraction**: When you click "Import All Attempts", the `background.js` script injects `content.js` into the active Wordle tab. `content.js` then performs a deep search for the game board, extracts all previous guesses and their feedback, and sends this data back to the `popup.js`.
2. **User Input**: You can also manually enter your guess and feedback.
3. **Word Filtering**: The `solver.js` filters the word list based on your input and the imported attempts.
4. **Suggestions Display**: The `popup.js` displays the top suggestions.

---

## License

MIT