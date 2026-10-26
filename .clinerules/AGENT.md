# NORSTA — Agent Rules

> This file is auto-loaded by Cline from the workspace `.clinerules/` directory, so it
> applies to every conversation in this repository. Keep it in sync with the source copy
> at `.clinerule/AGENT.md`.

## Repository Context and `_ref` Exclusion Rules

- Treat `_ref/` as a local, gitignored directory containing generated audit reports, test logs, browser profiles, screenshots, and temporary artifacts.
- Never recursively scan `_ref/` during routine tasks.
- Never read screenshots, browser-profile files, logs, or generated JSON reports unless the current task explicitly requires analyzing a specific artifact.
- Do not include `_ref/` contents in broad repository inspections or context-gathering operations.
- When a task requires an audit or screenshot, access only the exact script and output files needed.
- Preserve `_ref/`; do not delete or clean it automatically.
- Do not change the existing scripts' output paths unless explicitly required.
- Keep tool output concise. Prefer targeted file reads and summaries over recursive listings and full-file dumps.

These rules do not prohibit running the project's existing audit or screenshot scripts when needed; they prohibit unnecessary inspection of their generated artifacts.
