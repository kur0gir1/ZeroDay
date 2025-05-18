import React, { useState, useEffect, useRef } from "react";
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

export default function Game() {
  const navigate = useNavigate();
  const { playerName } = usePlayer() || "HackerMans";

  const [timeLeft, setTimeLeft] = useState(20);
  const [points, setPoints] = useState(0);
  const [health, setHealth] = useState(100);
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [hasTimedOut, setHasTimedOut] = useState(false); // Prevent multiple health deductions
  const [allQuestions, setAllQuestions] = useState([]); // Store filtered questions
  const [flashRed, setFlashRed] = useState(false); // Flash screen red on mistake
  const timeRef = useRef(null);
  const questionRef = useRef(null); // For auto-focus on questions

  useEffect(() => {
    // Shuffle and filter questions only once during initialization
    const generalQuestions = new GeneralQuestions()
      .getAllQuestions({ shuffle: true })
      .slice(0, 5);
    const easyQuestionsSet = new EasyQuestions()
      .getAllQuestions({ shuffle: true })
      .slice(0, 5);
    const moderateQuestionsSet = new ModerateQuestions()
      .getAllQuestions({ shuffle: true })
      .slice(0, 3);
    const hardQuestionsSet = new HardQuestions()
      .getAllQuestions({ shuffle: true })
      .slice(0, 3);

    setAllQuestions([
      ...generalQuestions,
      ...easyQuestionsSet,
      ...moderateQuestionsSet,
      ...hardQuestionsSet,
    ]);
  }, []); // Empty dependency array ensures this runs only once

  const currentQuestion = allQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion) return; // Wait until questions are loaded

    // Auto-focus on the question container
    questionRef.current?.focus();

    // Clear any previous intervals before starting a new one
    clearInterval(timeRef.current);
    timeRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timeRef.current);
  }, [currentQuestionIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0 && !hasTimedOut) {
      setHasTimedOut(true); // Prevent multiple triggers
      handleWrongAnswer(true); // Pass a flag to indicate timeout
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, hasTimedOut]);

  useEffect(() => {
    // Check health after it updates
    if (health === 0) {
      navigate("/game-over");
    }
  }, [health, navigate]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300); // Smoother glitch effect
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.options[currentQuestion.answer]) {
      setIsAnswerCorrect(true);
      setPoints((prev) => prev + (currentQuestion.points || 1)); // Award points
    } else {
      setIsAnswerCorrect(false);
      handleWrongAnswer();
    }
    setTimeout(() => goToNextQuestion(), 1000); // Move to the next question after a delay
  };

  const handleWrongAnswer = (isTimeout = false) => {
    setHealth((prev) => Math.max(0, prev - 20)); // Deduct health
    setFlashRed(true); // Trigger red screen flash
    setTimeout(() => setFlashRed(false), 500); // Remove flash after 500ms

    if (isTimeout) {
      setTimeout(() => goToNextQuestion(), 1000); // Move to the next question after a delay
    }
  };

  const goToNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setTimeLeft(20); // Reset timer
    setHasTimedOut(false); // Reset timeout logic
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      navigate("/game-complete"); // Navigate to game-complete page if all questions are answered
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center text-lime-400">Loading questions...</div>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen bg-black text-lime-400 flex flex-col px-4 font-reno ${
          flashRed ? "bg-red-900" : ""
        }`} // Flash red background on mistake
      >
        {/* Player Info Bar at Top */}
        <div
          className={`flex justify-between items-center p-4 border-b-2 border-lime-400 ${
            isGlitching ? "animate-pulse" : ""
          }`}
        >
          {/* Hacker Name */}
          <motion.div
            className="text-2xl font-monoska"
            animate={isGlitching ? { x: [-2, 2, -2, 0] } : {}}
            transition={{ duration: 0.3, repeat: isGlitching ? Infinity : 0 }}
          >
            <span className="text-xl mr-2">HACKER:</span>
            <span className="text-lime-300 font-monoska">{playerName}</span>
          </motion.div>

          {/* Timer */}
          <motion.div
            className="text-3xl font-reno"
            animate={isGlitching ? { x: [-2, 2, -2, 0] } : {}}
            transition={{ duration: 0.3, repeat: isGlitching ? Infinity : 0 }}
          >
            <span className="text-xl mr-2">TIME:</span>
            <span className={timeLeft < 5 ? "text-red-500" : "text-lime-300"}>
              {timeLeft}s
            </span>
          </motion.div>

          {/* Points */}
          <motion.div
            className="text-3xl font-reno"
            animate={isGlitching ? { x: [-2, 2, -2, 0] } : {}}
            transition={{ duration: 0.3, repeat: isGlitching ? Infinity : 0 }}
          >
            <span className="text-xl mr-2">POINTS:</span>
            <span className="text-lime-300">{points}</span>
          </motion.div>

          {/* Health */}
          <div className="flex items-center ml-4">
            <span className="text-xl mr-2 font-momoska">HEALTH:</span>
            <div className="w-48 bg-black h-6 border border-lime-400">
              <motion.div
                className="bg-lime-600 h-full"
                initial={{ width: `${health}%` }}
                animate={{ width: `${health}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="ml-2 text-xl font-reno">{health}%</span>
          </div>
        </div>

        {/* Breaching Progress Bar */}
        <div className="w-full bg-black h-7 mt-2 border border-lime-400">
          <motion.div
            className="bg-lime-600 h-full"
            initial={{
              width: `${(currentQuestionIndex / allQuestions.length) * 100}%`,
            }}
            animate={{
              width: `${(currentQuestionIndex / allQuestions.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-right text-sm text-lime-300 mt-1">
          Breaching Progress:{" "}
          {Math.round((currentQuestionIndex / allQuestions.length) * 100)}%
        </div>

        {/* Centered Question Box */}
        <div
          className="flex-grow flex items-center justify-center focus:outline-none"
          ref={questionRef}
          tabIndex={-1}
        >
          <div className="p-6 border-2 border-lime-400 min-w-[60vw] max-w-[90vw]">
            <h4 className="text-xl mb-4 font-monoska text-lime-300 uppercase">
              {currentQuestion.category}
            </h4>
            <h2 className="text-2xl mb-6 font-monoska">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`p-4 border border-lime-400 text-left hover:bg-lime-900 hover:text-black transition-colors font-reno ${
                    selectedAnswer === option
                      ? isAnswerCorrect
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500 animate-pulse"
                      : ""
                  }`}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleAnswerSelection(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
