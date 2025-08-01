import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [base, setBase] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const player = JSON.parse(localStorage.getItem("player"));
    if (!player) return navigate("/");

    setBase(player.base);
    fetch(`${BASE_URL}/scoreboard/${player.base}`)
      .then(res => res.json())
      .then(setScores);
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-easyjet-orange">
        Leaderboard – Base {base}
      </h1>
      <ol className="space-y-3">
        {scores.map((entry, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span className="font-medium">
              {idx + 1}. {entry.name}
            </span>
            <span className="font-bold text-easyjet-orange">{entry.total} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
