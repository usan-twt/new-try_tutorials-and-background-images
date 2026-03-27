# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 작업 규칙

1. 채팅은 모두 한국어로 진행한다.
2. 코드는 최대한 효율적으로 짠다. 스파게티 코드가 되지 않도록 용도에 따라 폴더를 적절히 분류한다.
3. 코드 설계·기획·피드백은 claude-opus-4-6으로, 코드 작성은 claude-sonnet-4-6으로 한다.
4. 파일을 교차읽기하거나 심화해서 얻어야 하는 정보가 아니면 CLAUDE.md에 추가하지 않는다.

## Project Overview

"INTERN" — a Korean-language medical consultation simulation game built with React + Vite. Players take on the role of a medical intern conducting patient consultations across five progressive phases, each introducing more complex dialogue mechanics.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build (output to `dist/`)
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — Preview production build

테스트 인프라(Vitest/Jest 등) 미설치. 테스트 파일 없음.

## Architecture

### Game Flow (Finite State Machine)

The app is a screen-based FSM managed entirely in `src/hooks/useGame.js`. Core `TRANSITIONS` object handles the main path; `morningNav`/`eveningNav`/`apartment` are injected via direct `setScreen()` calls.

```
title → corridor → morningNav → phaseIntro → consultation
                                     ↑              ↓ (phase end)
                              interlude ←────── eveningNav → dayEnd
                                                               ↓
                                                   apartment (if dayConfig[day].showApartment)
                                                               ↓
                                          interlude / morningNav / consultation / complete
```

- `corridor` — `CorridorScene` 컴포넌트; 선배와의 첫 대화 + 플레이어 이름 입력 후 `morningNav`로 전환 (guided tour; `guidedTourDone` flag set on exit)
- `morningNav` → `phaseIntro` on clinic entry; `eveningNav` → `dayEnd` on floor-1 left exit
- `apartment` — shown after phase-end days (day 3, 5, 7, 10); appearance and content driven by `economy` tier
- `news` — Phase 4/5 진입 시 뉴스 브로드캐스트 화면 (`NewsScreen`); `eventContext` 기반 이벤트 소개
- `interlude` — NPC dialogue scene, triggered by `interludeBefore` in episode definition; `postInterludeScreen` determines where to go after
- After final episode: `complete` screen

### Five-Phase Progression

- **Phase 1** (3 episodes): Linear scripted dialogue. Single choice per turn, senior guide mentoring. No player agency in question direction.
- **Phase 2** (3 episodes): Branching dialogue with `pivots`/`continue` system. Choices have `family` (medical/life/emotional) and `intent` fields. `firstChoices` for initial turn, then pivot-based choices with continuity tracking via `lastFamily`. NotebookPanel introduced.
- **Phase 3** (3 episodes): Adds turn limits (`maxTurns`=8), overtime tracking, and rapport gating (`rapportGating` with threshold/families). Gated responses and closing variants unlock based on `rapportCount`.
- **Phase 4** (15 episodes, Day 6–8): 집단 식중독 사건 이벤트. `minTurns`/`maxTurns` 범위(7–12턴), `eventContext: 'food_poisoning'|null`. 하루 총 35턴 예산(`dayBudgets`). 선택지에 `requiresFamily`(특정 family 사용 후만 노출)/`requiresContext`(현재 `eventContext` 일치 시만 노출) 조건 추가. Phase 평가: `dailyPatientCounts` 배열로 `[(count - N) + 2] × 2` 합산 (`PHASE_N[4] = 5`).
- **Phase 5** (24 episodes, Day 9–11): 독감 유행 이벤트. `minTurns`/`maxTurns` 범위(7–10턴), `eventContext: 'flu'|null`. 하루 총 60턴 예산. `appearance` family 추가. `PHASE_N[5] = 8`.

### Key Data Flow

- **Episode definitions**: `src/data/allEpisodes.js` — master list with patient metadata, phase config, script imports, inline interlude definitions, and `dayBudgets` (totalTurns per day) / `dayConfig` (showApartment per day)
- **Scripts**: `src/data/phases/phase{1,2,3,4,5}/scripts/ep*.json` — dialogue trees with turns, choices, responses, senior guides, inner voice, and day-end extras
- **Evaluation**: `src/data/evaluationData.js` — `evaluatePhase(phase, overtimeCount, opts)` returns `{grade, economyDelta, profRelationDelta}`; Phase 4+ uses `opts.dailyPatientCounts` with `PHASE_N` baseline
- **Apartment data**: `src/data/apartmentData.js` — tier thresholds, entry/window/phone texts, `getBankEntries()`, `INTERACTION_POINTS` (% coordinates per tier), `BG_IMAGES`/`BG_COLORS`
- **News events**: `src/data/newsEvents.js` — `NEWS_EVENTS` keyed by event id (`food_poisoning`, `flu`); used by `NewsScreen`
- **Hospital map**: `src/data/hospitalMap.js` — 3-floor layout (외래/병동/의국) with rooms, NPCs, interaction ranges, and `CLINIC_IDS` that trigger episode start
- **NPC dialogues**: `src/data/corridorEvents.js` — corridor NPC lines keyed by NPC id + time-of-day (morning/evening) + relation level (hostile/neutral/favorable)
- **Meal scenes**: `src/data/mealScenes.js` — economy-tier-based meal interlude text pools; `getMealInterlude(economy)` randomly picks one scene per tier; used for `type:'meal'` interlude placeholders
- **Corporate hospital events**: `src/data/corporateHospitalEvents.js` — 3-channel system: `SENIOR_ADVICE` (social channel, InterludeScene), `NURSE_RUMOR` (rumor channel, corridor popup on Phase 3 entry), `PERFORMANCE_NOTICE` (document channel, DocumentOverlay after game complete)

