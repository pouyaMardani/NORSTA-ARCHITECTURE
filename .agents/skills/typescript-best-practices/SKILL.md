---
name: typescript-best-practices
description: Write safe, maintainable TypeScript using strict typing, type narrowing, clear interfaces, and reliable error handling. Use when creating or reviewing TypeScript code, APIs, data models, or React applications.
---

# TypeScript Best Practices

## Core Principles
- Prefer type safety, readability, and maintainability.
- Respect the project's existing TypeScript configuration.
- Use strict mode for new TypeScript projects when practical.
- Never silence a type error without understanding its cause.

## Type Design
- Prefer precise types over `any`.
- Use `unknown` for values whose type is not yet known, then narrow safely.
- Use `interface` or `type` according to the structure and purpose.
- Model optional and nullable values explicitly.
- Use discriminated unions for values with distinct states.
- Use literal types and `as const` when they improve correctness.
- Prefer inferred types when inference is clear and reliable.
- Avoid redundant annotations that add no value.

## Safety
- Avoid `any`, `@ts-ignore`, and unsafe type assertions.
- If an escape hatch is genuinely necessary, keep it narrow and explain why.
- Never use a type assertion as a substitute for runtime validation of external data.
- Validate API responses, user input, and other untrusted values at runtime.
- Handle null, undefined, and failed operations explicitly.

## Functions and Data
- Define meaningful parameter and return types where useful.
- Prefer immutable data transformations when practical.
- Use generics only when they improve reuse or preserve type relationships.
- Avoid overly complex conditional and mapped types when a simpler design works.
- Avoid duplicating domain types across unrelated files.

## Error Handling
- Model expected failures explicitly.
- Narrow caught errors before accessing error properties.
- Do not assume a caught value is an Error instance.
- Never suppress errors merely to satisfy the compiler.

## Project Integration
- Follow existing naming conventions and file organization.
- Reuse existing domain types and utilities.
- Avoid introducing new dependencies without justification.
- Keep framework-specific types aligned with the installed framework version.

## Verification
- Run the project's TypeScript check when available.
- Inspect compiler errors and resolve their underlying causes.
- Run relevant tests and build checks when practical.
- Do not claim type safety solely because the code looks correct.

## Completion Standard
TypeScript changes are complete when the intended behavior is implemented and relevant type checks have been run or their absence is clearly reported.
