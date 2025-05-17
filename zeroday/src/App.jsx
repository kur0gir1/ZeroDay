import { useState } from 'react'
import LandingPage from './components/landingPage.jsx'
import './App.css'

export default function App(){
  const [started, setStarted] = useState(false);

  const handleStart = () => (
    setStarted(true)
  )

  if(!started){
    return <LandingPage onStart={handleStart}/>
  }

  return(
    <div className="bg-black text-white min-h-screen w-full flex justify-center items-center">
      <h2 className="text-3xl font-monoska">[Quiz Interface Coming Soon]</h2>
    </div>
  );
}