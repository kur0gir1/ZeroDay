import { useNavigate } from "react-router-dom";

export default function Landing(){
  const navigate = useNavigate();
  return(
    <>
      <div className="bg-black text-lime-400 min-h-screen w-full flex flex-col justify-center items-center px-4">

        {/* Header */}
        <h1 className="text-6xl font-monoska glitch select-none mb-4">
          ZeroDay
        </h1>

        {/* Tagline */}
        <p className="text-xl font-reno text-lime-300 mb-12 max-w-xl text-center">
          Decrypt the truth before time runs out.
        </p>

        {/* Start Button */}
        <button
          onClick ={()=> navigate("/rules")}
          className ="border border-lime-400 rounded px-8 py-3 text-lg font-monoska hover:bg-lime-600 hover:text-black transition-colors duration-300" 
        >
          Start Breach
        </button>

        {/* Footer */}
        <footer className="text-xs text-lime-700 mt-16 select-none">
          ZeroDay &mdash; v0.01 &mdash; Cyber Ops Initiated
        </footer>
      </div>
    </>
  ); 
}