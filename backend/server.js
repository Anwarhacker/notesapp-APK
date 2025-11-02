const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://10.0.2.2:8081",
      "http://10.11.159.55:8081",
      "http://192.168.56.1:8081",
      "exp://localhost:8081",
      "exp://10.0.2.2:8081",
      "exp://10.11.159.55:8081",
      "exp://192.168.56.1:8081",
      "https://your-frontend-domain.vercel.app", // ✅ add your Expo web build domain later
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to MongoDB using .env value
connectDB();

// ✅ Default route (prevents 404 on root)
app.get("/", (req, res) => {
  res.send("🚀 Notes Backend is running successfully on Vercel!");
});

// Schema
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

// Routes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/notes", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = req.body.title;
    note.content = req.body.content;
    note.updatedAt = Date.now();

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/api/notes/:id/favorite", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.favorite = !note.favorite;
    note.updatedAt = Date.now();

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ For Vercel (don't use app.listen)
module.exports = app;
