import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { usePlayer } from "../context/playerContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function GameOver() {
  const context = usePlayer();
  const {
    playerName,
    points,
    health,
    glitchHistory = [],
    correctAnswers = 0,
    allQuestions = [],
    totalTime,
  } = context || {};
  const { resetPlayer } = usePlayer();
  const totalQuestions = allQuestions.length || 1;
  // Glitches survived should be the number of unique glitch types encountered
  const uniqueGlitches = Array.from(new Set(glitchHistory.map((g) => g.name)));
  const glitchesSurvived = uniqueGlitches.length;
  // Remove progress bar and percent logic
  const milestones = [25, 50, 75, 100];
  // Calculate milestones based on correctAnswers
  const progressPercent = (correctAnswers / totalQuestions) * 100;
  const reachedMilestones = milestones.filter((m) => progressPercent >= m);
  // Find the hardest question answered (from allQuestions, up to correctAnswers)
  const answeredQuestions = allQuestions.slice(0, correctAnswers);
  const hardest = answeredQuestions.find((q) => q.category === "Hard");
  const navigate = useNavigate();

  async function saveScore() {
    const { data, error } =
    await supabase.from("leaderboard").insert([
      {
        player_name: playerName,
        points,
        total_time: totalTime,
      },
    ]);
    if (error) {
    console.error("Supabase insert error:", error.message, error);
    alert("Failed to save score: " + error.message);
  }
    if (data) {
      console.log("Score saved successfully:", data);
    }
  }

  return (
    <>
      <div className="bg-black min-h-screen text-lime-400 font-reno flex flex-col justify-center items-center px-6 py-10">
        {/* Game Over Container */}
        <div className="w-full max-w-4xl border border-lime-400 rounded-lg p-8 shadow-lg flex flex-col justify-center items-center text-center">
          <img
            src="/gameOver.png"
            alt="GameOver"
            className="w-[150px] mb-6 glitch"
          />
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-monoska mb-6 glitch"
          >
            Breach Failed
          </motion.h1>

          {/* Message */}
          <p className="text-lg mb-4">
            Looks like we got you,{" "}
            <span className="text-lime-300 font-reno">{playerName}</span>!
          </p>
          <p>Better luck next time!</p>

          {/* Summary Box */}
          <div className="bg-black border-2 border-red-500 rounded-lg p-8 shadow-xl max-w-lg w-full mt-6">
            <h2 className="text-2xl font-monoska text-red-400 mb-4 text-center">
              GAME OVER SUMMARY
            </h2>
            <div className="mb-2 text-center">
              Player:{" "}
              <span className="text-red-300 font-bold">{playerName}</span>
            </div>
            <div className="mb-2">
              Final Score:{" "}
              <span className="text-red-300 font-bold">{points}</span>
            </div>
            <div className="mb-2">
              Total Time:{" "}
              <span className="text-lime-300 font-bold">{totalTime}s</span>
            </div>
            <div className="mb-2">
              Health Remaining:{" "}
              <span className="text-red-300 font-bold">{health}%</span>
            </div>
            <div className="mb-2">
              Questions Answered:{" "}
              <span className="text-red-300 font-bold">
                {correctAnswers} / {totalQuestions}
              </span>
            </div>
            <div className="mb-2">
              Glitches Survived:{" "}
              <span className="text-red-300 font-bold">{glitchesSurvived}</span>
            </div>
            <div className="mb-2">
              Milestones Reached:{" "}
              <span className="text-yellow-400 font-bold">
                {reachedMilestones.join(", ") || "None"}
              </span>
            </div>
            {hardest && (
              <div className="mb-2">
                Hardest Question:{" "}
                <span className="text-yellow-400">
                  {hardest.question.slice(0, 60)}...
                </span>
              </div>
            )}
            {/* Glitch History Log */}
            <div className="mt-4 mb-2">
              <div className="font-bold text-red-400 mb-1">Glitch History</div>
              <ul className="text-xs max-h-32 overflow-y-auto border border-red-700 rounded p-2 bg-black/60">
                {uniqueGlitches.length === 0 ? (
                  <li className="text-gray-500">No glitches occurred.</li>
                ) : (
                  uniqueGlitches.map((glitchName, i) => {
                    const first = glitchHistory.find(
                      (g) => g.name === glitchName
                    );
                    return (
                      <li key={i} className="mb-1">
                        [{first.time}]{" "}
                        {glitchName.replace(/([A-Z])/g, " $1").toUpperCase()}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            {/* Glitch Survival Indicator */}
            <div className="mb-2">
              <div className="font-bold text-red-400 mb-1">
                Glitches Survived
              </div>
              <div className="flex flex-wrap gap-2">
                {[
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
                ].map((glitch) => (
                  <span
                    key={glitch}
                    className={`px-2 py-1 rounded text-xs font-monoska border ${
                      glitchHistory.some((g) => g.name === glitch)
                        ? "bg-red-400 text-black border-red-400"
                        : "bg-gray-800 text-gray-500 border-gray-700"
                    }`}
                  >
                    {glitch.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Retry Button */}
          <div className="mt-10">
            <button
              onClick={async () => {
                await saveScore();
                resetPlayer();
                navigate("/");
              }}
              className="border border-lime-400 rounded px-8 py-3 text-lg font-monoska hover:bg-lime-600 hover:text-black transition-colors duration-300"
            >
              Retry Breach
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
