---
name: safe-file-editing
description: Make controlled, minimal, and reversible file changes while preserving existing user work. Use when editing source files, configuration, documentation, scripts, or project structure.
---

# Safe File Editing

## Objective

Modify files safely, preserve existing work, and minimize unintended side effects.

## Before Editing

1. Read the complete relevant section of each file.
2. Understand how the file is used by other parts of the project.
3. Check Git status when Git is available.
4. Identify uncommitted changes and user-created content.
5. Determine the smallest change that satisfies the requirement.
6. Check whether an equivalent function, component, or configuration already exists.

## Editing Rules

- Prefer targeted edits over replacing entire files.
- Preserve unrelated code, comments, formatting, and configuration.
- Follow existing naming conventions and code style.
- Avoid unnecessary dependencies and unrelated refactoring.
- Do not silently remove functionality to make a change easier.
- Do not overwrite user modifications simply because a different implementation is preferred.
- When editing configuration, preserve unrelated settings.
- When generating documentation, preserve existing requirements and decisions.

## File Creation and Deletion

- Inspect the destination before creating or replacing files.
- Never overwrite an existing file without reading it first.
- Explain the reason before proposing destructive changes.
- Obtain explicit authorization before destructive or irreversible operations.
- Do not delete files simply because they appear unused without verifying references.
- Do not reset, clean, or discard user changes in Git.

## Secrets and Environment Files

- Never print API keys, tokens, passwords, or private credentials.
- Never copy real secrets into source code, documentation, examples, or Git history.
- Use placeholders in example files.
- Preserve local environment configuration.
- Do not modify .env files unless necessary and authorized.
- Check that secret files are excluded from version control when appropriate.

## After Editing

1. Inspect the diff or resulting file.
2. Check for accidental deletions and unrelated modifications.
3. Run appropriate validation when available.
4. Confirm that the intended change is present.
5. Report files changed and checks performed.

## Recovery

If a change causes an unexpected problem:
- Stop further unrelated modifications.
- Inspect the affected files and available diff.
- Preserve all user work.
- Explain the issue and propose a safe recovery.
- Never automatically revert or discard changes that may belong to the user.

## Completion Standard

A successful edit is minimal, intentional, reviewed, and verified. Writing a file is not proof that the application still works.