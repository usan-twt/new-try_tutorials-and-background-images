// Phase별 진료 평가 시스템
// Phase 1(튜토리얼): 고정 기본급 / Phase 2+: 오버타임 횟수로 등급 판정

const GRADE_EFFECTS = {
  high:   { economyDelta:  8, profRelationDelta:  8 },
  normal: { economyDelta:  0, profRelationDelta:  0 },
  low:    { economyDelta: -8, profRelationDelta: -8 },
}

// phase: 완료된 Phase 번호 / overtimeCount: 해당 Phase 내 오버타임 발생 환자 수
// 반환: { grade, economyDelta, profRelationDelta }
//   grade === null → Phase 1 튜토리얼 (UI에 등급 미표시)
export function evaluatePhase(phase, overtimeCount) {
  if (phase <= 1) {
    return { grade: null, economyDelta: 3, profRelationDelta: 0 }
  }

  let grade
  if (overtimeCount === 0)      grade = 'high'
  else if (overtimeCount === 1) grade = 'normal'
  else                          grade = 'low'

  return { grade, ...GRADE_EFFECTS[grade] }
}
