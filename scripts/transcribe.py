#!/usr/bin/env python3
"""
Transcribe Opening the Way podcast episodes using OpenAI Whisper API.
Outputs markdown files with timestamps.
"""

import json
import os
import re
import sys
from pathlib import Path

from openai import OpenAI


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
AUDIO_DIR = PROJECT_DIR / "content" / "transcripts" / "audio"
OUTPUT_DIR = PROJECT_DIR / "content" / "transcripts"
EPISODES_JSON = SCRIPT_DIR / "episodes.json"
GAME_TERMS_FILE = SCRIPT_DIR / "game-terms.txt"


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


def transcribe_episode(client: OpenAI, episode: dict, terms: dict[str, str]) -> str:
    """Transcribe a single episode using OpenAI Whisper API."""
    audio_path = AUDIO_DIR / f"{episode['slug']}.mp3"
    output_path = OUTPUT_DIR / f"{episode['slug']}.md"

    if output_path.exists():
        return f"[SKIP] Episode {episode['number']}: {episode['title']} (already transcribed)"

    if not audio_path.exists():
        return f"[MISS] Episode {episode['number']}: {episode['title']} (audio not found)"

    try:
        print(f"[SEND] Episode {episode['number']}: {episode['title']} ({audio_path.stat().st_size / 1024 / 1024:.1f} MB)...")

        # Use verbose_json to get timestamps
        with open(audio_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json",
                timestamp_granularities=["segment"],
            )

        lines = []
        lines.append("---")
        lines.append(f'title: "{episode["title"]}"')
        lines.append(f"episode: {episode['number']}")
        lines.append(f'topic: "{episode["topic"]}"')
        lines.append(f'date: "{episode["date"]}"')
        if hasattr(response, 'duration') and response.duration:
            lines.append(f'duration: "{format_timestamp(response.duration)}"')
        lines.append(f'language: "{response.language if hasattr(response, "language") and response.language else "en"}"')
        lines.append("---")
        lines.append("")
        lines.append(f"# Episode {episode['number']}: {episode['title']}")
        lines.append("")
        lines.append(f"**Topic:** {episode['topic']}  ")
        lines.append(f"**Date:** {episode['date']}  ")
        if hasattr(response, 'duration') and response.duration:
            lines.append(f"**Duration:** {format_timestamp(response.duration)}")
        lines.append("")
        lines.append("---")
        lines.append("")
        lines.append("## Transcript")
        lines.append("")

        if hasattr(response, 'segments') and response.segments:
            for segment in response.segments:
                timestamp = format_timestamp(segment.start if hasattr(segment, 'start') else segment['start'])
                text = segment.text if hasattr(segment, 'text') else segment['text']
                text = fix_game_terms(text.strip(), terms)
                lines.append(f"**[{timestamp}]** {text}")
                lines.append("")
        else:
            # Fallback: just use the full text
            text = fix_game_terms(response.text.strip(), terms)
            lines.append(text)
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

    client = OpenAI(api_key=api_key)

    with open(EPISODES_JSON) as f:
        episodes = json.load(f)

    # Check for audio files - handle files >25MB by checking size
    available = []
    for ep in episodes:
        audio_path = AUDIO_DIR / f"{ep['slug']}.mp3"
        if audio_path.exists():
            size_mb = audio_path.stat().st_size / (1024 * 1024)
            if size_mb > 25:
                print(f"[WARN] Episode {ep['number']}: {ep['title']} is {size_mb:.1f} MB (>25MB API limit). Will need splitting.")
            available.append(ep)

    if not available:
        print("No audio files found. Run download-episodes.sh first.")
        sys.exit(1)

    terms = load_game_terms()

    print(f"Transcribing {len(available)} episodes with OpenAI Whisper API...")
    print(f"Estimated cost: ~${len(available) * 0.20:.2f}")
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
