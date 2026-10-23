---
name: component-architecture
description: Design maintainable frontend architecture with clear component boundaries, reusable modules, separation of concerns, and appropriate file organization. Use when creating project structures, splitting large components, or refactoring frontend code.
---

# Component Architecture

## Architectural Goals
- Optimize for clarity, maintainability, and ease of change.
- Follow the project's established architecture when it is sound.
- Introduce abstractions only when they solve a real problem.
- Avoid both monolithic files and excessive fragmentation.

## Responsibilities
- Keep components focused on a coherent responsibility.
- Separate presentation, data access, domain logic, and infrastructure when appropriate.
- Keep route-specific behavior near the relevant route.
- Move genuinely shared behavior into shared modules.
- Avoid duplicating business rules across components.

## Reusability
- Reuse components when multiple consumers share meaningful behavior or design.
- Prefer composition and explicit props over complex generic configuration systems.
- Avoid creating abstractions for hypothetical future requirements.
- Avoid components with excessive props or many unrelated modes.
- Keep reusable components independent of unrelated page-specific assumptions.

## Folder Organization
- Group related files by feature, route, or responsibility when appropriate.
- Use consistent naming conventions.
- Keep imports understandable and avoid circular dependencies.
- Separate public reusable modules from internal implementation details.
- Do not reorganize the entire repository without a clear benefit.

## State and Data Flow
- Place state near its consumers when possible.
- Keep data flow explicit and predictable.
- Avoid prop drilling only when it creates a meaningful maintenance problem.
- Introduce context or a state-management library only when justified.
- Avoid coupling visual components to unrelated network or storage concerns.

## Shared UI and Domain Logic
- Keep domain-specific rules separate from generic presentation components.
- Avoid embedding large datasets directly inside complex UI components.
- Use typed data models for repeated structured content.
- Keep configuration and content separate from presentation when practical.
- Design error and empty states as part of the component contract.

## Refactoring
1. Inspect current usage and dependencies.
2. Identify the specific architectural problem.
3. Define the intended boundaries.
4. Make a small, focused refactor.
5. Update imports and tests.
6. Verify existing behavior.
7. Explain meaningful trade-offs.

Do not refactor unrelated files simply to make the architecture look uniform.

## Verification
- Check for duplicate implementations and circular dependencies.
- Run relevant tests and type checks.
- Verify imports, routes, and shared components.
- Inspect the resulting structure against actual project needs.

## Completion Standard
The architecture should make code easier to understand and change without introducing unnecessary layers or abstractions.
