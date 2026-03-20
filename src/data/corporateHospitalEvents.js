// 기업 병원 제도 점진적 노출 — 3채널 콘텐츠
// 노출 시점: Phase 3 시작 전후 (morningNav 진입 시 또는 interlude로)

// ── 사회화 채널: InterludeScene에서 사용 (allEpisodes.interludes에 등록) ──
export const SENIOR_ADVICE = {
  character: '박 선배',
  lines: [
    { speaker: '박 선배', text: '3주차 됐네.' },
    { speaker: '박 선배', text: '이 병원, 외래 숫자 꽤 본다. 위에서 다 보고 있거든.', pause: true },
    { speaker: '박 선배', text: '오버타임 나오면 기록에 남아. 빠르게 보는 게 나쁜 건 아니야.' },
    { speaker: '박 선배', text: '핵심만 짚는 연습 해봐.' },
  ],
  reactions: [
    { text: '알겠어요.', tone: 'compliant' },
    { text: '그래도 환자마다 다른 것 같아서요.', tone: 'principled' },
  ],
  afterReaction: [
    { speaker: '박 선배', text: '뭐, 이 일이 그렇잖아.' },
    { speaker: '박 선배', text: '어쨌든 잘 해봐.', pause: true },
  ],
}

// ── 소문 채널: 복도 자동 대화 (morningNav 진입 시 1회 표시) ──
export const NURSE_RUMOR = {
  name: '(복도)',
  text: '"외래 숫자 또 올렸다며?" "어. 월말에 또 평가한대." "선생님들 힘드시겠다." "우린 더 힘들지."',
}

// ── 제도 채널: 공식 문서 오버레이 ──
export const PERFORMANCE_NOTICE = {
  title: '외래 진료 효율화 안내',
  date: '3월',
  body: [
    '외래 진료의 효율적 운영을 위해 진료 시간 관리 시스템을 도입합니다.',
    '1인당 평균 외래 시간이 기준치를 초과할 경우 운영위원회 검토 대상이 됩니다.',
    '협조 부탁드립니다.',
  ],
  sender: '병원 운영팀',
}
