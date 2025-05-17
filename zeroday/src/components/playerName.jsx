import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer} from "../context/playerContext";

export default function PlayerName() {
  const [name, setName] = useState("");
  const { setPlayerName} = usePlayer();
  const navigate = useNavigate();


  const handleStart = () => {
    if (name.trim() === "") {
      alert("Name can't be empty");
      return;
    }
    setPlayerName(name.trim());
    navigate("/game");
  };

  return (
    <div className="bg-black min-h-screen text-lime-400 font-reno flex flex-col items-center px-6 py-10">

      {/* Go Back Button */}
      <div className="self-start mb-6">
        <button
          onClick={() => navigate("/rules")}
          className="border border-lime-400 rounded px-6 py-2 bg-black text-lime-400 text-sm font-monoska hover:bg-lime-600 hover:text-black transition-colors duration-300"
        >
          ← Go Back
        </button>
      </div>

      {/* Player Container */}
      <div className="w-full max-w-4xl border border-lime-400 rounded-lg p-8 shadow-lg mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-monoska mb-6 glitch text-center">
          ZeroDay Protocol
        </h1>
        <p className="mt-2 mb-6 text-center text-lime-400">
          Before you start breaching the system, put your name first so that we
          know who to blame.
        </p>

        <div className="form-group">
          <label
            htmlFor="name"
            className="block mb-2 font-semibold text-lime-400"
          >
            Person who tried to breach our system:
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 px-4 py-2 w-full text-lime-400 bg-black rounded mb-4 border border-lime-400 outline-none focus:ring-2 focus:ring-lime-600 transition duration-300 text-center"
            autoFocus
            aria-label="Player name input"
          />
        </div>

        {/* Proceed Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className={`border border-lime-400 rounded px-8 py-3 text-lg font-monoska transition-colors duration-300
        ${
          name.trim()
            ? "hover:bg-lime-600 hover:text-black cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
          >
            Start Breach
          </button>
        </div>
      </div>
    </div>
  );
}
