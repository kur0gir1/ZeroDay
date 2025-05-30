import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [playerName, setPlayerName] = useState("");
  const [points, setPoints] = useState(0);
  const [health, setHealth] = useState(100);
  const [glitchHistory, setGlitchHistory] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  return (
    <PlayerContext.Provider
      value={{
        playerName,
        setPlayerName,
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
  return useContext(PlayerContext);
}