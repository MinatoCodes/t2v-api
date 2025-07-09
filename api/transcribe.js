const { execSync } = require("child_process");
const axios = require("axios");
const fs = require("fs");

async function transcribe(url) {
  const fileName = `temp_${Date.now()}`;
  const videoPath = `./${fileName}.mp4`;
  const audioPath = `./${fileName}.wav`;
  const writer = fs.createWriteStream(videoPath);

  // Download file
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  // Convert to 16khz mono wav using ffmpeg
  execSync(`ffmpeg -i ${videoPath} -ar 16000 -ac 1 -c:a pcm_s16le ${audioPath}`);

  // Transcribe with whisper.cpp
  const output = execSync(`whisper ${audioPath} --model models/ggml-base.en.bin`, {
    encoding: "utf-8"
  });

  // Cleanup temp files
  fs.unlinkSync(videoPath);
  fs.unlinkSync(audioPath);

  return output;
}

module.exports = { transcribe };
                     