### Components & Hooks

- `App.jsx` — Screen router based on `game.screen`; renders `NotebookPanel` alongside `ConsultationScreen` for Phase 2+; routes `news` screen to `NewsScreen`
- `CorridorScene` — 플레이어 첫 등장 장면. 선배와의 순차 대사 + 이름 입력 프롬프트(`namePrompt` flag). `onNameSet` 콜백으로 `playerName` 전달
- `NewsScreen` — Phase 4/5 이벤트 진입 시 뉴스 방송 연출 (ticker→headline→body 순차 fade-in). `NEWS_EVENTS[event]` 데이터 사용
- `useGame.js` — All game state and logic. Returns a flat object consumed by components. `send()` handles Phase 1 (no arg) and Phase 2+ (choice object). Key helpers: `computeChoices()`, `buildDayEnd()`, `resetScript()`
- `ConsultationScreen` — Opening→playing→closing→done lifecycle via `useEffect` chains. Shows last 4 messages with fade, emotion orb, turn indicator dots (Phase 3), inner voice (Phase 2+)
- `NavigationScreen` — Pixel-art side-scrolling hospital. Real-time movement via `useHospitalNavigation.js` (60fps rAF 게임 루프, WASD 이동). Morning nav: entering clinic starts episode; Evening nav: exiting left on floor 1 ends day. `useHospitalNavigation`은 가이드 투어 waypoint 시스템, NPC 근접 상호작용, 층 전환, 아침/저녁 팔레트 전환, pendingDocument 표시, Phase 3 진입 시 nurse rumor 팝업을 모두 내부에서 처리하며 NavigationScreen에 콜백으로 노출
- `ApartmentScreen` — Post-phase apartment scene. Shows entry text, window/phone interaction points. Content driven by `apartmentTier` (반지하/원룸/투룸). Phone shows bank overlay (`getBankEntries`). Pending move (tier change) shown on entry.
- `DayEndScreen` — Phase-end summary: accumulated patients, unasked family hints, lastScene snippets, overtime notes, evaluation grade (Phase 2+)
- `NotebookPanel` — Toggle panel (📓 button) with patient chart + memo textarea. First appearance shows hint pulse
- `InterludeScene` — Sequential character dialogue with player reaction choices and `afterReaction` lines
- `DocumentOverlay` — Full-screen document overlay for `pendingDocument` (PERFORMANCE_NOTICE); shown in morningNav

### Script JSON Structure

**Phase 1 turns:** `{ choice, response, seniorGuide: { text, timing, tone } }`

**Phase 2+ turns:**
```json
{
  "firstChoices": [{ "tag", "family", "label", "text", "intent" }],
  "pivots": [{ "tag", "family", "label", "text", "intent", "priority", "requiresFamily", "requiresContext" }],
  "continue": { "after_medical": { "family", ... }, "after_life": { ... }, "after_emotional": { ... }, "after_appearance": { ... } },
  "responses": {
    "[intent]": { "text", "emotion", "innerVoice", "gatedResponse": { "text", "emotion" } }
  }
}
```

Scripts also contain: `opening`, `closing`, `closingGated` (Phase 3+), `dayEndExtra: { unasked: { [family]: hint }, lastScene, lastSceneGated }`.

Choice filtering in `computeChoices()`: `priority` 낮은 선택지는 `turnsRemaining≤2` 시 제거; `requiresFamily`는 `usedFamilies` Set에 있을 때만 노출; `requiresContext`는 현재 에피소드 `eventContext`와 일치 시만 노출.

### Economy & Relation Systems

All numeric systems use 0–100 scale, starting at 50.

**Economy** (`economy` state):
- Determines `apartmentTier`: 반지하 (0–30), 원룸 (31–70), 투룸 (71–100)
- Phase 1 completion: +3 (고정)
- Phase 2–3 completion: grade-based ±8 via `evaluatePhase(phase, overtimeCount)`
  - `high` (0 overtime): +8 economy, +8 professor relation
  - `normal` (1 overtime): no change
  - `low` (2+ overtime): −8 economy, −8 professor relation
- Phase 4+ completion: `evaluatePhase(phase, _, { dailyPatientCounts })` → 매일 `[(count - N) + 2] × 2` 합산. `PHASE_N = { 4: 5, 5: 8 }`

**Relations** (`professorRelation`, `nurseRelation`):
- Levels: hostile (0–33), neutral (34–66), favorable (67–100)
- Professor: changes on phase evaluation (above)
- Nurse: +5 per episode when rapport threshold met (`episodeNurseDelta`), −5 via `phaseRelationDelta` if 2+ overtimes
- Displayed in NavigationScreen NPC dialogues (via `corridorEvents.js`)

## ESLint

- Unused vars error is configured to ignore variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- Uses `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## Style Conventions

- All styling is inline (no CSS modules or styled-components) with a dark color palette centered on `#1A1815`/`#2A2520` backgrounds and `#E8E0D0` text
- Korean language throughout the UI (HTML lang="ko")
- Fonts: Noto Serif KR for patient/narrative text, system-ui for UI elements, D2Coding for NotebookPanel
- Emotion system maps states (neutral, anxious, guarded, warming, opened, distressed) to colors and orb scales
- NavigationScreen uses time-of-day palette: bright for morning nav, dim for evening nav
