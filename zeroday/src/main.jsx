import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlayerProvider } from './context/playerContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </StrictMode>
)
