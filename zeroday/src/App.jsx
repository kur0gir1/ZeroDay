import { useLocation } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";
import GlitchOverlay from "./components/glitchOverlay";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";

function AppContent() {
  const location = useLocation();
  const isGameRoute = location.pathname === "/game";

  useEffect(() => {
    if (isGameRoute) {
      document.body.classList.add("glitch-cursor");
    } else {
      document.body.classList.remove("glitch-cursor");
    }
    return () => {
      document.body.classList.remove("glitch-cursor");
    };
  }, [isGameRoute]);

  return (
    <>
      {!isGameRoute && <GlitchOverlay />}
      <AnimatedRoutes />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}