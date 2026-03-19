// ── 등급 정의 ──
export const APARTMENT_TIERS = {
  basement: { min: 0,  max: 30, label: '반지하' },
  studio:   { min: 31, max: 70, label: '원룸' },
  twoRoom:  { min: 71, max: 100, label: '투룸' },
}

export function getApartmentTier(economy) {
  if (economy <= 30) return 'basement'
  if (economy <= 70) return 'studio'
  return 'twoRoom'
}

// ── 등급별 텍스트 풀 ──
export const entryTexts = {
  basement: ['계단을 내려간다.', '문을 열자 눅눅한 냄새가 올라온다.', '형광등이 깜빡인다.'],
  studio:   ['집에 돌아왔다.', '신발을 벗고 불을 켠다.', '좁지만 익숙한 공간.'],
  twoRoom:  ['집에 돌아왔다.', '넓은 창 너머로 불빛이 보인다.', '조용한 밤이다.'],
}

export const windowTexts = {
  basement: [
    '발소리가 지나간다.',
    '빗물이 창틀 아래로 흐른다.',
    '가로등 불빛이 천장에 비친다.',
    '누군가 윗층에서 문을 닫는 소리.',
  ],
  studio: [
    '맞은편 편의점 불빛이 보인다.',
    '누군가 자전거를 끌고 간다.',
    '골목이 조용해지고 있다.',
    '멀리서 구급차 소리가 난다.',
  ],
  twoRoom: [
    '멀리 한강 불빛이 보인다.',
    '도시가 조용해지고 있다.',
    '높은 곳에서 보면 모든 불빛이 비슷하다.',
    '바람이 분다.',
  ],
}

// ── 통장 잔고 매핑 ──
export function economyToBalance(economy) {
  // 0 → 약 -200,000원 / 50 → 약 1,200,000원 / 100 → 약 5,000,000원
  const base = -200000
  const range = 5200000
  return Math.round(base + (economy / 100) * range)
}

const expenseItems = {
  basement: [
    { label: '편의점', amount: 3200 },
    { label: '교통', amount: 1250 },
  ],
  studio: [
    { label: '배달', amount: 12000 },
    { label: '편의점', amount: 4500 },
  ],
  twoRoom: [
    { label: '마트', amount: 45000 },
    { label: '카페', amount: 5500 },
  ],
}

export function getBankEntries(tier, economy) {
  const balance = economyToBalance(economy)
  const salary = 2500000
  const rent = tier === 'basement' ? 300000 : tier === 'studio' ? 450000 : 700000
  const items = expenseItems[tier] || expenseItems.studio
  return { balance, salary, rent, items }
}

// ── 플레이스홀더 배경색 (이미지 제공 전) ──
export const BG_COLORS = {
  basement: '#1A1A1A',
  studio:   '#2A2520',
  twoRoom:  '#2A2A30',
}

// ── 상호작용 포인트 위치 (이미지 맞춰 추후 조정) ──
export const INTERACTION_POINTS = {
  basement: {
    phone:  { top: '60%', left: '20%', width: '15%', height: '12%' },
    window: { top: '15%', left: '50%', width: '30%', height: '20%' },
  },
  studio: {
    phone:  { top: '55%', left: '25%', width: '12%', height: '10%' },
    window: { top: '10%', left: '45%', width: '35%', height: '25%' },
  },
  twoRoom: {
    phone:  { top: '50%', left: '30%', width: '10%', height: '8%' },
    window: { top: '5%',  left: '40%', width: '40%', height: '30%' },
  },
}

// ── 경제 변동 계산 ──
export function calculateEconomyDelta(patientsCompleted) {
  const basePay = 5
  const expense = -8
  const patientBonus = patientsCompleted * 2
  return basePay + expense + patientBonus
}
