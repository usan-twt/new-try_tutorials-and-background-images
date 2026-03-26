// Phase별 진료 평가 시스템
// Phase 1(튜토리얼): 고정 기본급 / Phase 2-3: 오버타임 횟수로 등급 판정
// Phase 4+: [(본 환자 수 - N) + 2] × 2 매일 계산 후 누산

const GRADE_EFFECTS = {
  high:   { economyDelta:  8, profRelationDelta:  8 },
  normal: { economyDelta:  0, profRelationDelta:  0 },
  low:    { economyDelta: -8, profRelationDelta: -8 },
}

// N: 해당 Phase의 하루 최대 기준 환자 수
export const PHASE_N = { 4: 5, 5: 8 }

// phase: 완료된 Phase 번호
// overtimeCount: Phase 2-3용 오버타임 환자 수
// opts.dailyPatientCounts: Phase 4+용 하루별 진료 환자 수 배열 (ex. [4, 5, 3])
// 반환: { grade, economyDelta, profRelationDelta }
export function evaluatePhase(phase, overtimeCount, opts = {}) {
  if (phase <= 1) {
    return { grade: null, economyDelta: 3, profRelationDelta: 0 }
  }

  if (phase <= 3) {
    let grade
    if (overtimeCount === 0)      grade = 'high'
    else if (overtimeCount === 1) grade = 'normal'
    else                          grade = 'low'
    return { grade, ...GRADE_EFFECTS[grade] }
  }

  // Phase 4+: 매일 [(본 환자 수 - N) + 2] × 2 계산 후 합산
  const { dailyPatientCounts = [] } = opts
  const N = PHASE_N[phase] ?? 5
  let total = 0
  for (const count of dailyPatientCounts) {
    total += (count - N + 2) * 2
  }
  return { grade: null, economyDelta: total, profRelationDelta: 0 }
}
