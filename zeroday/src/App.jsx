import AnimatedRoutes from "./AnimatedRoutes";
import GlitchOverlay from "./components/glitchOverlay";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";


export default function App() {
  return (
    <>
      <GlitchOverlay />
      <Router>
        <AnimatedRoutes />
      </Router>
    </>
  );
}
