import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [playerName, setPlayerName] = useState("");

  return(
    <PlayerContext.Provider value={{playerName, setPlayerName}}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(){
  return useContext(PlayerContext);
}