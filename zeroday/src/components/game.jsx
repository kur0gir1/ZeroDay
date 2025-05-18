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

export default function Game() {
  const navigate = useNavigate();
  const context = usePlayer();
  const playerName = context?.playerName || "HackerMans";

  const [timeLeft, setTimeLeft] = useState(20);
  const [points, setPoints] = useState(0);
  const [health, setHealth] = useState(100);
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [flashRed, setFlashRed] = useState(false);
  const timeRef = useRef(null);
  const questionRef = useRef(null);

  useEffect(() => {
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
  }, []);

  const currentQuestion = allQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion) return;

    // console.log("Correct Answer:", currentQuestion.options[currentQuestion.answer]); // Log the correct answer

    questionRef.current?.focus();
    clearInterval(timeRef.current);
    setTimeLeft(20);
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

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.options[currentQuestion.answer]) {
      setIsAnswerCorrect(true);
      setPoints((prev) => prev + (currentQuestion.points || 1));
      setProgressIndex((prev) => prev + 1); // Increment progress on correct answer
      setTimeout(() => goToNextQuestion(true), 1000);
    } else {
      setIsAnswerCorrect(false);
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = (isTimeout = false) => {
    setHealth((prev) => Math.max(0, prev - 20));
    setFlashRed(true);
    setTimeout(() => setFlashRed(false), 500);

    // Add a hard question dynamically when the player gets a question wrong
    const hardQuestions = new HardQuestions().getAllQuestions({ shuffle: true });
    const newHardQuestion = hardQuestions.find(
      (q) => !allQuestions.some((existing) => existing.id === q.id)
    );

    if (newHardQuestion) {
      setAllQuestions((prev) => [...prev, newHardQuestion]);
    }

    if (!isTimeout) {
      setProgressIndex((prev) => Math.max(0, prev - 1)); // Deduct progress on wrong answer
    }

    setTimeout(() => goToNextQuestion(false), 1000);
  };

  // eslint-disable-next-line no-unused-vars
  const goToNextQuestion = (isCorrect = false) => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setTimeLeft(20);
    setHasTimedOut(false);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); // Always move to the next question
    } else {
      navigate("/gameComplete");
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center text-lime-400">Loading questions...</div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-black text-lime-400 flex flex-col px-4 font-reno ${
        flashRed ? "bg-red-900" : ""
      }`}
    >
      <div
        className={`flex justify-between items-center p-4 border-b-2 border-lime-400 ${
          isGlitching ? "animate-pulse" : ""
        }`}
      >
        <motion.div
          className="text-2xl font-monoska"
          animate={isGlitching ? { x: [-2, 2, -2, 0] } : {}}
          transition={{ duration: 0.3, repeat: isGlitching ? Infinity : 0 }}
        >
          <span className="text-xl mr-2">HACKER:</span>
          <span className="text-lime-300 font-monoska">{playerName}</span>
        </motion.div>
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
        <motion.div
          className="text-3xl font-reno"
          animate={isGlitching ? { x: [-2, 2, -2, 0] } : {}}
          transition={{ duration: 0.3, repeat: isGlitching ? Infinity : 0 }}
        >
          <span className="text-xl mr-2">POINTS:</span>
          <span className="text-lime-300">{points}</span>
        </motion.div>
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
      <div className="w-full bg-black h-7 mt-2 border border-lime-400">
        <motion.div
          className="bg-lime-600 h-full"
          initial={{
            width: `${(progressIndex / allQuestions.length) * 100}%`, // Use progressIndex for progress bar
          }}
          animate={{
            width: `${(progressIndex / allQuestions.length) * 100}%`, // Use progressIndex for progress bar
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-right text-sm text-lime-300 mt-1">
        Breaching Progress:{" "}
        {Math.round((progressIndex / allQuestions.length) * 100)}%
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
          {/* Render question differently if it's in the "Hard" category and contains code */}
          {currentQuestion.category === "Hard" &&
          currentQuestion.question.includes("```js") ? (
            <div className="mb-6">
              <p className="text-2xl font-monoska mb-4">
                {currentQuestion.question.split("```js")[0].trim()}
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
                  .split("```")[0]
                  .trim()}
              </SyntaxHighlighter>
            </div>
          ) : (
            <h2 className="text-2xl mb-6 font-monoska">
              {currentQuestion.question}
            </h2>
          )}
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
  );

}
