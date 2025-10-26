import React, { useState, useEffect } from "react";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch workouts on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/workouts")
      .then(res => res.json())
      .then(data => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching workouts:", err);
        setLoading(false);
      });
  }, []);

  // Add a workout
  const addWorkout = () => {
    if (!newWorkout) return;

    fetch("http://localhost:5000/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newWorkout, reps: 10 })
    })
      .then(res => res.json())
      .then(data => {
        setWorkouts(prev => [...prev, data]);
        setNewWorkout("");
      })
      .catch(err => console.error("Error adding workout:", err));
  };

  // Delete a workout
  const deleteWorkout = id => {
    fetch(`http://localhost:5000/api/workouts/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(deleted => {
        setWorkouts(prev => prev.filter(w => w.id !== deleted.id));
      })
      .catch(err => console.error("Error deleting workout:", err));
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading workouts...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Workout Tracker</h1>

      {/* Workout list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {workouts.map(w => (
          <li
            key={w.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 15px",
              margin: "8px 0",
              backgroundColor: "#f7f7f7",
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <span style={{ fontWeight: "bold" }}>{w.name} — {w.reps} reps</span>
            <button
              onClick={() => deleteWorkout(w.id)}
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add new workout */}
      <div style={{ display: "flex", marginTop: "20px" }}>
        <input
          type="text"
          value={newWorkout}
          placeholder="New workout"
          onChange={e => setNewWorkout(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginRight: "10px",
            fontSize: "16px"
          }}
        />
        <button
          onClick={addWorkout}
          style={{
            backgroundColor: "#2ecc71",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default App;
