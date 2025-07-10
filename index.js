const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Ensure models directory exists
const modelsDir = path.join(__dirname, "models");
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

// Model file path
const modelPath = path.join(modelsDir, "ggml-base.en.bin");

// Function to download model if missing
async function downloadModel() {
  if (!fs.existsSync(modelPath)) {
    console.log("Model not found. Downloading...");

    const url = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin";
    const writer = fs.createWriteStream(modelPath);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log("Model downloaded successfully.");
        resolve();
      });
      writer.on("error", reject);
    });
  } else {
    console.log("Model already exists.");
  }
}

// API route
app.get("/api/transcribe", async (req, res) => {
  const audioUrl = req.query.url;
  if (!audioUrl) {
    return res.status(400).send("Missing ?url= parameter");
  }

  // Download model if needed
  await downloadModel();

  const outputFile = "audio.mp3";

  // Download audio file
  exec(`curl -L "${audioUrl}" -o ${outputFile}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Download error:", err);
      console.error("STDERR:", stderr);
      return res.status(500).send("Failed to download audio.");
    }

    // Transcribe audio using whisper binary
    exec(`./whisper ${outputFile} --model models/ggml-base.en.bin`, (err, stdout, stderr) => {
      if (err) {
        console.error("Transcription error:", err);
        console.error("STDERR:", stderr);
        return res.status(500).send("Failed to transcribe audio.");
      }

      res.send(stdout);
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
    
