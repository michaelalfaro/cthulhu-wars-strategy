#!/usr/bin/env python3
"""
Transcribe Opening the Way podcast episodes using mlx-whisper (Apple Silicon).
No file size limits - processes audio directly on-device.
Outputs markdown files with timestamps.
"""

import json
import re
import sys
from pathlib import Path

import mlx_whisper

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
AUDIO_DIR = PROJECT_DIR / "content" / "transcripts" / "audio"
OUTPUT_DIR = PROJECT_DIR / "content" / "transcripts"
EPISODES_JSON = SCRIPT_DIR / "episodes.json"
GAME_TERMS_FILE = SCRIPT_DIR / "game-terms.txt"

MODEL = "mlx-community/whisper-large-v3-turbo"


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


def transcribe_episode(episode: dict, terms: dict[str, str]) -> str:
    """Transcribe a single episode using mlx-whisper locally."""
    audio_path = AUDIO_DIR / f"{episode['slug']}.mp3"
    output_path = OUTPUT_DIR / f"{episode['slug']}.md"

    if output_path.exists():
        return f"[SKIP] Episode {episode['number']}: {episode['title']} (already transcribed)"

    if not audio_path.exists():
        return f"[MISS] Episode {episode['number']}: {episode['title']} (audio not found)"

    try:
        file_size_mb = audio_path.stat().st_size / (1024 * 1024)
        print(f"[TRANSCRIBING] Episode {episode['number']}: {episode['title']} ({file_size_mb:.1f} MB)...")

        result = mlx_whisper.transcribe(
            str(audio_path),
            path_or_hf_repo=MODEL,
            verbose=False,
            word_timestamps=False,
        )

        segments = result.get("segments", [])
        total_duration = segments[-1]["end"] if segments else 0

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

        for segment in segments:
            timestamp = format_timestamp(segment["start"])
            text = fix_game_terms(segment["text"].strip(), terms)
            lines.append(f"**[{timestamp}]** {text}")
            lines.append("")

        output_path.write_text("\n".join(lines))
        return f"[DONE] Episode {episode['number']}: {episode['title']} -> {output_path.name}"

    except Exception as e:
        return f"[FAIL] Episode {episode['number']}: {episode['title']} - {e}"


def main():
    with open(EPISODES_JSON) as f:
        episodes = json.load(f)

    # Allow specifying episodes by number on the command line
    if len(sys.argv) > 1:
        requested = set()
        for arg in sys.argv[1:]:
            if "-" in arg:
                start, end = arg.split("-")
                requested.update(range(int(start), int(end) + 1))
            else:
                requested.add(int(arg))
        episodes = [ep for ep in episodes if ep["number"] in requested]
        if not episodes:
            print(f"No matching episodes found for: {sys.argv[1:]}")
            sys.exit(1)

    available = [ep for ep in episodes if (AUDIO_DIR / f"{ep['slug']}.mp3").exists()]
    pending = [ep for ep in available if not (OUTPUT_DIR / f"{ep['slug']}.md").exists()]

    if not pending:
        print("All episodes already transcribed (or no audio files found).")
        sys.exit(0)

    terms = load_game_terms()

    total_size = sum((AUDIO_DIR / f"{ep['slug']}.mp3").stat().st_size for ep in pending)

    print(f"Transcribing {len(pending)} episodes with mlx-whisper (local, Apple Silicon)...")
    print(f"Model: {MODEL}")
    print(f"Total audio to process: {total_size / (1024*1024*1024):.1f} GB")
    print("=" * 60)

    for ep in pending:
        result = transcribe_episode(ep, terms)
        print(result)

    print()
    print("Transcription complete!")
    transcribed = list(OUTPUT_DIR.glob("*.md"))
    print(f"Total transcripts: {len(transcribed)}")


if __name__ == "__main__":
    main()
