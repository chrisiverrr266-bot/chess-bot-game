# ♟️ Chess Bot Master

An enhanced, feature-rich chess game where you can challenge AI opponents of varying difficulty levels. Built with vanilla JavaScript and powered by the Stockfish chess engine.

## 🎮 Features

### Multiple Difficulty Levels
- **Beginner (Level 1)**: Perfect for learning
- **Easy (Level 3)**: Good for casual players
- **Medium (Level 5)**: Balanced challenge
- **Hard (Level 8)**: For experienced players
- **Expert (Level 12)**: Serious competition
- **Master (Level 15)**: Very strong opponent
- **Grandmaster (Level 20)**: Maximum difficulty

### Game Features
- ✅ Play as White or Black
- ✅ Move history tracking
- ✅ Captured pieces display
- ✅ Undo move functionality
- ✅ Hint system for suggestions
- ✅ Bot thinking time display
- ✅ Game statistics (moves, captures)
- ✅ Check and checkmate detection
- ✅ Beautiful, responsive UI

## 🚀 Live Demo

Deploy to Vercel:
1. Fork or clone this repository
2. Connect to Vercel
3. Deploy with one click

## 💻 Local Development

1. Clone the repository:
```bash
git clone https://github.com/chrisiverrr266-bot/chess-bot-game.git
```

2. Open `index.html` in your browser

No build process required! This is a pure static website.

## 🎯 How to Play

1. Select your preferred difficulty level
2. Choose whether to play as White or Black
3. Click "New Game" to start
4. Drag and drop pieces to make moves
5. Use "Undo Move" to take back your last move
6. Click "Get Hint" for move suggestions

## 🛠️ Technologies Used

- **Chess Logic**: [chess.js](https://github.com/jhlywa/chess.js)
- **Board UI**: [chessboard.js](https://chessboardjs.com/)
- **AI Engine**: [Stockfish.js](https://github.com/nmrugg/stockfish.js/)
- **Styling**: Custom CSS with gradient design

## 📱 Responsive Design

The game automatically adapts to different screen sizes:
- Desktop: Three-column layout with all panels visible
- Mobile: Single-column layout for optimal mobile experience

## 🎨 Features Explained

### Bot Difficulty
The difficulty is controlled by search depth:
- Lower levels (1-3): Makes more mistakes, faster moves
- Medium levels (5-8): Balanced play
- High levels (12-20): Very strong, slower but more accurate

### Hint System
Provides suggestions for legal moves when you're stuck.

### Undo Move
Takes back both your last move and the bot's response.

### Statistics
- **Moves**: Total number of full moves played
- **Captures**: Pieces captured by both sides
- **Thinking Time**: How long the bot took for its last move

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🙏 Credits

- Stockfish team for the chess engine
- chess.js and chessboard.js developers
- Chess piece images from Wikipedia

---

Enjoy playing Chess Bot Master! 🎉