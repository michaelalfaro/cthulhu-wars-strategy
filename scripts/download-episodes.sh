#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIO_DIR="$SCRIPT_DIR/../content/transcripts/audio"
EPISODES_JSON="$SCRIPT_DIR/episodes.json"

mkdir -p "$AUDIO_DIR"

echo "Downloading Opening the Way podcast episodes..."
echo "================================================"

python3 -c "
import json, subprocess, os, sys

with open('$EPISODES_JSON') as f:
    episodes = json.load(f)

audio_dir = '$AUDIO_DIR'
for ep in episodes:
    filename = f\"{ep['slug']}.mp3\"
    filepath = os.path.join(audio_dir, filename)
    if os.path.exists(filepath):
        print(f\"[SKIP] Episode {ep['number']}: {ep['title']} (already downloaded)\")
        continue
    print(f\"[DOWN] Episode {ep['number']}: {ep['title']}\")
    result = subprocess.run(
        ['curl', '-L', '-o', filepath, '--progress-bar', ep['url']],
        capture_output=False
    )
    if result.returncode != 0:
        print(f\"[FAIL] Episode {ep['number']}: download failed\", file=sys.stderr)
    else:
        print(f\"[DONE] Episode {ep['number']}: saved to {filename}\")

print()
print('Download complete!')
print(f\"Files in {audio_dir}:\")
if os.path.exists(audio_dir):
    for f in sorted(os.listdir(audio_dir)):
        if f.endswith('.mp3'):
            size_mb = os.path.getsize(os.path.join(audio_dir, f)) / (1024*1024)
            print(f\"  {f} ({size_mb:.1f} MB)\")
"
