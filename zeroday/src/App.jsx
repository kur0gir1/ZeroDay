import { useLocation } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";
import GlitchOverlay from "./components/glitchOverlay";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isGameRoute = location.pathname === "/game";

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