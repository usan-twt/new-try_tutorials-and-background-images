# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"INTERN" — a Korean-language medical consultation simulation game built with React + Vite. Players take on the role of a medical intern conducting patient consultations across three progressive phases, each introducing more complex dialogue mechanics.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build (output to `dist/`)
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — Preview production build

## Architecture

### Game Flow (Finite State Machine)

The app is a screen-based FSM managed entirely in `src/hooks/useGame.js`. Screen transitions:

```
title → phaseIntro → consultation → dayEnd → interlude (optional) → back to consultation or phaseIntro
                                                                    → complete (after final episode)
```

### Three-Phase Progression

- **Phase 1** (episodes 1-2): Linear scripted dialogue. Single choice per turn, senior guide mentoring. No player agency in question direction.
- **Phase 2** (episodes 3-5): Branching dialogue with `pivots`/`continue` system. Choices have `family` (medical/life/emotional) and `intent` fields. `firstChoices` for initial turn, then pivot-based choices with continuity tracking via `lastFamily`.
- **Phase 3** (episodes 6-8): Adds turn limits (`maxTurns`), overtime tracking, and rapport gating (`rapportGating` with threshold/families). Gated responses and closing variants unlock based on rapport score.

### Key Data Flow

- **Episode definitions**: `src/data/allEpisodes.js` — master list with patient metadata, phase config, and script imports
- **Scripts**: `src/data/phases/phase{1,2,3}/scripts/ep*.json` — dialogue trees with turns, choices, responses, senior guides, inner voice, and day-end extras
- **Interludes**: Defined inline in `allEpisodes.js` — peer character dialogue between episodes, triggered by `interludeBefore` field on episodes

### Components

- `App.jsx` — Screen router, delegates to screen components based on `game.screen`
- `ConsultationScreen` — Main gameplay screen; handles opening→playing→closing→done lifecycle via `useEffect` chains. Shows last 4 messages with fade effect, emotion orb, turn indicator, and choice buttons
- `useGame.js` — All game state and logic. Returns a flat object consumed by components. Contains the `send()` function which handles both Phase 1 (no choice arg) and Phase 2+ (choice object arg) patterns

### Script JSON Structure

Phase 1 turns use `{ choice, response, seniorGuide }`. Phase 2+ turns use `{ pivots, continue, firstChoices, responses: { [intent]: { text, emotion, innerVoice, gatedResponse } } }`. Scripts also contain `opening`, `closing`, `closingGated`, and `dayEndExtra` (with `unasked` and `lastScene` fields).

## ESLint

- Unused vars error is configured to ignore variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- Uses `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## Style Conventions

- All styling is inline (no CSS modules or styled-components) with a dark color palette centered on `#1A1815`/`#2A2520` backgrounds and `#E8E0D0` text
- Korean language throughout the UI (HTML lang="ko")
- Font: Noto Serif KR for patient/narrative text, system-ui for UI elements
- Emotion system maps states (neutral, anxious, guarded, warming, opened, distressed) to colors and orb scales
