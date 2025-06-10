import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const rankIcons = ["🥇", "🥈", "🥉"];

export default function Leaderboards() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("player_name, points, total_time")
        .order("points", { ascending: false })
        .order("total_time", { ascending: true })
        .limit(10);

      if (!error) setScores(data || []);
      setLoading(false);
    }
    fetchScores();
  }, []);

  return (
    <div className="min-h-screen bg-black text-lime-400 flex flex-col items-center py-10 font-reno">
      <div className="self-start mb-6">
        <button
          onClick={() => navigate("/")}
          className="border border-lime-400 rounded px-6 py-2 bg-black text-lime-400 text-sm font-monoska hover:bg-lime-600 hover:text-black transition-colors duration-300"
        >
          ← Go Back
        </button>
      </div>
      <h1 className="text-5xl font-monoska mb-8 tracking-widest glitch">
        Leaderboards
      </h1>
      {loading ? (
        <div className="text-lime-300 font-monoska">Loading...</div>
      ) : (
        <div className="w-full max-w-5xl">
          <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-lime-400 bg-black/80">
            <div className="grid grid-cols-4 bg-lime-900/30 text-lime-300 font-monoska text-lg border-b border-lime-400">
              <div className="py-3 px-4">Rank</div>
              <div className="py-3 px-4">Player</div>
              <div className="py-3 px-4">Points</div>
              <div className="py-3 px-4">Time (s)</div>
            </div>
            {scores.length === 0 ? (
              <div className="text-center py-8 text-lime-700 font-monoska">
                No scores yet.
              </div>
            ) : (
              scores.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-4 items-center font-monoska text-lg border-b border-lime-800 last:border-b-0
                    ${
                      i === 0
                        ? "bg-yellow-900/20 font-bold text-yellow-300 shadow-[0_0_16px_#ffe066]"
                        : ""
                    }
                    ${i === 1 ? "bg-gray-700/20" : ""}
                    ${i === 2 ? "bg-orange-900/20" : ""}
                  `}
                >
                  <div className="py-3 px-4 text-2xl flex items-center">
                    {rankIcons[i] || (
                      <span className="text-lime-400 font-bold">{i + 1}</span>
                    )}
                  </div>
                  <div className="py-3 px-4 max-w-none whitespace-nowrap overflow-x-auto">
                    {row.player_name}
                  </div>
                  <div className="py-3 px-4">{row.points}</div>
                  <div className="py-3 px-4">{row.total_time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
