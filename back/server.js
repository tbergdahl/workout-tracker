// App
const express = require("express");
const cors = require("cors");


// For file saving/loading
const fs = require("fs")
const path = require("path");

// Init
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Path to my mock database file (using JSON)
const filePath = path.join(__dirname, "mock-db.json");

// Load workouts from the mock DB 
function loadWorkouts() {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading workouts.json:", err);
    return [];
  }
}

// Save workouts to the mock DB
function saveWorkouts(workouts) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(workouts, null, 2));
  } catch (err) {
    console.error("Error writing workouts.json:", err);
  }
}


let workouts = [
  { id: 1, name: "Push-ups", reps: 20 },
  { id: 2, name: "Pull-ups", reps: 10 },
  { id: 3, name: "Squats", reps: 30 }
];

// GET, POST, DELETE routes

app.get("/api/workouts", (req, res) => {
  const workouts = loadWorkouts();
  res.json(workouts);
});

// POST a new workout
app.post("/api/workouts", (req, res) => {
  const workouts = loadWorkouts();
  const newWorkout = {
    id: workouts.length > 0 ? workouts[workouts.length - 1].id + 1 : 1,
    name: req.body.name,
    reps: req.body.reps || 10
  };
  workouts.push(newWorkout);
  saveWorkouts(workouts);
  res.status(201).json(newWorkout);
});

// DELETE a workout
app.delete("/api/workouts/:id", (req, res) => {
  let workouts = loadWorkouts();
  const id = parseInt(req.params.id);
  const workout = workouts.find(w => w.id === id);
  if (!workout) return res.status(404).json({ error: "Workout not found" });
  workouts = workouts.filter(w => w.id !== id);
  saveWorkouts(workouts);
  res.json(workout);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
