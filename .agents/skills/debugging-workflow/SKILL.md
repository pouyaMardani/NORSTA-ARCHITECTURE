---
name: debugging-workflow
description: Diagnose and resolve software bugs systematically using reproducible evidence, root-cause analysis, and targeted fixes. Use when encountering errors, failing tests, unexpected behavior, or build failures.
---

# Debugging Workflow

## Core Rule

Do not guess repeatedly. Reproduce the problem, collect evidence, identify the likely root cause, and verify a targeted fix.

## Step 1: Understand the Failure

- Capture the exact error message or observed behavior.
- Identify the command, action, route, or input that triggered it.
- Determine expected versus actual behavior.
- Establish whether the issue is reproducible.
- Ask for missing logs only when they are necessary.

## Step 2: Collect Evidence

Inspect relevant:
- Stack traces and terminal output.
- Browser console and network errors.
- Application logs.
- Configuration and environment variables.
- Dependencies and runtime versions.
- Recent code changes and Git diffs.
- Relevant tests and documentation.

Redact secrets and sensitive data.

## Step 3: Form a Hypothesis

- Identify the most likely causes based on evidence.
- Distinguish symptoms from root causes.
- Check assumptions against the actual code and configuration.
- Prefer the simplest explanation consistent with the evidence.
- Avoid changing unrelated code.

## Step 4: Test the Hypothesis

- Use the smallest safe diagnostic step.
- Change one logical factor at a time when practical.
- Run a focused reproduction or test.
- Record whether the evidence supports the hypothesis.
- Revise the hypothesis if the evidence contradicts it.

## Step 5: Implement the Fix

- Correct the underlying cause rather than hiding the symptom.
- Preserve existing behavior outside the bug's scope.
- Avoid broad exception handling that conceals failures.
- Avoid disabling tests, type checks, security checks, or lint rules merely to obtain a green result.
- Add a regression test when appropriate.

## Step 6: Verify

- Reproduce the original failure before the fix when practical.
- Run the focused test after the fix.
- Run relevant broader tests or build checks.
- Check for regressions.
- Report checks that could not be run.

## Escalation

If the problem remains unresolved:
- Summarize the evidence collected.
- List hypotheses already tested.
- Explain what each test established.
- Identify the next most useful diagnostic action.
- Do not claim resolution without verification.

## Final Report

Include:
1. Root cause, if established.
2. Evidence supporting it.
3. Files changed.
4. Fix implemented.
5. Verification results.
6. Remaining uncertainty.

Never fabricate logs, test results, or root causes.