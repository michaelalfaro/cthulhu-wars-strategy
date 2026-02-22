#!/usr/bin/env python3
"""
Transcribe Opening the Way podcast episodes using OpenAI Whisper API.
Splits large files (>25MB) into chunks via ffmpeg before sending.
Outputs markdown files with timestamps.
"""

import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from openai import OpenAI


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
AUDIO_DIR = PROJECT_DIR / "content" / "transcripts" / "audio"
OUTPUT_DIR = PROJECT_DIR / "content" / "transcripts"
EPISODES_JSON = SCRIPT_DIR / "episodes.json"
GAME_TERMS_FILE = SCRIPT_DIR / "game-terms.txt"

MAX_FILE_SIZE_MB = 24  # Stay under 25MB API limit


def load_game_terms() -> dict[str, str]:
    """Load game terminology for post-processing corrections."""
    terms = {}
    if GAME_TERMS_FILE.exists():
        for line in GAME_TERMS_FILE.read_text().strip().split("\n"):
            line = line.strip()
            if line:
                terms[line.lower()] = line
    return terms


def fix_game_terms(text: str, terms: dict[str, str]) -> str:
    """Fix capitalization and spelling of game-specific terms."""
    for lower, correct in terms.items():
        pattern = re.compile(re.escape(lower), re.IGNORECASE)
        text = pattern.sub(correct, text)
    return text


def format_timestamp(seconds: float) -> str:
    """Convert seconds to HH:MM:SS format."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def get_audio_duration(audio_path: Path) -> float:
    """Get duration of audio file in seconds using ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(audio_path)],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def split_audio(audio_path: Path, max_size_mb: float) -> list[Path]:
    """Split audio file into chunks under max_size_mb using ffmpeg."""
    file_size_mb = audio_path.stat().st_size / (1024 * 1024)
    if file_size_mb <= max_size_mb:
        return [audio_path]

    duration = get_audio_duration(audio_path)
    num_chunks = int(file_size_mb / max_size_mb) + 1
    chunk_duration = duration / num_chunks

    tmp_dir = Path(tempfile.mkdtemp(prefix="cw_transcribe_"))
    chunks = []

    for i in range(num_chunks):
        start = i * chunk_duration
        chunk_path = tmp_dir / f"chunk_{i:03d}.mp3"
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(audio_path),
             "-ss", str(start), "-t", str(chunk_duration),
             "-acodec", "libmp3lame", "-ab", "64k",
             "-ar", "16000", "-ac", "1",
             chunk_path],
            capture_output=True
        )
        if chunk_path.exists() and chunk_path.stat().st_size > 0:
            chunks.append(chunk_path)

    return chunks


