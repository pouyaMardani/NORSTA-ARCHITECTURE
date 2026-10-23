---
name: repository-audit
description: Inspect an existing code repository before implementation, refactoring, dependency installation, or architectural changes. Use when starting work in an unfamiliar project or assessing project readiness.
---

# Repository Audit

## Objective

Understand the repository's actual state before making changes. Produce evidence-based findings rather than assumptions.

## Audit Procedure

### 1. Identify the Workspace

- Determine the current workspace root.
- Inspect the directory structure and relevant source files.
- Identify the language, framework, runtime, package manager, and build system.
- Read project instructions such as README files, agent instructions, and contribution guidelines.
- Look for existing task plans and architectural documentation.

### 2. Inspect Project Configuration

Review relevant files such as:
- package.json and lockfiles.
- pyproject.toml, requirements files, or equivalent Python configuration.
- TypeScript and framework configuration.
- Environment variable examples.
- Build, lint, formatting, and test configuration.
- Git status and ignore rules.

Only inspect files relevant to the requested task.

### 3. Identify Existing Functionality

- Find the current entry points.
- Identify major modules, routes, components, utilities, and tests.
- Check whether the requested feature already exists.
- Trace relevant data flow and dependencies.
- Prefer extending existing abstractions over creating duplicate implementations.

### 4. Assess Project Health

When practical and authorized:
- Check available runtime and package-manager versions.
- Determine whether dependencies are installed.
- Inspect existing test coverage and scripts.
- Run non-destructive checks when useful.
- Identify configuration errors and missing prerequisites.

Do not install dependencies or change project files merely to complete an audit.

### 5. Identify Risks

Report:
- Missing or conflicting requirements.
- Potentially destructive changes.
- Existing uncommitted user work.
- Unsupported or outdated dependencies when verified.
- Missing environment configuration.
- Security concerns relevant to the task.
- Unknowns that require user input.

Never expose secret values in the report.

## Output Format

Provide:

1. Repository overview.
2. Relevant files and their roles.
3. Existing implementation related to the task.
4. Verified environment and dependency status.
5. Findings and risks.
6. Blockers and questions.
7. Recommended next steps.

Separate verified facts from assumptions and recommendations.

## Restrictions

- Do not rewrite the repository during an audit.
- Do not delete, rename, or overwrite files without a task-specific reason.
- Do not assume that a missing optional file means the project is broken.
- Do not claim that tests, builds, or dependencies work without evidence.
- Respect existing architecture and user instructions.