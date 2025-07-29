import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// eslint-disable-next-line no-unused-vars
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { usePlayer } from "../context/playerContext";
import { useNavigate } from "react-router-dom";
import {
  GeneralQuestions,
  EasyQuestions,
  ModerateQuestions,
  HardQuestions,
} from "../data/questions";

// Define ALL_GLITCHES at the top
const ALL_GLITCHES = [
  "screenBlackout",
  "glitchedAnswers",
  "timerTampering",
  "inputDelay",
  "flickeringUI",
  "questionSwap",
  "answerShuffle",
  "reverseControls",
  "phantomClick",
  "screenFlip",
  "inputLock",
  "fakeProgress",
  "fontCorruption",
  "colorInversion",
  "answerDisappear",
];

export default function Game() {
  const navigate = useNavigate();
  const context = usePlayer();
  const playerName = context?.playerName || "HackerMans";
  // Use context for all game state
  const {
    points,
    setPoints,
    health,
    setHealth,
    glitchHistory,
    setGlitchHistory,
    allQuestions,
    setAllQuestions,
    correctAnswers,
    setCorrectAnswers,
    // totalTime,
    setTotalTime,
  } = context;

  // Remove local state for points, health, glitchHistory, progressIndex, allQuestions
  // Use only context state for these
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [isScreenBlackout, setIsScreenBlackout] = useState(false);
  const [areAnswersGlitched, setAreAnswersGlitched] = useState(false);
  const [isTimerTampered, setIsTimerTampered] = useState(false);
  const [isInputDelayed, setIsInputDelayed] = useState(false);
  const [areUIElementsFlickering, setAreUIElementsFlickering] = useState(false);
  const [glitchQueue, setGlitchQueue] = useState([]);
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isQuestionSwapped, setIsQuestionSwapped] = useState(false);
  const [areControlsReversed, setAreControlsReversed] = useState(false);
  const [isScreenFlipped, setIsScreenFlipped] = useState(false);
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [isFakeProgress, setIsFakeProgress] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isFontCorrupted, setIsFontCorrupted] = useState(false);
  const [isColorInverted, setIsColorInverted] = useState(false);
  const [areAnswersHidden, setAreAnswersHidden] = useState(false);
  const [blackoutDisplayText, setBlackoutDisplayText] = useState("");
  const [isBlackoutTyping, setIsBlackoutTyping] = useState(false);
  const [showGlitchLog, setShowGlitchLog] = useState(false);

  const timeRef = useRef(null);
  const questionRef = useRef(null);

  useEffect(() =>{
    const interval = setInterval(() =>
      setTotalTime((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }, [setTotalTime]);

  // On mount, initialize questions and context state
  useEffect(() => {
    const generalQuestions = new GeneralQuestions()
      .getAllQuestions({ shuffle: true })
      .slice(0, 20);
    // const easyQuestionsSet = new EasyQuestions()
    //   .getAllQuestions({ shuffle: true })
    //   .slice(0, 10);
    // const moderateQuestionsSet = new ModerateQuestions()
    //   .getAllQuestions({ shuffle: true })
    //   .slice(0, 5);
    // const hardQuestionsSet = new HardQuestions()
    //   .getAllQuestions({ shuffle: true })
    //   .slice(0, 3);
    const questions = [
      ...generalQuestions,
      // ...easyQuestionsSet,
      // ...moderateQuestionsSet,
      // ...hardQuestionsSet,
    ];
    setAllQuestions(questions);
    setPoints(0);
    setHealth(100);
    setGlitchHistory([]);
    setCorrectAnswers(0);
    // eslint-disable-next-line
  }, []);

  const currentQuestion = allQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion) return;
    questionRef.current?.focus();
    clearInterval(timeRef.current);
    setTimeLeft(30);
    timeRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
  }, [currentQuestionIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0 && !hasTimedOut) {
      setHasTimedOut(true);
      handleWrongAnswer(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, hasTimedOut]);

  useEffect(() => {
    if (health === 0) {
      navigate("/gameOver");
    }
  }, [health, navigate]);

  // --- MILESTONES ---
  const milestones = [25, 50, 75, 100];
  const progressPercent = (correctAnswers / allQuestions.length) * 100;
  const reachedMilestone = milestones.find(
    (m) => Math.round(progressPercent) === m
  );
  const [milestoneMsg, setMilestoneMsg] = useState("");
  useEffect(() => {
    if (reachedMilestone) {
      setMilestoneMsg(`Milestone reached: ${reachedMilestone}%!`);
      setTimeout(() => setMilestoneMsg(""), 2000);
    }
  }, [reachedMilestone]);

  const goToNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setTimeLeft(30);
    setHasTimedOut(false);
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      navigate("/gameComplete");
    }
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.options[currentQuestion.answer]) {
      setIsAnswerCorrect(true);
      setPoints((prev) => {
        const newPoints = prev + (currentQuestion.points || 1);
        context.setPoints(newPoints);
        return newPoints;
      });
      setCorrectAnswers((prev) => {
        const newCorrect = prev + 1;
        context.setCorrectAnswers(newCorrect);
        return newCorrect;
      });
      setTimeout(() => goToNextQuestion(), 1000);
    } else {
      setIsAnswerCorrect(false);
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = () => {
    // Only deduct health if not already at 0
    if (health > 0) {
      // Use only context.setHealth, not setHealth, to avoid double state updates
      const newHealth = Math.max(0, health - 20);
      setHealth(newHealth);
    }
    setFlashRed(true);
    setTimeout(() => setFlashRed(false), 500);
    // Add a hard question dynamically when the player gets a question wrong
    const hardQuestions = new HardQuestions().getAllQuestions({ shuffle: true });
    const newHardQuestion = hardQuestions.find(
      (q) => !allQuestions.some((existing) => existing.id === q.id)
    );
    if (newHardQuestion) {
      setAllQuestions((prev) => {
        const updated = [...prev, newHardQuestion];
        setAllQuestions(updated); // context setter only
        return updated;
      });
    }
    setTimeout(() => goToNextQuestion(false), 1000);
  };

  // --- GLITCH QUEUE SYSTEM ---
  const queueGlitches = (glitches) => {
    setGlitchQueue((prev) => [...prev, ...glitches]);
  };

  useEffect(() => {
    if (!isGlitchActive && glitchQueue.length > 0) {
      setIsGlitchActive(true);
      const glitch = glitchQueue[0];
      let duration = 0;
      setGlitchHistory((prev) => {
        const updated = [
          { name: glitch, time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4),
        ];
        context.setGlitchHistory(updated);
        return updated;
      });
      switch (glitch) {
        case "screenBlackout":
          duration = applyScreenBlackout();
          break;
        case "glitchedAnswers":
          duration = applyGlitchedAnswers();
          break;
        case "timerTampering":
          duration = applyTimerTampering();
          break;
        case "inputDelay":
          duration = applyInputDelay();
          break;
        case "flickeringUI":
          duration = applyFlickeringUI();
          break;
        case "questionSwap":
          duration = applyQuestionSwap();
          break;
        case "answerShuffle":
          duration = applyAnswerShuffle();
          break;
        case "reverseControls":
          duration = applyReverseControls();
          break;
        case "phantomClick":
          duration = applyPhantomClick();
          break;
        case "screenFlip":
          duration = applyScreenFlip();
          break;
        case "inputLock":
          duration = applyInputLock();
          break;
        case "fakeProgress":
          duration = applyFakeProgress();
          break;
        case "fontCorruption":
          duration = applyFontCorruption();
          break;
        case "colorInversion":
          duration = applyColorInversion();
          break;
        case "answerDisappear":
          duration = applyAnswerDisappear();
          break;
        default:
          duration = 0;
      }
      setTimeout(() => {
        setGlitchQueue((prev) => prev.slice(1));
        setIsGlitchActive(false);
      }, duration);
    }
    // Intentionally not including glitch effect functions in deps to avoid infinite loops
    // eslint-disable-next-line
  }, [glitchQueue, isGlitchActive]);

  // --- GLITCH EFFECTS SYSTEM ---

  const getGlitchChance = (difficulty) => {
    switch (difficulty) {
      case "General":
        return 30;
      case "Easy":
        return 40;
      case "Moderate":
        return 60;
      case "Hard":
        return 80;
      default:
        return 0;
    }
  };
  const pickGlitches = (glitchList = ALL_GLITCHES) => {
    const shuffled = [...glitchList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.random() < 0.5 ? 1 : 2);
  };

  // --- GLITCH RANDOMIZER SYSTEM ---
  useEffect(() => {
    if (!currentQuestion) return;
    let glitchTimeout;
    let randomGlitchInterval;
    let isUnmounted = false;

    // Start first glitch 5s after question loads
    glitchTimeout = setTimeout(() => {
      if (isUnmounted) return;
      const chance = getGlitchChance(currentQuestion.category);
      if (Math.random() * 100 < chance) {
        const glitches = pickGlitches([
          "screenBlackout",
          "glitchedAnswers",
          "timerTampering",
          "inputDelay",
          "flickeringUI",
          "questionSwap",
          "answerShuffle",
          "reverseControls",
          "phantomClick",
          "screenFlip",
          "inputLock",
          "fakeProgress",
          "fontCorruption",
          "colorInversion",
          "answerDisappear",
        ]);
        queueGlitches(glitches);
      }
      // After first, start random interval glitches
      const scheduleNextGlitch = () => {
        if (isUnmounted) return;
        const nextDelay = 3000 + Math.random() * 3000; // 3-6s
        randomGlitchInterval = setTimeout(() => {
          if (isUnmounted) return;
          const chance = getGlitchChance(currentQuestion.category);
          if (Math.random() * 100 < chance) {
            const glitches = pickGlitches([
              "screenBlackout",
              "glitchedAnswers",
              "timerTampering",
              "inputDelay",
              "flickeringUI",
              "questionSwap",
              "answerShuffle",
              "reverseControls",
              "phantomClick",
              "screenFlip",
              "inputLock",
              "fakeProgress",
              "fontCorruption",
              "colorInversion",
              "answerDisappear",
            ]);
            queueGlitches(glitches);
          }
          scheduleNextGlitch();
        }, nextDelay);
      };
      scheduleNextGlitch();
    }, 3000);

    return () => {
      isUnmounted = true;
      clearTimeout(glitchTimeout);
      clearTimeout(randomGlitchInterval);
    };
  }, [currentQuestionIndex, currentQuestion]);

  // --- GLITCH EFFECTS IMPLEMENTATION ---

  const applyScreenBlackout = () => {
    const message = getRandomBlackoutMessage();
    setIsScreenBlackout(true);
    setBlackoutDisplayText("");
    setIsBlackoutTyping(true);
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= message.length) {
        setBlackoutDisplayText(message.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsBlackoutTyping(false);
      }
    }, 20);
    // 10s blackout, but randomize between 7-13s for aggravation
    const duration = 7000 + Math.floor(Math.random() * 6000);
    setTimeout(() => {
      setIsScreenBlackout(false);
      setBlackoutDisplayText("");
      setIsBlackoutTyping(false);
      clearInterval(typingInterval);
    }, duration);
    return duration;
  };

  const applyGlitchedAnswers = () => {
    setAreAnswersGlitched(true);
    const duration = 7000 + Math.floor(Math.random() * 4000);
    setTimeout(() => setAreAnswersGlitched(false), duration);
    return duration;
  };

  const applyTimerTampering = () => {
    setIsTimerTampered(true);
    clearInterval(timeRef.current);
    const tamperInterval = setInterval(() => {
      setTimeLeft((prev) => {
        const dec = Math.random() < 0.4 ? Math.floor(Math.random() * 3 + 1) : 1;
        return Math.max(0, prev - dec);
      });
    }, 1000);
    timeRef.current = tamperInterval;
    const duration = 8000 + Math.floor(Math.random() * 4000);
    setTimeout(() => {
      clearInterval(tamperInterval);
      setIsTimerTampered(false);
      if (timeLeft > 0) {
        timeRef.current = setInterval(() => {
          setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
      }
    }, duration);
    return duration;
  };

  const applyInputDelay = () => {
    setIsInputDelayed(true);
    const duration = 10000 + Math.floor(Math.random() * 4000);
    setTimeout(() => setIsInputDelayed(false), duration);
    return duration;
  };

  const applyFlickeringUI = () => {
    setAreUIElementsFlickering(true);
    const flickerInterval = setInterval(() => {
      setAreUIElementsFlickering((prev) => !prev);
    }, 200);
    const duration = 6000 + Math.floor(Math.random() * 4000);
    setTimeout(() => {
      clearInterval(flickerInterval);
      setAreUIElementsFlickering(false);
    }, duration);
    return duration;
  };

  const applyQuestionSwap = () => {
    // Swap to a random question for 4 seconds, then swap back
    setIsQuestionSwapped(true);
    const otherQuestions = allQuestions.filter(
      (q, i) => i !== currentQuestionIndex
    );
    const randomQ =
      otherQuestions[Math.floor(Math.random() * otherQuestions.length)];
    const originalQuestion = currentQuestion;
    setDisplayText(randomQ.question);
    setTimeout(() => {
      setIsQuestionSwapped(false);
      setDisplayText(originalQuestion.question);
    }, 4000);
    return 4000;
  };

  const applyAnswerShuffle = () => {
    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
      // Shuffle the options in place
      currentQuestion.options.sort(() => 0.5 - Math.random());
      shuffleCount++;
      if (shuffleCount > 4) {
        clearInterval(shuffleInterval);
      }
    }, 1000);
    return 5000;
  };

  const applyReverseControls = () => {
    setAreControlsReversed(true);
    const duration = 6000;
    setTimeout(() => setAreControlsReversed(false), duration);
    return duration;
  };

  const applyPhantomClick = () => {
    // Randomly select an answer after a short delay
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      if (!selectedAnswer && !isScreenBlackout && !isInputLocked) {
        const options = areControlsReversed
          ? [...currentQuestion.options].reverse()
          : currentQuestion.options;
        const randomOption =
          options[Math.floor(Math.random() * options.length)];
        handleAnswerSelection(randomOption);
      }
    }, delay);
    return delay + 500;
  };

  const applyScreenFlip = () => {
    setIsScreenFlipped(true);
    const duration = 5000;
    setTimeout(() => setIsScreenFlipped(false), duration);
    return duration;
  };

  const applyInputLock = () => {
    setIsInputLocked(true);
    const duration = 4000 + Math.floor(Math.random() * 2000);
    setTimeout(() => setIsInputLocked(false), duration);
    return duration;
  };

  const applyFakeProgress = () => {
    setIsFakeProgress(true);
    let fake = 0;
    const fakeInterval = setInterval(() => {
      fake = Math.floor(Math.random() * 100);
      setFakeProgress(fake);
    }, 400);
    const duration = 4000 + Math.floor(Math.random() * 2000);
    setTimeout(() => {
      clearInterval(fakeInterval);
      setIsFakeProgress(false);
    }, duration);
    return duration;
  };

  const applyFontCorruption = () => {
    setIsFontCorrupted(true);
    const duration = 5000;
    setTimeout(() => setIsFontCorrupted(false), duration);
    return duration;
  };

  const applyColorInversion = () => {
    setIsColorInverted(true);
    const duration = 4000;
    setTimeout(() => setIsColorInverted(false), duration);
    return duration;
  };

  const applyAnswerDisappear = () => {
    setAreAnswersHidden(true);
    const duration = 3000;
    setTimeout(() => setAreAnswersHidden(false), duration);
    return duration;
  };

  const scrambleText = (text) => {
    if (!areAnswersGlitched || !text) return text;
    const glitchChars = "!@#$%^&*<>{}[]\\|";
    return text
      .split("")
      .map((c) =>
        c === " " || /[.,?]/.test(c)
          ? c
          : Math.random() < 0.3
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : c
      )
      .join("");
  };

  const handleDelayedClick = (callback, option) => {
    if (!callback || selectedAnswer !== null) return;
    if (isInputDelayed) {
      setTimeout(() => callback(option), Math.random() * 300 + 100);
    } else {
      callback(option);
    }
  };

  useEffect(() => {
    if (!currentQuestion) return;
    setDisplayText("");
    setIsTyping(true);
    const text = currentQuestion.question;
    let index = 0;
    let typingInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 20);
    return () => clearInterval(typingInterval);
  }, [currentQuestion]);

  function getRandomBlackoutMessage() {
    const messages = [
      "SIGNAL LOST...",
      "CONNECTION INTERRUPTED",
      "SYSTEM FAILURE",
      "NO INPUT DETECTED",
      "RECONNECTING...",
      "CRITICAL ERROR",
      "NETWORK JAMMED",
      "TERMINAL UNRESPONSIVE",
      "BLACKOUT IN PROGRESS",
      "PLEASE WAIT...",
      "HAHAHAHAHAHAHAHAHHAHAHAHHAHAHAHAHAHAHAHAHAHAHAHA",
      "SYSTEM MALFUNCTION",
      "ERROR 404: QUESTION NOT FOUND",
      "HACKER IN DISTRESS",
      "TERMINAL IS BLACKED OUT",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (!currentQuestion) {
    return (
      <div className="text-center text-lime-400">Loading questions...</div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div
        className={`min-h-screen bg-black text-lime-400 flex flex-col px-4 font-reno ${
          flashRed ? "bg-red-900" : ""
        } ${isScreenBlackout ? "relative" : ""} ${
          isScreenFlipped ? "glitch-flip" : ""
        } ${isFontCorrupted ? "glitch-font" : ""} ${
          isColorInverted ? "glitch-invert" : ""
        }`}
        style={
          isInputLocked ? { pointerEvents: "none", filter: "grayscale(1)" } : {}
        }
      >
        {/* Blackout Overlay with typewriter effect */}
        {isScreenBlackout && (
          <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center pointer-events-auto">
            <h2 className="text-lime-400 font-monoska text-2xl">
              <span
                className="whitespace-pre overflow-hidden border-r-4 border-lime-400"
                style={{ display: "inline-block", maxWidth: "100%" }}
              >
                {blackoutDisplayText}
                {isBlackoutTyping && (
                  <span className="border-r-4 border-lime-400 animate-cursor ml-1">
                    &nbsp;
                  </span>
                )}
              </span>
            </h2>
          </div>
        )}
        {/* Input Lock Overlay */}
        {isInputLocked && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-[99999] flex items-center justify-center">
            <h2 className="text-4xl text-red-500 font-monoska animate-pulse">
              SYSTEM LOCKED
            </h2>
          </div>
        )}
        {/* Progress Bar with Milestones */}
        <div className="w-full bg-black h-7 mt-2 border border-lime-400 relative">
          <div
            className={`bg-lime-600 h-full animate-pulseSlow shadow-[0_0_10px_#00ff00] transition-all duration-500 ${
              isFakeProgress ? "glitch-fake-progress" : ""
            }`}
            style={{
              width: isFakeProgress
                ? `${fakeProgress}%`
                : `${progressPercent}%`,
            }}
          />
          {/* Milestone markers */}
          {milestones.map((m) => (
            <div
              key={m}
              className="absolute top-0 left-0 h-full"
              style={{ left: `${m}%` }}
            >
              <div className="w-1 h-full bg-yellow-400 opacity-60" />
            </div>
          ))}
        </div>
        {/* Milestone message */}
        {milestoneMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-black border-2 border-yellow-400 px-6 py-2 rounded-lg text-yellow-400 font-monoska text-lg shadow-lg animate-pulse">
            {milestoneMsg}
          </div>
        )}
        {/* Scanline animation */}
        <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-40 opacity-10 bg-[repeating-linear-gradient(180deg,transparent,transparent_2px,rgba(0,255,0,0.05)_3px)] animate-scanline" />

        {/* Glitching header with timer and circular timer side by side */}
        <div
          className={`flex justify-between items-center p-4 border-b-2 border-lime-400 ${
            areUIElementsFlickering ? "animate-pulse" : ""
          }`}
        >
          <div
            className="text-2xl font-monoska"
            animate={areUIElementsFlickering ? { x: [-2, 2, -2, 0] } : {}}
            transition={{
              duration: 0.3,
              repeat: areUIElementsFlickering ? Infinity : 0,
            }}
          >
            <span className="text-xl mr-2">HACKER:</span>
            <span className="text-lime-300 font-monoska">{playerName}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Circular Timer */}
            <svg width="40" height="40" className="-rotate-90">
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="#222"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke={
                  timeLeft < 5
                    ? "#ff0000"
                    : timeLeft < 10
                    ? "#ffae00"
                    : "#00ff00"
                }
                strokeWidth="4"
                fill="none"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - timeLeft / 30)}
                style={{ transition: "stroke-dashoffset 0.5s, stroke 0.5s" }}
              />
            </svg>
            {/* Text Timer */}
            <div
              className="text-3xl font-reno"
              animate={areUIElementsFlickering ? { x: [-2, 2, -2, 0] } : {}}
              transition={{
                duration: 0.3,
                repeat: areUIElementsFlickering ? Infinity : 0,
              }}
            >
              <span className="text-xl mr-2">TIME:</span>
              <span
                className={`${
                  timeLeft < 5 || isTimerTampered
                    ? "text-red-500"
                    : "text-lime-300"
                } ${isTimerTampered ? "animate-pulse" : ""}`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
          <div
            className="text-3xl font-reno"
            animate={isGlitchActive ? { x: [-2, 2, -2, 0] } : {}}
            transition={{
              duration: 0.3,
              repeat: isGlitchActive ? Infinity : 0,
            }}
          >
            <span className="text-xl mr-2">POINTS:</span>
            <span className="text-lime-300">{points}</span>
          </div>
          <div className="flex items-center ml-4">
            <span className="text-xl mr-2 font-monoska">HEALTH:</span>
            <div className="w-48 bg-black h-6 border border-lime-400">
              <div
                className="bg-lime-600 h-full transition-all duration-500"
                style={{ width: `${health}%` }}
              />
            </div>
            <span className="ml-2 text-xl font-reno">{health}%</span>
          </div>
        </div>
        <div className="text-right text-sm text-lime-300 mt-1">
          Breaching Progress: {Math.round((correctAnswers / allQuestions.length) * 100)}%
        </div>
        {/* Centered Question Box */}
        <div
          className="flex-grow flex items-center justify-center focus:outline-none"
          ref={questionRef}
          tabIndex={-1}
        >
          <div className="p-6 border-2 border-lime-400 min-w-[60vw] max-w-[90vw]">
            {/* Question Swap Glitch */}
            {isQuestionSwapped ? (
              <h2 className="text-2xl font-monoska text-red-400 mb-4">
                {currentQuestion?.question || "???"}
              </h2>
            ) : null}
            <h4 className="text-xl mb-4 font-monoska text-lime-300 uppercase relative group overflow-hidden">
              {currentQuestion.category}
              <span className="absolute top-0 left-0 w-full h-full text-lime-500 blur-sm opacity-0 group-hover:opacity-80 group-hover:animate-glitchTransform">
                {currentQuestion.category}
              </span>
            </h4>

            {/* Render question differently if it's in the "Hard" category and contains code */}
            {currentQuestion.category === "Hard" &&
            currentQuestion.question.includes("```js") ? (
              <div className="mb-6">
                <p className="text-2xl font-monoska mb-4">
                  {areAnswersGlitched
                    ? scrambleText(
                        currentQuestion.question.split("```js")[0].trim()
                      )
                    : currentQuestion.question.split("```js")[0].trim()}
                </p>
                <SyntaxHighlighter
                  language="javascript"
                  style={{
                    'pre[class*="language-"]': {
                      background: "#000000", // AMOLED black background
                      color: "#00ff00", // Bright lime text
                      fontFamily: 'Reno, "Courier New", monospace', // IDE-like font
                      fontSize: "1rem", // Standard font size
                      lineHeight: "1.5", // Standard line spacing
                      padding: "1em", // Standard padding
                      borderRadius: "0.3em", // Slightly rounded corners
                      overflowX: "auto", // Horizontal scrolling for long lines
                      boxShadow: "none", // Remove any box shadow
                      border: "none", // Remove any border
                    },
                    'code[class*="language-"]': {
                      background: "transparent", // Transparent background for inline code
                      color: "#00ff00", // Bright lime text
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: "1rem",
                      lineHeight: "1.5",
                    },
                  }}
                  customStyle={{
                    padding: "1em", // Ensure sufficient padding
                    lineHeight: "1.5", // Ensure proper line spacing
                    fontSize: "1rem", // Standard font size
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace', // IDE-like font
                    backgroundColor: "#000000", // AMOLED black background
                    color: "#00ff00", // Bright lime text
                    borderRadius: "0.3em", // Slightly rounded corners
                    overflowX: "auto", // Horizontal scrolling for long lines
                    boxShadow: "none", // Remove any box shadow
                    border: "none", // Remove any border
                  }}
                >
                  {currentQuestion.question
                    .split("```js")[1]
                    .split("``` ")[0]
                    .trim()}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-monoska text-lime-400">
                  {areAnswersGlitched ? scrambleText(displayText) : displayText}
                  {isTyping && (
                    <span className="border-r-4 border-lime-400 animate-cursor ml-1">
                      &nbsp;
                    </span>
                  )}
                </h2>
              </div>
            )}
            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              {!areAnswersHidden &&
                (areControlsReversed
                  ? [...currentQuestion.options].reverse()
                  : currentQuestion.options
                ).map((option, index) => (
                  <motion.button
                    key={index}
                    className={`p-4 border border-lime-400 text-left hover:bg-lime-900 hover:text-black transition-colors font-reno ${
                      selectedAnswer === option
                        ? isAnswerCorrect
                          ? "bg-green-500 border-4 border-lime-300 animate-answerCorrect"
                          : "bg-red-500 animate-pulse"
                        : ""
                    } ${
                      areUIElementsFlickering ? "animate-glitchTransform" : ""
                    }`}
                    whileHover={{
                      scale: areUIElementsFlickering
                        ? Math.random() > 0.5
                          ? 1.02
                          : 0.98
                        : 1.01,
                    }}
                    onClick={() =>
                      handleDelayedClick(handleAnswerSelection, option)
                    }
                    disabled={
                      selectedAnswer !== null ||
                      isScreenBlackout ||
                      isInputLocked
                    }
                    style={
                      areUIElementsFlickering
                        ? {
                            transform: `translate(${Math.random() * 4 - 2}px, ${
                              Math.random() * 4 - 2
                            }px)`,
                          }
                        : {}
                    }
                  >
                    {areAnswersGlitched ? scrambleText(option) : option}
                  </motion.button>
                ))}
            </div>
          </div>
        </div>
        {/* Glitch History Log - moved to bottom right */}
        <div className="fixed bottom-4 right-4 z-[9999] text-right">
          <button
            onClick={() => setShowGlitchLog((v) => !v)}
            className="bg-black border border-lime-400 px-2 py-1 rounded text-lime-400 text-xs mb-1"
          >
            {showGlitchLog ? "Hide" : "Show"} Glitch Log
          </button>
          {showGlitchLog && (
            <div className="bg-black border border-lime-400 rounded p-2 w-56 max-h-48 overflow-y-auto text-xs font-monoska text-lime-300">
              <div className="mb-1 font-bold text-lime-400">
                Recent Glitches
              </div>
              {glitchHistory.length === 0 && (
                <div className="text-gray-500">No glitches yet.</div>
              )}
              {glitchHistory.map((g, i) => (
                <div key={i} className="mb-1">
                  [{g.time}] {g.name.replace(/([A-Z])/g, " $1").toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Visual feedback for disabled inputs (blur/lock) */}
        {isInputLocked && (
          <div className="fixed inset-0 z-[99998] bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
            <span className="text-6xl text-lime-400 font-monoska">
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="5" y="11" width="14" height="8" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </>
  );
}
