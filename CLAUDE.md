# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 작업 규칙

1. 채팅은 모두 한국어로 진행한다.
2. 코드는 최대한 효율적으로 짠다. 스파게티 코드가 되지 않도록 용도에 따라 폴더를 적절히 분류한다.
3. 코드 설계·기획·피드백은 claude-opus-4-6으로, 코드 작성은 claude-sonnet-4-6으로 한다.
4. 파일을 교차읽기하거나 심화해서 얻어야 하는 정보가 아니면 CLAUDE.md에 추가하지 않는다.

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
title → corridor → morningNav → phaseIntro → consultation → dayEnd → eveningNav → (loop or complete)
                                     ↑                          ↓
                              interlude (optional, before some episodes)
```

- `corridor` — CorridorScene: first encounter with senior, player name input
- `morningNav` / `eveningNav` — NavigationScreen: pixel-art hospital exploration
- `interlude` — peer/senior dialogue between episodes (triggered by `interludeBefore` in episode definition)
- After final episode: `complete` screen

### Three-Phase Progression

- **Phase 1** (3 episodes): Linear scripted dialogue. Single choice per turn, senior guide mentoring. No player agency in question direction.
- **Phase 2** (3 episodes): Branching dialogue with `pivots`/`continue` system. Choices have `family` (medical/life/emotional) and `intent` fields. `firstChoices` for initial turn, then pivot-based choices with continuity tracking via `lastFamily`. NotebookPanel introduced.
- **Phase 3** (3 episodes): Adds turn limits (`maxTurns`=8), overtime tracking, and rapport gating (`rapportGating` with threshold/families). Gated responses and closing variants unlock based on `rapportCount`.

### Key Data Flow

- **Episode definitions**: `src/data/allEpisodes.js` — master list with patient metadata, phase config, script imports, and inline interlude definitions
- **Scripts**: `src/data/phases/phase{1,2,3}/scripts/ep*.json` — dialogue trees with turns, choices, responses, senior guides, inner voice, and day-end extras
- **Hospital map**: `src/data/hospitalMap.js` — 3-floor layout (외래/병동/의국) with rooms, NPCs, interaction ranges, and `CLINIC_IDS` that trigger episode start

### Components & Hooks

- `App.jsx` — Screen router based on `game.screen`; renders `NotebookPanel` alongside `ConsultationScreen` for Phase 2+
- `useGame.js` — All game state and logic. Returns a flat object consumed by components. `send()` handles Phase 1 (no arg) and Phase 2+ (choice object). Key helpers: `computeChoices()`, `buildDayEnd()`, `resetScript()`
- `ConsultationScreen` — Opening→playing→closing→done lifecycle via `useEffect` chains. Shows last 4 messages with fade, emotion orb, turn indicator dots (Phase 3), inner voice (Phase 2+)
- `NavigationScreen` — Pixel-art side-scrolling hospital. Real-time movement via `useHospitalNavigation.js`. Morning nav: entering clinic starts episode; Evening nav: exiting left on floor 1 ends day
- `NotebookPanel` — Toggle panel (📓 button) with patient chart + memo textarea. First appearance shows hint pulse
- `InterludeScene` — Sequential character dialogue with player reaction choices and `afterReaction` lines

### Script JSON Structure

**Phase 1 turns:** `{ choice, response, seniorGuide: { text, timing, tone } }`

**Phase 2+ turns:**
```json
{
  "firstChoices": [{ "tag", "family", "label", "text", "intent" }],
  "pivots": [{ "tag", "family", "label", "text", "intent" }],
  "continue": { "after_medical": { "family", ... }, "after_life": { ... }, "after_emotional": { ... } },
  "responses": {
    "[intent]": { "text", "emotion", "innerVoice", "gatedResponse": { "text", "emotion" } }
  }
}
```

Scripts also contain: `opening`, `closing`, `closingGated` (Phase 3), `dayEndExtra: { unasked: { [family]: hint }, lastScene, lastSceneGated }`.

## ESLint

- Unused vars error is configured to ignore variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- Uses `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## Style Conventions

- All styling is inline (no CSS modules or styled-components) with a dark color palette centered on `#1A1815`/`#2A2520` backgrounds and `#E8E0D0` text
- Korean language throughout the UI (HTML lang="ko")
- Fonts: Noto Serif KR for patient/narrative text, system-ui for UI elements, D2Coding for NotebookPanel
- Emotion system maps states (neutral, anxious, guarded, warming, opened, distressed) to colors and orb scales
- NavigationScreen uses time-of-day palette: bright for morning nav, dim for evening nav
