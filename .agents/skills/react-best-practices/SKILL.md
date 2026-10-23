---
name: react-best-practices
description: Build maintainable React components using appropriate state management, hooks, composition, accessibility, and rendering practices. Use when creating, refactoring, or reviewing React components and interfaces.
---

# React Best Practices

## Component Design
- Keep components focused on a clear responsibility.
- Prefer composition over deeply nested conditional logic.
- Extract reusable components when reuse or clarity justifies it.
- Avoid splitting every small element into a separate component without a reason.
- Keep business logic separate from presentation when this improves clarity.
- Use descriptive component, prop, and variable names.

## State Management
- Keep state as close as practical to the components that need it.
- Derive values from existing state instead of storing duplicate state.
- Avoid unnecessary global state.
- Choose state management based on actual application complexity.
- Do not introduce a state-management library for trivial requirements.

## Hooks
- Follow React's Rules of Hooks.
- Call hooks consistently at the top level of components or custom hooks.
- Keep effect dependencies correct.
- Use effects to synchronize with external systems, not as a default mechanism for derived values.
- Avoid effects that create unnecessary render loops.
- Extract custom hooks when they encapsulate reusable stateful behavior.

## Rendering and Performance
- Prefer simple, correct rendering before adding optimizations.
- Use stable keys for lists.
- Avoid unnecessary component state or expensive work during render.
- Use memoization only when it provides a meaningful benefit.
- Avoid premature use of memo, useMemo, and useCallback.
- Investigate actual performance bottlenecks before introducing complexity.

## Forms and Events
- Handle form state and validation predictably.
- Provide meaningful labels and accessible controls.
- Prevent duplicate submissions when appropriate.
- Show useful loading, success, and error states.
- Avoid attaching side effects to render logic.

## Accessibility
- Prefer semantic HTML elements.
- Support keyboard interaction.
- Provide accessible names for interactive elements.
- Do not use clickable non-interactive elements when a button or link is appropriate.
- Make focus states visible.

## Data and Errors
- Handle loading, empty, error, and success states where relevant.
- Do not assume asynchronous requests always succeed.
- Avoid stale state and race conditions in asynchronous flows.
- Clean up subscriptions and other external resources when necessary.

## Verification
- Follow the project's established test framework.
- Test important behavior and user interactions.
- Run lint, type checks, and relevant tests when available.
- Verify that refactoring preserves existing behavior.

## Completion Standard
Deliver components that are understandable, accessible, appropriately tested, and no more complex than the requirements justify.
