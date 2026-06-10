---
name: aria-accessibility-fixer
description: Use this skill when reviewing or fixing ARIA usage in a frontend repository.
---

# ARIA Accessibility Fixer

## Goal

Review frontend code and improve ARIA usage.

The skill should:
- find missing ARIA where it is needed
- add correct ARIA attributes
- remove unnecessary ARIA
- fix wrong or invalid ARIA usage
- prefer semantic HTML before ARIA

## Rules

- Do not add ARIA everywhere.
- Prefer native HTML elements before ARIA.
- Use <button> instead of div role="button" when possible.
- Use visible <label> elements for form fields when possible.
- Use aria-label only when there is no visible text label.
- Do not use aria-hidden="true" on focusable elements.
- Do not reference IDs that do not exist.
- Do not claim that the code is fully WCAG compliant without manual testing.

## What to check

Look for:
- missing labels on form fields
- icon-only buttons without accessible names
- unclear links
- wrong role usage
- unnecessary ARIA on native elements
- invalid ARIA values
- missing aria-expanded on expandable controls
- missing aria-invalid or error connection on form errors
- dynamic messages that may need role="status" or aria-live

## Workflow

1. Scan relevant frontend files.
2. Find ARIA and semantic HTML issues.
3. Prefer semantic HTML fixes first.
4. Add ARIA only when needed.
5. Remove unnecessary or wrong ARIA.
6. Summarize what was changed.
7. Suggest manual accessibility tests.

## Output format

Respond with:

### Summary

### Files checked

### Issues found

### Fixes made

### ARIA removed

### Remaining questions

### Suggested manual tests