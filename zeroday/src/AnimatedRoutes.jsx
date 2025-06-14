import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./pages/landingPage";
import RulesPage from "./pages/rulesPage";
import PlayerNamePage from "./pages/playerNamePage";
import GamePage from "./pages/gamePage";
import GameOverPage from "./pages/gameOverPage";
import GameCompletePage from "./pages/gameCompletePage";
import Leaderboards from "./pages/leaderboardsPage";

const pageVariants = {
  initial: {
    opacity: 0,
    filter: "blur(8px) contrast(200%) brightness(150%)",
    x: "-10px",
  },
  in: {
    opacity: 1,
    filter: "blur(0px) contrast(100%) brightness(100%)",
    x: "10px",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  out: {
    opacity: 0,
    filter: "blur(6px) contrast(200%) brightness(130%)",
    x: "-10px",
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.2,
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ height: "100%" }}
              >
                <LandingPage />
              </motion.div>
            }
          />
          <Route
            path="/leaderboards"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ height: "100%" }}
              >
                <Leaderboards />
              </motion.div>
            }
          />
          <Route
            path="/rules"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ height: "100%" }}
              >
                <RulesPage />
              </motion.div>
            }
          />
          <Route
            path="/start"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ height: "100%" }}
              >
                <PlayerNamePage />
              </motion.div>
            }
          />
          <Route
            path="/game"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ height: "100%" }}
              >
                <GamePage />
              </motion.div>
            }
          />
          <Route
            path="/gameOver"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ height: "100%" }}
              >
                <GameOverPage />
              </motion.div>
            }
          />
          <Route
            path="/gameComplete"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ height: "100%" }}
              >
                <GameCompletePage />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default AnimatedRoutes;
