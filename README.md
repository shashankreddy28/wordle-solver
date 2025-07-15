# Wordle Solver Assistant

A Chrome extension to help you solve Wordle puzzles by suggesting the best next guess based on your previous attempts.
Still missing the feature to automate teh board information.
---

## Features

- 💡 Suggests optimal next guesses based on your input.
- 🔍 Optionally fetches your last guess and feedback directly from the Wordle game page.
- 🖱️ Clean, intuitive popup interface.
- ⚡ Fast, privacy-friendly—no data leaves your browser.
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

1. Play Wordle on [nytimes.com/games/wordle](https://www.nytimes.com/games/wordle/).
2. Click the Wordle Solver Assistant extension icon.
3. Click **Reset Game** to auto-fill your last guess and feedback, or enter them manually (G for Green, Y for Yellow, B for Black).
4. Click **Suggest Next Word** to see the top suggestions.

---

## Technical Overview

- **popup.html / popup.js**: The user interface and logic for input and displaying suggestions.
- **content.js**: Reads the current guess and feedback from the Wordle game page.
- **solver.js**: Implements the filtering algorithm to suggest valid words.
- **wordlist.js**: Contains the list of valid 5-letter words.
- **manifest.json**: Chrome extension manifest (permissions, scripts, etc).
- **styles.css**: Styles for the popup UI.
- **icon.png**: Extension icon.

### How it Works

1. **User Input**: Enter your guess and feedback (e.g., "GYBBG" for Green, Yellow, Black, Black, Green) in the popup, or use the auto-fetch button.
2. **Word Filtering**: The solver filters the word list based on your input.
3. **Suggestions Display**: The popup shows the top suggestions.
4. **Automated Feedback (Planned)**: The extension can fetch your last guess and feedback from the Wordle page.

---

## License

MIT
