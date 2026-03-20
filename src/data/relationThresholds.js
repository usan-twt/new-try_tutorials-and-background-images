// 관계 수준 경계값 (0~100 스케일)
// hostile: 0~33 / neutral: 34~66 / favorable: 67~100
const HOSTILE_MAX = 33
const FAVORABLE_MIN = 67

export function getRelationLevel(value) {
  if (value <= HOSTILE_MAX) return 'hostile'
  if (value >= FAVORABLE_MIN) return 'favorable'
  return 'neutral'
}

// 에피소드 완료 시: 라포 달성 여부 → 간호사 관계 변동
// rapportGating이 없으면 기본 threshold 2로 판단
export function episodeNurseDelta(rapportCount, rapportGating) {
  const threshold = rapportGating?.threshold ?? 2
  return rapportCount >= threshold ? 5 : 0
}

// Phase 완료 시: 오버타임 횟수 → 교수/간호사 관계 변동
// 오버타임 없음 → 교수 ↑ / 오버타임 다수 → 교수 ↓
export function phaseRelationDelta(overtimeCount) {
  if (overtimeCount === 0) return { professor: 5, nurse: 0 }
  if (overtimeCount <= 1) return { professor: 0, nurse: 0 }
  return { professor: -5, nurse: 0 }
}

export function applyRelationDelta(current, delta) {
  return Math.min(100, Math.max(0, current + delta))
}
