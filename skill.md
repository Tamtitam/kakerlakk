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
- Before adding aria-label, verify that the element's implicit or explicit role allows an accessible name.
- Use <button> instead of div role="button" when possible.
- Use visible <label> elements for form fields when possible.
- Use aria-label only when there is no visible label AND the element's role supports an accessible name.
- Do not use aria-hidden="true" on focusable elements.
- Do not reference IDs that do not exist.
- Do not claim that the code is fully WCAG compliant without manual testing.
- Remove `aria-label` when it is used on elements or roles that do not support accessible names.
- Before adding or keeping `aria-label`, verify that the element's implicit or explicit role allows an accessible name.
- If `aria-label` is invalid or unnecessary, remove it and prefer visible text, semantic HTML, `aria-labelledby`, `aria-describedby`, or a labelled wrapper when appropriate.

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