---
name: code-review
description: >-
  Review code changes for correctness, regressions, security risks, performance
  issues, maintainability, and unmet requirements. Use before merging changes,
  completing features, or approving substantial code modifications.
---

# Code Review

## Review Objective
Identify actionable defects and risks in changed code. Prioritize correctness and user impact over stylistic preferences.

## Review Process
1. Read task requirements and acceptance criteria.
2. Inspect the Git diff or exact files changed.
3. Read relevant surrounding code and callers.
4. Check how the change affects existing behavior.
5. Verify important assumptions against the implementation.
6. Run focused checks when available.

## Review Priorities

### Correctness
- Incorrect logic or calculations.
- Missing edge cases.
- Broken state transitions.
- Incorrect asynchronous behavior.
- Null, undefined, and invalid input handling.
- Incorrect assumptions about external data.

### Security and Privacy
- Exposed credentials or secrets.
- Unsafe input handling.
- Missing authorization checks where required.
- Unsafe HTML or code execution.
- Sensitive information in logs or error messages.
- Insecure configuration or dependency usage.

### Reliability
- Unhandled errors.
- Resource leaks.
- Race conditions.
- Incorrect retry or timeout behavior.
- Fragile dependencies between modules.
- Failure paths that leave the application inconsistent.

### Performance
- Unnecessary repeated work.
- Expensive operations on frequent render paths.
- Unnecessary network requests.
- Excessive client-side JavaScript.
- Unoptimized large assets or dependencies.

### Maintainability
- Unclear responsibilities.
- Unnecessary duplication.
- Excessive complexity.
- Incorrect types.
- Missing tests for important behavior.
- Unrelated changes that increase review risk.

## Findings Format
For each finding, include:
- Severity: Critical, High, Medium, or Low.
- File and line or relevant code location.
- The concrete problem.
- Why it matters.
- A recommended correction.

Report only findings supported by evidence. If no issues are found, state the scope reviewed and checks performed; do not imply that every possible defect has been ruled out.

## Severity Guidance
- Critical: A severe, immediately exploitable or destructive issue.
- High: A major security, data integrity, or core functionality issue.
- Medium: A meaningful defect affecting common scenarios or important requirements.
- Low: A limited-impact issue or minor improvement.

Do not inflate severity to make findings appear important.

## Review Boundaries
- Do not rewrite the entire implementation during a review.
- Do not introduce unrelated refactoring.
- Distinguish definite defects from suggestions.
- Do not report formatting preferences as bugs.
- Do not claim tests passed unless they were actually run.

## Completion Standard
Provide an evidence-based review with actionable findings, verification results, and remaining uncertainty.
