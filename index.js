const express = require("express");
const { transcribe } = require("./modules/transcribe");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Voice to Text API is running.");
});

// GET route
app.get("/api/transcribe", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).json({ success: false, message: "No URL provided" });

  try {
    const text = await transcribe(url);
    res.json({ success: true, transcription: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Transcription failed", error: err.message });
  }
});

// POST route
app.post("/api/transcribe", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ success: false, message: "No URL provided" });

  try {
    const text = await transcribe(url);
    res.json({ success: true, transcription: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Transcription failed", error: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ API running on http://localhost:3000");
});
