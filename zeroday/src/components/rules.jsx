import { useNavigate } from "react-router-dom";

export default function Rules() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-black min-h-screen text-lime-400 font-reno flex flex-col items-center px-6 py-10">
        {/* Go Back Button */}
        <div className="self-start mb-6">
          <button
            onClick={() => navigate("/")}
            className="border border-lime-400 rounded px-6 py-2 bg-black text-lime-400 text-sm font-monoska hover:bg-lime-600 hover:text-black transition-colors duration-300"
          >
            ← Go Back
          </button>
        </div>

        {/* Rules Container */}
        <div className="w-full max-w-4xl border border-lime-400 rounded-lg p-8 shadow-lg">
          {/* Header */}
          <h1 className="text-4xl font-monoska mb-6 glitch text-center">
            ZeroDay Protocol
          </h1>

          {/* Objective */}
          <section className="mb-6">
            <h2 className="text-2xl font-monoska underline">Objective</h2>
            <p className="mt-2">
              Complete as many challenges as possible under time pressure. Every
              correct answer increases you breaching progress. Every mistake? Critical delay.
            </p>
          </section>

          {/* Rules */}
          <section className="mb-6">
            <h2 className="text-2xl font-monoska underline">Rules</h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>You have a limited time per question (30 seconds).</li>
              <li>No going back once you answer. Think fast.</li>
              <li>Scores are final unless the system crashes (HAHAHAHAHAHAHAHA).</li>
            </ul>
          </section>

          {/* Winning Conditions */}
          <section className="mb-6">
            <h2 className="text-2xl font-monoska underline">
              Winning Conditions
            </h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Get the breaching progress to 100%</li>
              <li>The ZeroDay Protocol will stop you. You are not meant to win.</li>
              <li>Finish without a mistake? daw indi amo haw.</li>
            </ul>
          </section>

          {/* Proceed Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate("/start")}
              className="border border-lime-400 rounded px-8 py-3 text-lg font-monoska hover:bg-lime-600 hover:text-black transition-colors duration-300"
            >
              I Understand. Proceed.
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