def transcribe_episode(client: OpenAI, episode: dict, terms: dict[str, str]) -> str:
    """Transcribe a single episode using OpenAI Whisper API."""
    audio_path = AUDIO_DIR / f"{episode['slug']}.mp3"
    output_path = OUTPUT_DIR / f"{episode['slug']}.md"

    if output_path.exists():
        return f"[SKIP] Episode {episode['number']}: {episode['title']} (already transcribed)"

    if not audio_path.exists():
        return f"[MISS] Episode {episode['number']}: {episode['title']} (audio not found)"

    try:
        file_size_mb = audio_path.stat().st_size / (1024 * 1024)
        needs_splitting = file_size_mb > MAX_FILE_SIZE_MB

        if needs_splitting:
            print(f"[SPLIT] Episode {episode['number']}: {episode['title']} ({file_size_mb:.1f} MB -> splitting)...")
            chunks = split_audio(audio_path, MAX_FILE_SIZE_MB)
            print(f"  Split into {len(chunks)} chunks")
        else:
            print(f"[SEND] Episode {episode['number']}: {episode['title']} ({file_size_mb:.1f} MB)...")
            chunks = [audio_path]

        all_segments = []
        time_offset = 0.0
        total_duration = 0.0

        for i, chunk_path in enumerate(chunks):
            if needs_splitting:
                print(f"  Transcribing chunk {i+1}/{len(chunks)}...")

            with open(chunk_path, "rb") as audio_file:
                response = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                    timestamp_granularities=["segment"],
                )

            chunk_duration = response.duration if hasattr(response, 'duration') and response.duration else 0

            if hasattr(response, 'segments') and response.segments:
                for segment in response.segments:
                    start = (segment.start if hasattr(segment, 'start') else segment['start']) + time_offset
                    text = segment.text if hasattr(segment, 'text') else segment['text']
                    all_segments.append({"start": start, "text": text.strip()})
            elif hasattr(response, 'text') and response.text:
                all_segments.append({"start": time_offset, "text": response.text.strip()})

            time_offset += chunk_duration
            total_duration += chunk_duration

        # Clean up temp chunks
        if needs_splitting:
            for chunk in chunks:
                if chunk != audio_path:
                    chunk.unlink(missing_ok=True)
                    chunk.parent.rmdir() if not list(chunk.parent.iterdir()) else None

        # Build markdown output
        lines = []
        lines.append("---")
        lines.append(f'title: "{episode["title"]}"')
        lines.append(f"episode: {episode['number']}")
        lines.append(f'topic: "{episode["topic"]}"')
        lines.append(f'date: "{episode["date"]}"')
        if total_duration > 0:
            lines.append(f'duration: "{format_timestamp(total_duration)}"')
        lines.append('language: "en"')
        lines.append("---")
        lines.append("")
        lines.append(f"# Episode {episode['number']}: {episode['title']}")
        lines.append("")
        lines.append(f"**Topic:** {episode['topic']}  ")
        lines.append(f"**Date:** {episode['date']}  ")
        if total_duration > 0:
            lines.append(f"**Duration:** {format_timestamp(total_duration)}")
        lines.append("")
        lines.append("---")
        lines.append("")
        lines.append("## Transcript")
        lines.append("")

        for segment in all_segments:
            timestamp = format_timestamp(segment["start"])
            text = fix_game_terms(segment["text"], terms)
            lines.append(f"**[{timestamp}]** {text}")
            lines.append("")

        output_path.write_text("\n".join(lines))
        return f"[DONE] Episode {episode['number']}: {episode['title']} -> {output_path.name}"

    except Exception as e:
        return f"[FAIL] Episode {episode['number']}: {episode['title']} - {e}"


def main():
    # Check for API key
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set.")
        print("Set it with: export OPENAI_API_KEY='your-key-here'")
        sys.exit(1)

    # Check for ffmpeg
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
    except FileNotFoundError:
        print("Error: ffmpeg not found. Install with: brew install ffmpeg")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    with open(EPISODES_JSON) as f:
        episodes = json.load(f)

    available = [ep for ep in episodes if (AUDIO_DIR / f"{ep['slug']}.mp3").exists()]

    if not available:
        print("No audio files found. Run download-episodes.sh first.")
        sys.exit(1)

    terms = load_game_terms()

    # Calculate stats
    total_size = sum((AUDIO_DIR / f"{ep['slug']}.mp3").stat().st_size for ep in available)
    oversized = sum(1 for ep in available if (AUDIO_DIR / f"{ep['slug']}.mp3").stat().st_size > MAX_FILE_SIZE_MB * 1024 * 1024)

    print(f"Transcribing {len(available)} episodes with OpenAI Whisper API...")
    print(f"Total audio: {total_size / (1024*1024*1024):.1f} GB")
    print(f"Episodes needing splitting (>{MAX_FILE_SIZE_MB}MB): {oversized}")
    print(f"Estimated cost: ~${total_size / (1024*1024) * 0.006 / 60 * 30:.2f}")
    print("=" * 60)

    for ep in available:
        result = transcribe_episode(client, ep, terms)
        print(result)

    print()
    print("Transcription complete!")

    transcribed = list(OUTPUT_DIR.glob("*.md"))
    print(f"Total transcripts: {len(transcribed)}")


if __name__ == "__main__":
    main()
