# Voice to Text API

## 📝 Description
This API converts audio/video URLs to text using whisper.cpp and ffmpeg.

## 🚀 Deploy on Render
- Connect this repo to Render
- Render will install dependencies and build whisper.cpp automatically

## 🔗 API Endpoints

### GET /api/transcribe

**Query:**
`url=https://example.com/audio.mp3`

### POST /api/transcribe

**Body**
```json
{ "url": "https://example.com/audio.mp3" }
