import mimetypes
import os
from pathlib import PurePath

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

load_dotenv()

app = FastAPI(title="MeetingMind Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

EXTENSION_MAP = {
    ".flac": "audio/flac",
    ".mp3": "audio/mpeg",
    ".mp4": "audio/mp4",
    ".m4a": "audio/x-m4a",
    ".ogg": "audio/ogg",
    ".oga": "audio/ogg",
    ".wav": "audio/wav",
    ".webm": "audio/webm",
}

ALLOWED_AUDIO_TYPES = set(EXTENSION_MAP.values())

MAX_FILE_SIZE = 5 * 1024 * 1024


def _resolve_content_type(content_type: str | None, filename: str | None) -> str | None:
    if content_type:
        normalised = content_type.split(";")[0].strip().lower()
        if normalised != "application/octet-stream":
            return normalised
    if filename:
        ext = PurePath(filename).suffix.lower()
        mapped = EXTENSION_MAP.get(ext)
        if mapped:
            return mapped
    return content_type.split(";")[0].strip().lower() if content_type else None


@app.get("/api/health")
async def health():
    if not os.getenv("GROQ_API_KEY"):
        return {"status": "degraded", "detail": "GROQ_API_KEY not set"}
    return {"status": "ok"}


@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    content_type = _resolve_content_type(audio.content_type, audio.filename)
    if not content_type or content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported audio format: {audio.content_type}. "
                f"Supported formats: flac, mp3, m4a, ogg, wav, webm"
            ),
        )

    contents = await audio.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(contents) / 1024 / 1024:.1f} MB). Maximum size is 5 MB.",
        )

    try:
        transcription = client.audio.transcriptions.create(
            file=(audio.filename or "audio", contents),
            model="whisper-large-v3-turbo",
            response_format="json",
        )
        return {"text": transcription.text, "model": "whisper-large-v3-turbo"}
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Transcription failed: {e}",
        )
