---
name: agent-workflow
description: Plan and execute software engineering tasks in small, verifiable stages. Use when implementing features, changing architecture, modifying multiple files, starting a project, or handling complex coding tasks.
---

# Agent Workflow

## Core Principles

- Understand the requested outcome before making changes.
- Inspect relevant files and existing architecture before editing.
- Prefer small, reversible, verifiable changes over large uncontrolled modifications.
- Preserve existing functionality unless the user explicitly requests a change.
- Never claim that a task is complete unless its completion has been verified.
- Do not invent requirements, test results, or capabilities.

## Workflow

### 1. Understand

1. Identify the user's objective and expected outcome.
2. Read relevant project instructions, specifications, and existing documentation.
3. Identify constraints, dependencies, risks, and acceptance criteria.
4. Ask a focused question if a missing decision blocks safe progress.
5. Do not ask questions that can be answered reliably by inspecting the repository.

### 2. Inspect

1. Examine relevant source files, configuration, dependencies, and tests.
2. Identify existing conventions and architecture.
3. Check whether the requested functionality already exists.
4. Avoid duplicating existing components or utilities.
5. Establish the current state before modifying anything.

### 3. Plan

1. Divide complex work into small, ordered tasks.
2. Identify dependencies between tasks.
3. Define how each task will be verified.
4. Separate required work from optional improvements.
5. Identify actions that require user approval.

### 4. Execute

1. Implement one logical unit at a time.
2. Follow existing conventions unless there is a clear reason to change them.
3. Keep changes focused on the requested outcome.
4. Inspect the result after each meaningful change.
5. Run appropriate tests or checks as early as practical.
6. Stop and report if an unexpected blocker changes the plan materially.

### 5. Verify

1. Run relevant tests, build commands, lint checks, or type checks when available.
2. Inspect errors and warnings.
3. Check for regressions in affected functionality.
4. Verify each acceptance criterion individually.
5. Never describe a command as successful unless its result was observed.

### 6. Report

Summarize:
- What changed.
- Why the changes were necessary.
- Which checks actually passed.
- Which checks failed or were not run.
- Remaining risks and blockers.
- The recommended next step.

## Safety and Approval

- Never expose, print, or commit API keys, passwords, or other secrets.
- Never delete user data, reset a repository, or perform destructive operations without appropriate inspection and authorization.
- Do not deploy, publish, spend money, or modify production resources without explicit authorization.
- Ask before adding major dependencies or making irreversible architectural decisions.
- Follow the user's requested task boundary; do not continue into later phases without permission when approval is required.

## Completion Standard

A task is complete only when its acceptance criteria have been checked against actual evidence.

Distinguish clearly between:
- Implemented.
- Tested and passed.
- Partially verified.
- Blocked.
- Not tested.

Do not confuse code generation with successful implementation.