---
name: task-progress-tracking
description: Track multi-step software tasks using checklists, project roadmaps, and progress logs. Use when a task spans multiple phases, requires resumability, or must preserve progress across interrupted sessions.
---

# Task Progress Tracking

## Objective

Maintain accurate, durable progress records for multi-step tasks without marking incomplete work as finished.

## Source of Truth

- Follow the user's designated roadmap or task-tracking file.
- If multiple plans exist, identify the authoritative one before updating them.
- Preserve the existing structure and requirements of the tracking document.
- Do not create competing roadmaps unnecessarily.

## Before Starting

1. Read the roadmap and relevant project instructions.
2. Inspect the current repository state.
3. Identify the current phase and its acceptance criteria.
4. Check the existing progress log.
5. Determine which tasks are actually complete, incomplete, or blocked.

## Checklist Rules

- Mark a checkbox complete only after its acceptance criteria have been verified.
- Do not mark a task complete merely because code was generated.
- Keep untested, partially implemented, and blocked items unchecked.
- Distinguish implementation from successful verification.
- Do not mark future phases complete in advance.
- Never fabricate progress to make a roadmap appear finished.

## Execution

1. Work only on the authorized phase or task.
2. Complete a small logical unit of work.
3. Verify the result.
4. Update the relevant checklist items.
5. Record significant decisions and blockers.
6. Continue only within the user's approved scope.

## Progress Log

When the roadmap provides a progress log, record:
- Date.
- Phase or task.
- Summary of work performed.
- Files changed.
- Checks actually run and their results.
- Outstanding issues.
- Exact recommended next step.

Use concise, factual entries. Preserve useful historical entries instead of silently replacing them.

## Resuming After Interruption

When a session resumes:

1. Read the roadmap and latest progress entry.
2. Inspect the current repository rather than trusting the log alone.
3. Verify the claimed state of relevant files and tests.
4. Reconcile discrepancies between documentation and actual project state.
5. Resume from the earliest incomplete prerequisite.
6. Do not repeat completed work unless verification reveals a problem.

## Phase Boundaries

- Respect explicit approval gates between phases.
- Do not start the next phase simply because the current phase is complete.
- Report completion and wait when the user requires approval.
- If blocked, record the reason and the smallest useful next action.

## Final Report

State:
- Completed tasks.
- Incomplete tasks.
- Verification evidence.
- Blockers and decisions needed.
- The next authorized step.

The roadmap must reflect the real project state, not the intended or assumed state.