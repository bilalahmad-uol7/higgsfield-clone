#!/usr/bin/env python3
"""8x assignment capture hook.

Fired automatically by Claude Code on UserPromptSubmit and Stop (see
.claude/settings.json). Appends prompt/response pairs to .agent-logs/.

Usage: capture.py <prompt|response>   (mode comes from the hook wiring, not the user)
Reads the hook event JSON from stdin, as documented at
https://docs.claude.com/en/docs/claude-code/hooks
"""
import json
import os
import subprocess
import sys
from datetime import datetime, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOGS_DIR = os.path.join(REPO_ROOT, ".agent-logs")
STATE_DIR = os.path.join(REPO_ROOT, ".claude", "hooks", "state")
DEFAULT_MODEL = "claude-sonnet-5"


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + \
        f"{datetime.now(timezone.utc).microsecond // 1000:03d}Z"


def git_author():
    try:
        name = subprocess.check_output(
            ["git", "config", "user.name"], cwd=REPO_ROOT, text=True
        ).strip()
        return name or "unknown"
    except Exception:
        return "unknown"


def session_dir(session_id):
    d = os.path.join(STATE_DIR, session_id)
    os.makedirs(d, exist_ok=True)
    return d


def load_meta(session_id):
    path = os.path.join(session_dir(session_id), "meta.json")
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return None


def save_meta(session_id, meta):
    path = os.path.join(session_dir(session_id), "meta.json")
    with open(path, "w") as f:
        json.dump(meta, f, indent=2)


def append_entry(session_id, entry_md):
    path = os.path.join(session_dir(session_id), "entries.jsonl")
    with open(path, "a") as f:
        f.write(json.dumps({"md": entry_md}) + "\n")


def read_entries(session_id):
    path = os.path.join(session_dir(session_id), "entries.jsonl")
    out = []
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                out.append(json.loads(line)["md"])
    return out


def filename_for(meta):
    return f"{meta['first_prompt_time_fs']}_{meta['session_id']}.md"


def render(meta, entries):
    header = (
        "---\n"
        f"session_id: {meta['session_id']}\n"
        f"date: {meta['date']}\n"
        f"author: {meta['author']}\n"
        f"model: {meta['model']}\n"
        f"tool: claude-code\n"
        f"project: {meta['project']}\n"
        f"total_exchanges: {meta['total_exchanges']}\n"
        f"first_prompt_time: {meta['first_prompt_time']}\n"
        f"last_prompt_time: {meta['last_prompt_time']}\n"
        "---\n\n"
        f"# Session Log - {meta['date']}\n\n"
        f"Session: `{meta['session_id']}` | Project: `{meta['project']}` | "
        f"Author: `{meta['author']}`\n\n"
        "---\n\n"
    )
    return header + "\n\n".join(entries) + "\n"


def write_log(meta):
    entries = read_entries(meta["session_id"])
    os.makedirs(LOGS_DIR, exist_ok=True)
    path = os.path.join(LOGS_DIR, filename_for(meta))
    with open(path, "w") as f:
        f.write(render(meta, entries))
    return path


def extract_last_assistant_text(transcript_path):
    """Return (text, model) for the most recent assistant text turn."""
    if not transcript_path or not os.path.exists(transcript_path):
        return None, None
    try:
        with open(transcript_path) as f:
            lines = f.readlines()
    except Exception:
        return None, None

    for line in reversed(lines):
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue
        msg = obj.get("message") if isinstance(obj.get("message"), dict) else obj
        role = msg.get("role") or obj.get("type")
        if role != "assistant":
            continue
        content = msg.get("content")
        parts = []
        if isinstance(content, str):
            parts.append(content)
        elif isinstance(content, list):
            for block in content:
                if isinstance(block, dict) and block.get("type") == "text":
                    parts.append(block.get("text", ""))
        if parts:
            text = "\n".join(p for p in parts if p).strip()
            if text:
                return text, msg.get("model")
    return None, None


def handle_prompt(data):
    session_id = data.get("session_id", "unknown-session")
    prompt = data.get("prompt", "")
    ts = now_iso()

    meta = load_meta(session_id)
    if meta is None:
        meta = {
            "session_id": session_id,
            "author": git_author(),
            "project": os.path.basename(REPO_ROOT),
            "model": DEFAULT_MODEL,
            "date": ts[:10],
            "first_prompt_time": ts,
            "first_prompt_time_fs": ts[:19].replace(":", "-").replace("T", "_"),
            "last_prompt_time": ts,
            "current_num": 0,
            "total_exchanges": 0,
        }

    meta["current_num"] += 1
    meta["last_prompt_time"] = ts
    num = meta["current_num"]

    entry = (
        f"[LOG_ENTRY type=PROMPT num={num} session={session_id}]\n"
        f"timestamp: {ts}\n"
        f"model: {meta['model']}\n\n"
        f"{prompt}"
    )
    append_entry(session_id, entry)
    save_meta(session_id, meta)
    write_log(meta)


def handle_response(data):
    session_id = data.get("session_id", "unknown-session")
    transcript_path = data.get("transcript_path")

    meta = load_meta(session_id)
    if meta is None:
        # Stop fired with no captured prompt for this session; nothing to attach to.
        return

    text, model = extract_last_assistant_text(transcript_path)
    if not text:
        return

    if model:
        meta["model"] = model

    ts = now_iso()
    num = meta["current_num"]
    meta["total_exchanges"] = num

    entry = (
        f"[LOG_ENTRY type=RESPONSE num={num} session={session_id}]\n"
        f"timestamp: {ts}\n"
        f"model: {meta['model']}\n\n"
        f"{text}"
    )
    append_entry(session_id, entry)
    save_meta(session_id, meta)
    write_log(meta)


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ("prompt", "response"):
        sys.exit(0)
    mode = sys.argv[1]
    try:
        data = json.load(sys.stdin)
    except Exception:
        data = {}

    if mode == "prompt":
        handle_prompt(data)
    else:
        handle_response(data)


if __name__ == "__main__":
    main()
