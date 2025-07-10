const express = require("express");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// POST endpoint: file upload transcription
app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  try {
    const transcript = await transcribeFile(req.file.path);
    fs.unlinkSync(req.file.path); // Cleanup uploaded file
    res.json({
      author: "Subin Sirmal",
      transcript
    });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).send("Transcription failed");
  }
});

// GET endpoint: download file from URL and transcribe
app.get("/api/transcribe", async (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) return res.status(400).send("Missing 'url' query parameter");

  const fileName = `downloaded_${Date.now()}`;
  const filePath = path.join("downloads", fileName);

  try {
    // Ensure downloads directory exists
    if (!fs.existsSync("downloads")) fs.mkdirSync("downloads");

    // Download the file
    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Transcribe downloaded file
    const transcript = await transcribeFile(filePath);

    // Cleanup downloaded file
    fs.unlinkSync(filePath);

    res.json({
      author: "MinatoCodes",
      video_url : fileUrl,
      transcript
    });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).send("Transcription failed");
  }
});

// Transcription helper function
async function transcribeFile(filePath) {
  const absPath = path.resolve(filePath);
  const outputDir = "/tmp";
  const baseName = path.basename(absPath, path.extname(absPath));

  const command = `whisper "${absPath}" --model /app/models/ggml-base.en.bin --language en --output-format txt --output-dir ${outputDir}`;
  execSync(command);

  const transcriptPath = path.join(outputDir, `${baseName}.txt`);

  if (!fs.existsSync(transcriptPath)) {
    throw new Error("Transcription failed: output file not found");
  }

  const transcript = fs.readFileSync(transcriptPath, "utf-8");
  fs.unlinkSync(transcriptPath); // Cleanup transcript file

  return transcript;
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
  
