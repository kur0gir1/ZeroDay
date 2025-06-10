import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { usePlayer } from "../context/playerContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function GameComplete() {
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
    await supabase.from("leaderboard").insert([
      {
        player_name: playerName,
        points,
        total_time: totalTime,
      },
    ]);
  }

  return (
    <div className="min-h-screen bg-black text-lime-400 flex flex-col items-center justify-center font-reno">
      <div className="bg-black border-2 border-lime-400 rounded-lg p-8 shadow-xl max-w-lg w-full">
        <h1 className="text-4xl font-monoska text-lime-300 mb-4 text-center">
          MISSION COMPLETE
        </h1>
        <div className="mb-4 text-center">
          Congratulations,{" "}
          <span className="text-lime-300 font-bold">{playerName}</span>!
        </div>
        <div className="mb-2">
          Final Score: <span className="text-lime-300 font-bold">{points}</span>
        </div>
        <div className="mb-2">
          Total Time: <span className="text-lime-300 font-bold">{totalTime}s</span>
        </div>
        <div className="mb-2">
          Health Remaining:{" "}
          <span className="text-lime-300 font-bold">{health}%</span>
        </div>
        <div className="mb-2">
          Questions Answered:{" "}
          <span className="text-lime-300 font-bold">
            {correctAnswers} / {totalQuestions}
          </span>
        </div>
        <div className="mb-2">
          Glitches Survived:{" "}
          <span className="text-lime-300 font-bold">{glitchesSurvived}</span>
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
            <span className="text-red-400">
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
                const first = glitchHistory.find((g) => g.name === glitchName);
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
          <div className="font-bold text-lime-400 mb-1">Glitches Survived</div>
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
                    ? "bg-lime-400 text-black border-lime-400"
                    : "bg-gray-800 text-gray-500 border-gray-700"
                }`}
              >
                {glitch.replace(/([A-Z])/g, " $1").toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={async() => {
              await saveScore();
              resetPlayer();
              navigate("/");
            }}
            className="bg-lime-400 text-black px-6 py-2 rounded font-bold hover:bg-lime-300 transition"
          >
            Breach Again
          </button>
        </div>
      </div>
    </div>
  );
}
