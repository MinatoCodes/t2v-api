const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

async function transcribe(filePath) {
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
  return transcript;
}

module.exports = { transcribe };
  
