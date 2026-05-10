Day 4 small perf tweak — reduce Tailwind output or lazy-load component

Suggested commit message: perf: lazy-load heavy visual or reduce Tailwind classes

Edits to make (example):
- Move large non-critical component into dynamic import
- Remove duplicate Tailwind classes in a shared component
