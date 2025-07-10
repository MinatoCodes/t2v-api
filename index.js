const express = require("express");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to accept audio/video file upload
app.post("/transcribe", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const inputFilePath = path.resolve(req.file.path);

  try {
    // Run whisper on the uploaded file
    const command = `whisper "${inputFilePath}" --model /app/models/ggml-base.en.bin --language en --output-format txt --output-dir /tmp`;
    execSync(command);

    // whisper outputs a text file with the same base name
    const baseName = path.basename(inputFilePath, path.extname(inputFilePath));
    const transcriptPath = `/tmp/${baseName}.txt`;

    if (!fs.existsSync(transcriptPath))
      return res.status(500).send("Transcription failed");

    const transcript = fs.readFileSync(transcriptPath, "utf-8");

    // Clean up uploaded file and transcript file
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(transcriptPath);

    res.json({ transcript });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).send("Transcription failed");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
  
