# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio website of Julian Rohde (Fachinformatiker-Azubi). Plain static HTML/CSS/JavaScript — no build step, no package manager, no tests, no linter. Open `index.html` directly in a browser (or serve the folder with any static server) to view changes. All visible content is in German.

## Architecture

- `index.html` — single landing page with sections `#about`, `#skills`, `#projects`, `#experience`, `#contact`.
- `projekte/*.html` — one detail page per project. They are standalone copies of the same skeleton (nav, theme picker, footer) and reference shared assets via `../style.css` and `../script.js`. Changes to the nav or theme picker in `index.html` must be mirrored in every page under `projekte/`.
- `style.css` — shared by all pages. Colors are CSS custom properties on `:root`; themes override them via `[data-theme="light"]` and `[data-theme="blue"]` (blue matches the JR logo in `images/profil.jpg`). Add new colors as tokens and define them for all three themes.
- `script.js` — shared by all pages, so every feature must null-check its elements (e.g. the typing effect and `#year` only exist on some pages). Contains:
  - theme picker (`dark` / `light` / `blue`), persisted in `localStorage` under `theme`
  - `.reveal` scroll animations via IntersectionObserver
  - `[data-count]` number count-up in the hero
  - `.typed` word rotation from `data-words`
  - project filter: `.filter[data-filter]` buttons toggle `.hidden` on `.project[data-cat]`
  - `[data-github]` links with an empty `href` are disabled and relabeled "Repository folgt"

## Conventions

- Adding a project requires: a card in `index.html` (`data-cat` matching a filter, a `project-visual vN` gradient class defined in `style.css`, a "Mehr erfahren" link) plus a new page in `projekte/` copied from an existing one.
- GitHub repo links are set per detail page in the `href` of the `[data-github]` anchor.
- Contact email and social links in `index.html` are still placeholders.
- Don't invent project details; the content source was the user's own description of their projects.
