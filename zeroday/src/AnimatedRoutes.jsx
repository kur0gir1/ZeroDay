import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./pages/landingPage";
import RulesPage from "./pages/rulesPage";
import PlayerNamePage from "./pages/playerNamePage";

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
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;