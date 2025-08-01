// backend/index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory "database"
const players = [];
const events = [
  {
    id: 1,
    question: "Engine vibration during taxi. What do you do?",
    options: ["Return to gate", "Continue taxi", "Shutdown engine", "Request tow"],
    scores: [-10, -30, +20, +10],
  }
];
const responses = [];
const leaderboards = {};

// Register player
app.post("/register", (req, res) => {
  const { name, surname, base } = req.body;
  const id = players.length + 1;
  const player = { id, name, surname, base };
  players.push(player);
  res.json(player);
});

// Get current event
app.get("/event/:base", (req, res) => {
  res.json(events[events.length - 1]); // send latest event
});

// Submit response
app.post("/response", (req, res) => {
  const { playerId, eventId, selectedIndex } = req.body;
  const event = events.find(e => e.id === eventId);
  const score = event.scores[selectedIndex];

  responses.push({ playerId, eventId, selectedIndex, score });

  const player = players.find(p => p.id === playerId);
  if (!leaderboards[player.base]) leaderboards[player.base] = {};
  if (!leaderboards[player.base][playerId]) {
    leaderboards[player.base][playerId] = {
      name: player.name + " " + player.surname,
      total: 0
    };
  }

  leaderboards[player.base][playerId].total += score;

  res.json({ score });
});

// Get scoreboard
app.get("/scoreboard/:base", (req, res) => {
  const board = leaderboards[req.params.base] || {};
  const sorted = Object.entries(board)
    .map(([id, val]) => val)
    .sort((a, b) => b.total - a.total);
  res.json(sorted);
});

// Reset scoreboard
app.post("/admin/:base/reset", (req, res) => {
  leaderboards[req.params.base] = {};
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
