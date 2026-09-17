# Capture Test

## Setup

- **Tool:** Claude Code (CLI)
- **Model:** Sonnet 5 — `claude-sonnet-5`. Single model; no separate plan/execute split in this session.
- **Mechanism:** Claude Code hooks, configured in `.claude/settings.json`, run automatically on every turn — no manual invocation needed.
  - `UserPromptSubmit` hook fires on every prompt, invoking `.claude/hooks/capture.py prompt` with the hook JSON (incl. `session_id`, `prompt`) piped to stdin.
  - `Stop` hook fires at the end of every turn, invoking `.claude/hooks/capture.py response` with the hook JSON (incl. `transcript_path`) on stdin. The script reads the transcript JSONL and extracts the last assistant message's text blocks as the final response.
- **Config file changed:** `.claude/settings.json` (hook wiring) + `.claude/hooks/capture.py` (capture logic). Internal per-session bookkeeping lives in `.claude/hooks/state/` (gitignored — not part of the submission format, just lets the script assemble one markdown file per session incrementally).
- **Log output:** `.agent-logs/`, one file per session, named `YYYY-MM-DD_HH-MM-SS_<session-id>.md`, committed to the repo.

## Verification

Ran a canary in this session, then opened a **second, independent** `claude` session in the same repo and ran it again there, to confirm the hook isn't scoped to the session that installed it.

- Session 1 log: `.agent-logs/2026-09-17_17-32-01_81088a3b-38b7-4dad-ad1b-1fc55ddf9f16.md`
- Session 2 log: `.agent-logs/2026-09-17_17-34-36_f4ec0526-9939-4278-8673-ec5148586e03.md`

Both files exist with distinct `session_id`s, and both contain a captured PROMPT + RESPONSE pair for the canary line. Confirmed working in both sessions.

### What didn't work / dead end

Nothing failed on the hook mechanism itself — first wiring worked. Before trusting it on a live canary, I dry-ran `capture.py` against a synthetic hook payload and a synthetic transcript JSONL to check the file/frontmatter format was right; that synthetic session (`selftest-0001`) was deleted before the real canary run so it wouldn't pollute the log history.

One real hiccup during verification: my first prompt in session 2 was accidentally `check test` (leftover phrasing from session 1) instead of the actual canary string, so the true canary had to be sent as prompt #2 in that session. Left both prompts in the log rather than cleaning it up — see below.

### Canary entries, raw (session 1)

```
[LOG_ENTRY type=PROMPT num=1 session=81088a3b-38b7-4dad-ad1b-1fc55ddf9f16]
timestamp: 2026-09-17T17:32:01.992Z
model: claude-sonnet-5

CAPTURE TEST — 8x assignment, Bilal Ahmad

[LOG_ENTRY type=RESPONSE num=1 session=81088a3b-38b7-4dad-ad1b-1fc55ddf9f16]
timestamp: 2026-09-17T17:32:14.217Z
model: claude-sonnet-5

Prompt captured live. Response half fires on Stop — end of this turn. Confirming right after.
```

### Canary entries, raw (session 2)

```
[LOG_ENTRY type=PROMPT num=2 session=f4ec0526-9939-4278-8673-ec5148586e03]
timestamp: 2026-09-17T17:36:13.151Z
model: claude-sonnet-5

CAPTURE TEST — 8x assignment, Bilal Ahmad.

[LOG_ENTRY type=RESPONSE num=2 session=f4ec0526-9939-4278-8673-ec5148586e03]
timestamp: 2026-09-17T17:36:17.277Z
model: claude-sonnet-5

Repo empty. No source, no test files, no package.json. "higgsfield-clone" not built yet — just `.agent-logs`, `.claude`, `.gitignore`. Nothing test.

What test you mean? No app code exist here.
```
