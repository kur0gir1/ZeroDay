<div align="center">
   <img src="https://github.com/kur0gir1/ZeroDay/blob/main/zeroday/public/ZeroDayTextLogo.png" alt="Logo" width="800px">
</div>

# ZeroDay Protocol - Game Design Document (GDD)

## Overview
ZeroDay Protocol is a cyberpunk-style quiz game that challenges players with confusing multiple-choice questions about IT and random things, but with a twist: the game actively messes with the player's experience by glitching the UI, screwing with timers, and scrambling answers.

You're not just answering questions — you're battling a hostile system that doesn't want you to win.

## Objective
- Enter your hacker alias.
- Answer questions across four difficulty categories (General, Easy, Moderate, Hard).
- Survive system glitches designed to disrupt your focus.
- Score points based on accuracy and question difficulty.
- Beat the clock — but watch out, because the clock might cheat on you.

## Core Gameplay & Mechanics

### Question Categories:
- **General** — 5 questions
- **Easy** — 10 questions
- **Moderate** — 5 questions
- **Hard** — 3 questions

### Question Format
- Confusing Multiple-Choice Questions: 4 options, only one right answer, all designed to mess with your brain.

### Timer System
- Each question starts with a base timer of 30 seconds, but glitches randomly shorten time unexpectedly.

### Points:
- General: 5 points/question
- Easy: 10 points/question
- Moderate: 20 points/question
- Hard: 30 points/question

### Glitch Effects (The Main Feature)
These happen randomly during the game, making it a hell of a lot harder to just brute force your way through:

- **Screen Blackout**: The screen goes black for ~5 seconds, blocking all input and forcing player to rely on memory or guess.
- **Glitched Answers**: Text for answers gets scrambled, distorted, or replaced with gibberish, forcing players to really pay attention.
- **Timer Tampering**: The countdown timer randomly speeds up or skips seconds, making time management a nightmare.
- **Input Delay**: Slight delays on button clicks to simulate lag.
- **Flickering UI Elements**: Borders, text, buttons flicker or shift positions briefly to mess with focus.
- **Screen Blackout**: The screen goes black, blocking all input and forcing the player to rely on memory or guess.
- **Glitched Answers**: Answer text is scrambled, distorted, or replaced with gibberish.
- **Timer Tampering**: The countdown timer randomly speeds up or skips seconds.
- **Input Delay**: Button clicks are delayed to simulate lag.
- **Flickering UI Elements**: Borders, text, and buttons flicker or shift positions.
- **Question Swap**: The current question is swapped with a random one for a few seconds.
- **Answer Shuffle**: The order of answer options is shuffled multiple times.
- **Reverse Controls**: The order of answer buttons is reversed, confusing navigation.
- **Phantom Click**: A random answer is automatically selected as if the player clicked it.
- **Screen Flip**: The entire game screen is flipped upside down.
- **Input Lock**: All input is temporarily disabled, making the game unresponsive.
- **Fake Progress**: The progress bar displays fake, random progress.
- **Font Corruption**: Text fonts become corrupted and hard to read.
- **Color Inversion**: The game's colors are inverted for a disorienting effect.
- **Answer Disappear**: Some or all answer options temporarily disappear.

## Game Flow
1. **Landing Page → Rules → Player Name Input**
   - Player starts with their alias.
2. **Quiz Game**
   - Questions flow category by category, with glitch effects dropping bombs randomly between or during questions.
3. **End Screen**
   - Summary of score, accuracy, and maybe a taunt from the system.

## Technologies
- React.js + Context API for state management.
- Framer Motion for glitch and UI animations.
- Tailwind CSS for dark cyberpunk styling.
- React Router for page navigation.

## Summary
ZeroDay Protocol is more than a quiz game. It's a high-stress, mind-bending hacking simulator where the system fights dirty — messing with your vision, timing, and sanity. Only the sharpest minds survive.

## How to Use ZeroDay

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kur0gir1/ZeroDay.git
   cd ZeroDay/zeroday
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Game
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the URL provided by Vite (e.g., `http://localhost:5173`).

### Building for Production
To create a production build of the game:
```bash
npm run build
```
The build files will be located in the `dist` directory.

### Previewing the Production Build
To preview the production build locally:
```bash
npm run preview
```

### Testing
To run tests (if available):
```bash
npm test
```

### Linting
To check for code style issues:
```bash
npm run lint
```

### Deployment
You can deploy the production build to any static hosting service like [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).

```bash
npm run build
```
Then upload the contents of the `dist` directory to your hosting service.
