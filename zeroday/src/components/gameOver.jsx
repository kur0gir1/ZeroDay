import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { usePlayer } from "../context/playerContext";
import { useNavigate } from "react-router-dom";

export default function GameOver() {
  const context = usePlayer();
  const playerName = context?.playerName || "HackerMans";
  const navigate = useNavigate();

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
            Looks like we got you, <span className="text-lime-300 font-reno">{playerName}</span>!
          </p>
          <p>
            Better luck next time!
          </p>

          {/* Retry Button */}
          <div className="mt-10">
            <button
              onClick={() => navigate("/")}
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