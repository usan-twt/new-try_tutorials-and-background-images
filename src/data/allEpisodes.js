import { SENIOR_ADVICE } from './corporateHospitalEvents'
import ep1_1 from './phases/phase1/scripts/ep1_1.json'
import ep1_2 from './phases/phase1/scripts/ep1_2.json'
import ep1_3 from './phases/phase1/scripts/ep1_3.json'
import ep2_1 from './phases/phase2/scripts/ep2_1.json'
import ep2_2 from './phases/phase2/scripts/ep2_2.json'
import ep2_3 from './phases/phase2/scripts/ep2_3.json'
import ep3_1 from './phases/phase3/scripts/ep3_1.json'
import ep3_2 from './phases/phase3/scripts/ep3_2.json'
import ep3_3 from './phases/phase3/scripts/ep3_3.json'
import ep4_1 from './phases/phase4/scripts/ep4_1.json'
import ep4_2 from './phases/phase4/scripts/ep4_2.json'
import ep4_3 from './phases/phase4/scripts/ep4_3.json'
import ep4_4 from './phases/phase4/scripts/ep4_4.json'
import ep4_5 from './phases/phase4/scripts/ep4_5.json'
import ep4_6 from './phases/phase4/scripts/ep4_6.json'
import ep4_7 from './phases/phase4/scripts/ep4_7.json'
import ep4_8 from './phases/phase4/scripts/ep4_8.json'
import ep4_9 from './phases/phase4/scripts/ep4_9.json'
import ep4_10 from './phases/phase4/scripts/ep4_10.json'
import ep4_11 from './phases/phase4/scripts/ep4_11.json'
import ep4_12 from './phases/phase4/scripts/ep4_12.json'
import ep4_13 from './phases/phase4/scripts/ep4_13.json'
import ep4_14 from './phases/phase4/scripts/ep4_14.json'
import ep4_15 from './phases/phase4/scripts/ep4_15.json'
import ep5_1 from './phases/phase5/scripts/ep5_1.json'
import ep5_2 from './phases/phase5/scripts/ep5_2.json'
import ep5_3 from './phases/phase5/scripts/ep5_3.json'
import ep5_4 from './phases/phase5/scripts/ep5_4.json'
import ep5_5 from './phases/phase5/scripts/ep5_5.json'
import ep5_6 from './phases/phase5/scripts/ep5_6.json'
import ep5_7 from './phases/phase5/scripts/ep5_7.json'
import ep5_8 from './phases/phase5/scripts/ep5_8.json'
import ep5_9 from './phases/phase5/scripts/ep5_9.json'
import ep5_10 from './phases/phase5/scripts/ep5_10.json'
import ep5_11 from './phases/phase5/scripts/ep5_11.json'
import ep5_12 from './phases/phase5/scripts/ep5_12.json'
import ep5_13 from './phases/phase5/scripts/ep5_13.json'
import ep5_14 from './phases/phase5/scripts/ep5_14.json'
import ep5_15 from './phases/phase5/scripts/ep5_15.json'
import ep5_16 from './phases/phase5/scripts/ep5_16.json'
import ep5_17 from './phases/phase5/scripts/ep5_17.json'
import ep5_18 from './phases/phase5/scripts/ep5_18.json'
import ep5_19 from './phases/phase5/scripts/ep5_19.json'
import ep5_20 from './phases/phase5/scripts/ep5_20.json'
import ep5_21 from './phases/phase5/scripts/ep5_21.json'
import ep5_22 from './phases/phase5/scripts/ep5_22.json'
import ep5_23 from './phases/phase5/scripts/ep5_23.json'
import ep5_24 from './phases/phase5/scripts/ep5_24.json'

export const dayBudgets = {
  4: { totalTurns: 10, episodes: ['phase3_ep1', 'phase3_ep2'] },
  // Phase 4 — 하루 총 35턴
  6: { totalTurns: 35 },
  7: { totalTurns: 35 },
  8: { totalTurns: 35 },
  // Phase 5 — 하루 총 60턴
  9: { totalTurns: 60 },
  10: { totalTurns: 60 },
  11: { totalTurns: 60 },
}

export const dayConfig = {
  1: { showApartment: false },
  2: { showApartment: false },
  3: { showApartment: true },
  4: { showApartment: false },
  5: { showApartment: true },
  // Phase 4
  6: { showApartment: false },
  7: { showApartment: true },
  8: { showApartment: false },
  // Phase 5
  9: { showApartment: false },
  10: { showApartment: true },
  11: { showApartment: false },
}

export const interludes = {
  // 식사 인터루드: type:'meal' placeholder — useGame.js에서 economy 기반으로 실제 텍스트 주입
  meal_day4: { type: 'meal' },
  meal_day6: { type: 'meal' },
  meal_day7: { type: 'meal' },
  meal_day8: { type: 'meal' },
  meal_day9: { type: 'meal' },
  meal_day10: { type: 'meal' },
  meal_day11: { type: 'meal' },
  // 사회화 채널: Phase 3 시작 전 선배 조언 (corporateHospitalEvents.js)
  senior_advice: SENIOR_ADVICE,

  after_phase1: {
    character: '선배',
    lines: [
      { speaker: '선배', text: '오늘 하루 수고했어.' },
      { speaker: '선배', text: '아까 환자들 기억나? 증상만 물어봤지?' },
      { speaker: '선배', text: '근데 사람이 아프면, 그게 생활이랑 연결돼 있을 때가 많아.', pause: true },
      { speaker: '선배', text: '가족이 어떤지, 직장에서 뭘 하는지... 그런 걸 알면 보이는 게 달라져.' },
      { speaker: '선배', text: '내일부터는 네가 직접 뭘 물어볼지 골라야 돼.', pause: true },
      { speaker: '선배', text: '나 내일 컨퍼런스 때문에 같이 못 들어가.' },
      { speaker: '선배', text: '걱정되니까, 이거 하나 줄게.', pause: true },
      { type: 'notebook', pause: true },
      { speaker: '선배', text: '수첩이야. 환자 기본 정보가 적혀 있어. 이름, 나이, 주증상 같은 거.' },
      { speaker: '선배', text: '진료 중에 헷갈리면 펴 봐. 그것만으로도 달라.' },
    ],
    reactions: [
      { text: '좀 긴장되네요.', tone: 'nervous' },
      { text: '해볼게요.', tone: 'confident' },
    ],
    afterReaction: {
      nervous: [
        { speaker: '선배', text: '처음엔 다 그래. 나도 그랬어.' },
        { speaker: '선배', text: '어제 잘했잖아. 할 수 있어.' },
        { speaker: '선배', text: '내일 보자.', pause: true },
      ],
      confident: [
        { speaker: '선배', text: '그래, 그 마음으로 하면 돼.' },
        { speaker: '선배', text: '잘할 거야. 내일 보자.', pause: true },
      ],
    },
  },
  after_ep2_1: {
    character: '동기',
    lines: [
      { speaker: '동기', text: '야, 아까 그 허리 아프신 분 봤어?' },
      { speaker: '동기', text: '나는 생활 쪽으로 물어봤거든. 공장에서 하루 종일 서서 일하신다더라.' },
      { speaker: '동기', text: '근데 진짜 무서운 건 허리가 아니라, 엄마처럼 될까 봐 무서운 거였어.', pause: true },
      { speaker: '동기', text: '넌 어떻게 했어?' },
    ],
    reactions: [
      { text: '나는 증상 위주로 물어봤어.', tone: 'neutral' },
      { text: '나도 비슷하게 들었어.', tone: 'neutral' },
    ],
    afterReaction: [
      { speaker: '동기', text: '그렇구나. 같은 환자인데도 다르게 보이네.' },
      { speaker: '동기', text: '다음 환자 곧 들어올 텐데, 밥이나 빨리 먹자.' },
    ],
  },
  after_ep2_2: {
    character: '동기',
    lines: [
      { speaker: '동기', text: '아까 그 편의점 알바하는 친구 있잖아.' },
      { speaker: '동기', text: '약만 달라고 하길래 좀 당황했는데...' },
      { speaker: '동기', text: '좀 더 들어보니까, 그게 단순한 불면이 아니더라.', pause: true },
      { speaker: '동기', text: '사람마다 다른 게, 같은 걸 물어봐도 다른 답이 나와.' },
    ],
    reactions: [
      { text: '맞아, 나도 좀 느꼈어.', tone: 'neutral' },
      { text: '어렵다, 진짜.', tone: 'neutral' },
    ],
    afterReaction: [
      { speaker: '동기', text: '그치? 점점 감이 오는 것 같기도 하고.' },
    ],
  },
  before_ep3_3: {
    character: '동기',
    lines: [
      { speaker: '동기', text: '아까 그 환자 말이 별로 없더라.' },
      { speaker: '동기', text: '원래 그런 사람도 있어. 처음부터 다 얘기하는 사람이 어딨어.' },
      { speaker: '동기', text: '근데 그런 사람일수록, 한마디가 나오면 그게 진짜인 것 같아.', pause: true },
    ],
    reactions: [
      { text: '기다려보는 수밖에 없겠다.', tone: 'neutral' },
      { text: '어떻게 꺼내게 하지?', tone: 'neutral' },
    ],
    afterReaction: [
      { speaker: '동기', text: '글쎄. 나도 아직 잘 모르겠어.' },
      { speaker: '동기', text: '근데 적어도, 기다려주는 건 할 수 있잖아.' },
    ],
  },
}

// Phase 2-3 에피소드 공통 필드
function ep2(overrides) {
  return { directionTags: true, ...overrides }
}

// Phase 4 에피소드 공통 필드
function ep4(overrides) {
  return { directionTags: true, minTurns: 7, maxTurns: 12, ...overrides }
}

// Phase 5 에피소드 공통 필드
function ep5(overrides) {
  return { directionTags: true, minTurns: 7, maxTurns: 10, ...overrides }
}

const allEpisodes = [
  // ── Phase 1 ──
  {
    id: 'phase1_ep1', phase: 1, day: 1,
    patient: { name: '이정수', age: 62, chiefComplaint: '두통', initialEmotion: 'neutral' },
    script: ep1_1,
  },
  {
    id: 'phase1_ep2', phase: 1, day: 1,
    patient: { name: '박수진', age: 34, chiefComplaint: '소화불량', initialEmotion: 'anxious' },
    script: ep1_2,
  },
  {
    id: 'phase1_ep3', phase: 1, day: 1,
    patient: { name: '김미영', age: 52, chiefComplaint: '만성 피로', initialEmotion: 'neutral' },
    script: ep1_3,
  },
  // ── Phase 2 ──
  ep2({
    id: 'phase2_ep1', phase: 2, day: 2,
    patient: { name: '김영희', age: 47, chiefComplaint: '허리 통증', initialEmotion: 'neutral' },
    script: ep2_1,
    interludeBefore: 'after_phase1',
    dayEndData: { patients: [{ name: '김영희', age: 47, chiefComplaint: '허리 통증' }] },
    notebook: { chart: '김영희 / 47세 / 여 / 주증상: 허리 통증 2주' },
  }),
  ep2({
    id: 'phase2_ep2', phase: 2, day: 2,
    patient: { name: '최민호', age: 22, chiefComplaint: '불면', initialEmotion: 'guarded' },
    script: ep2_2,
    interludeBefore: 'after_ep2_1',
    dayEndData: {
      patients: [
        { name: '김영희', age: 47, chiefComplaint: '허리 통증' },
        { name: '최민호', age: 22, chiefComplaint: '불면' },
      ],
    },
    notebook: { chart: '최민호 / 22세 / 남 / 주증상: 불면 3개월' },
  }),
  ep2({
    id: 'phase2_ep3', phase: 2, day: 3,
    patient: { name: '한복동', age: 71, chiefComplaint: '기침', initialEmotion: 'neutral' },
    script: ep2_3,
    interludeBefore: 'after_ep2_2',
    dayEndData: { patients: [{ name: '한복동', age: 71, chiefComplaint: '기침' }] },
    notebook: { chart: '한복동 / 71세 / 남 / 주증상: 만성 기침 2개월' },
  }),
  // ── Phase 3 ──
  ep2({
    id: 'phase3_ep1', phase: 3, day: 4,
    patient: { name: '오철수', age: 55, chiefComplaint: '어깨 통증', initialEmotion: 'neutral' },
    maxTurns: 8, script: ep3_1,
    interludeBefore: 'senior_advice',
    dayEndData: { patients: [{ name: '오철수', age: 55, chiefComplaint: '어깨 통증' }] },
    notebook: { chart: '오철수 / 55세 / 남 / 주증상: 좌측 어깨 통증 및 운동 제한 1개월' },
  }),
  ep2({
    id: 'phase3_ep2', phase: 3, day: 4,
    patient: { name: '정수아', age: 29, chiefComplaint: '아이 발열', initialEmotion: 'anxious' },
    maxTurns: 8, script: ep3_2,
    interludeBefore: 'meal_day4',
    dayEndData: {
      patients: [
        { name: '오철수', age: 55, chiefComplaint: '어깨 통증' },
        { name: '정수아', age: 29, chiefComplaint: '아이 발열' },
      ],
    },
    notebook: { chart: '정수아 / 29세 / 여 / 아이(14개월) 발열 38.5°C 1일' },
  }),
  ep2({
    id: 'phase3_ep3', phase: 3, day: 5,
    patient: { name: '윤서연', age: 41, chiefComplaint: '불면', initialEmotion: 'guarded' },
    maxTurns: 8,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep3_3,
    interludeBefore: 'before_ep3_3',
    dayEndData: { patients: [{ name: '윤서연', age: 41, chiefComplaint: '불면' }] },
    notebook: { chart: '윤서연 / 41세 / 여 / 주증상: 불면 (기간 미상)' },
  }),
  // ── Phase 4 ── (식중독 사건 이벤트, Day 6–8)
  // Day 6: 집단 식중독 첫날 — 학교 관계자·가족 내원 (5명)
  ep4({
    id: 'phase4_ep1', phase: 4, day: 6,
    patient: { name: '이승아', age: 42, chiefComplaint: '자녀 복통·구토 (대리 내원)', initialEmotion: 'anxious' },
    eventContext: 'food_poisoning',
    script: ep4_1,
    notebook: { chart: '이승아 / 42세 / 여 / 보호자 내원 — 자녀 복통·구토 (어제 급식 후)' },
  }),
  ep4({
    id: 'phase4_ep2', phase: 4, day: 6,
    patient: { name: '김태현', age: 15, chiefComplaint: '복통·구토 (급식 후)', initialEmotion: 'guarded' },
    eventContext: 'food_poisoning',
    script: ep4_2,
    notebook: { chart: '김태현 / 15세 / 남 / 단독 내원 — 복통·구토 (어제 급식 후)' },
  }),
  ep4({
    id: 'phase4_ep3', phase: 4, day: 6,
    patient: { name: '박현자', age: 67, chiefComplaint: '소화불량·식욕 저하', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep4_3,
    interludeBefore: 'meal_day6',
    notebook: { chart: '박현자 / 67세 / 여 / 주증상: 소화불량·식욕 저하 2주' },
  }),
  ep4({
    id: 'phase4_ep4', phase: 4, day: 6,
    patient: { name: '오민준', age: 45, chiefComplaint: '복통·구토, 식중독 감염 우려', initialEmotion: 'anxious' },
    eventContext: 'food_poisoning',
    script: ep4_4,
    notebook: { chart: '오민준 / 45세 / 남 / 급식 조리원 — 복통·구토, 식중독 감염 우려' },
  }),
  ep4({
    id: 'phase4_ep5', phase: 4, day: 6,
    patient: { name: '이준혁', age: 38, chiefComplaint: '지속 기침·가래', initialEmotion: 'neutral' },
    eventContext: null,
    script: ep4_5,
    notebook: { chart: '이준혁 / 38세 / 남 / 주증상: 지속 기침·가래 2주 이상' },
  }),
  // Day 7: 식중독 이틀째 + 일반 환자 (5명)
  ep4({
    id: 'phase4_ep6', phase: 4, day: 7,
    patient: { name: '황도영', age: 51, chiefComplaint: '변비 (3주)', initialEmotion: 'guarded' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep4_6,
    notebook: { chart: '황도영 / 51세 / 남 / 주증상: 변비 3주' },
  }),
  ep4({
    id: 'phase4_ep7', phase: 4, day: 7,
    patient: { name: '최인수', age: 46, chiefComplaint: '복통·구토 (급식 후)', initialEmotion: 'anxious' },
    eventContext: 'food_poisoning',
    script: ep4_7,
    notebook: { chart: '최인수 / 46세 / 남 / 담임교사 — 복통·구토 (어제 급식 후)' },
  }),
  ep4({
    id: 'phase4_ep8', phase: 4, day: 7,
    patient: { name: '박지수', age: 13, chiefComplaint: '복통·오심 (급식 후)', initialEmotion: 'neutral' },
    eventContext: 'food_poisoning',
    script: ep4_8,
    interludeBefore: 'meal_day7',
    notebook: { chart: '박지수 / 13세 / 여 / 보호자 동반 — 복통·오심 (어제 급식 후)' },
  }),
  ep4({
    id: 'phase4_ep9', phase: 4, day: 7,
    patient: { name: '서민지', age: 29, chiefComplaint: '불면·집중력 저하', initialEmotion: 'guarded' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep4_9,
    notebook: { chart: '서민지 / 29세 / 여 / 주증상: 불면·집중력 저하 2개월 (취업 준비 중)' },
  }),
  ep4({
    id: 'phase4_ep10', phase: 4, day: 7,
    patient: { name: '김봉순', age: 39, chiefComplaint: '딸 복통·두드러기 (대리 내원)', initialEmotion: 'anxious' },
    eventContext: 'food_poisoning',
    script: ep4_10,
    notebook: { chart: '김봉순 / 39세 / 여 / 보호자 내원 — 중3 딸 복통·두드러기 (식중독 의심)' },
  }),
  // Day 8: 마무리 — 일반 외래 환자 (5명)
  ep4({
    id: 'phase4_ep11', phase: 4, day: 8,
    patient: { name: '한성민', age: 16, chiefComplaint: '복통·발열 (급식 이틀 후 늦은 발현)', initialEmotion: 'neutral' },
    eventContext: 'food_poisoning',
    script: ep4_11,
    notebook: { chart: '한성민 / 16세 / 남 / 단독 내원 — 복통·발열 (이틀 전 급식 후)' },
  }),
  ep4({
    id: 'phase4_ep12', phase: 4, day: 8,
    patient: { name: '신영주', age: 52, chiefComplaint: '복통·구역감 (교직원 식당)', initialEmotion: 'neutral' },
    eventContext: 'food_poisoning',
    script: ep4_12,
    notebook: { chart: '신영주 / 52세 / 여 / 행정직 — 복통·구역감 (어제 교직원 식당 후)' },
  }),
  ep4({
    id: 'phase4_ep13', phase: 4, day: 8,
    patient: { name: '조태준', age: 44, chiefComplaint: '만성 코막힘·코골이', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['life', 'emotional'] },
    script: ep4_13,
    interludeBefore: 'meal_day8',
    notebook: { chart: '조태준 / 44세 / 남 / 주증상: 만성 코막힘·코골이 (배우자 예약)' },
  }),
  ep4({
    id: 'phase4_ep14', phase: 4, day: 8,
    patient: { name: '윤혜진', age: 33, chiefComplaint: '기침·가래 10일', initialEmotion: 'anxious' },
    eventContext: null,
    script: ep4_14,
    notebook: { chart: '윤혜진 / 33세 / 여 / 어린이집 교사 — 기침·가래 10일 지속' },
  }),
  ep4({
    id: 'phase4_ep15', phase: 4, day: 8,
    patient: { name: '강명훈', age: 58, chiefComplaint: '상복부 불쾌감·소화불량', initialEmotion: 'guarded' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['medical', 'emotional'] },
    script: ep4_15,
    notebook: { chart: '강명훈 / 58세 / 남 / 주증상: 상복부 불쾌감·소화불량 1개월 (아버지 위암력)' },
  }),
  // ── Phase 5 ── (독감 유행 이벤트, Day 9–11)
  // Day 9: 독감 유행 첫날 — 일반 외래 + 독감 환자 혼재 (8명)
  ep5({
    id: 'phase5_ep1', phase: 5, day: 9,
    patient: { name: '이정민', age: 35, chiefComplaint: '과민성 대장 증후군 재진', initialEmotion: 'neutral' },
    eventContext: null,
    script: ep5_1,
    notebook: { chart: '이정민 / 35세 / 여 / 과민성 대장 증후군 재진 (회사원)' },
  }),
  ep5({
    id: 'phase5_ep2', phase: 5, day: 9,
    patient: { name: '박상우', age: 41, chiefComplaint: '발열·근육통·기침 (독감 의심)', initialEmotion: 'anxious' },
    eventContext: 'flu',
    script: ep5_2,
    notebook: { chart: '박상우 / 41세 / 남 / 발열 38.9도·근육통·기침 2일 (직장 내 독감 유행)' },
  }),
  ep5({
    id: 'phase5_ep3', phase: 5, day: 9,
    patient: { name: '김순례', age: 72, chiefComplaint: 'COPD 증상 악화', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['life', 'emotional'] },
    script: ep5_3,
    notebook: { chart: '김순례 / 72세 / 여 / COPD 만성 관리 중 — 기침 심화 (혼자 내원)' },
  }),
  ep5({
    id: 'phase5_ep4', phase: 5, day: 9,
    patient: { name: '최영철', age: 48, chiefComplaint: '속쓰림 (1개월)', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['life', 'appearance'] },
    script: ep5_4,
    notebook: { chart: '최영철 / 48세 / 남 / 주증상: 속쓰림 1개월 (많이 참고 내원)' },
  }),
  ep5({
    id: 'phase5_ep5', phase: 5, day: 9,
    patient: { name: '이나라', age: 26, chiefComplaint: '목쉼·인후통 (2주)', initialEmotion: 'anxious' },
    eventContext: null,
    script: ep5_5,
    interludeBefore: 'meal_day9',
    notebook: { chart: '이나라 / 26세 / 여 / 목쉼·인후통 2주 (카페 알바 중)' },
  }),
  ep5({
    id: 'phase5_ep6', phase: 5, day: 9,
    patient: { name: '정현우', age: 55, chiefComplaint: '변비·복부 팽만 (수개월)', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['life', 'emotional'] },
    script: ep5_6,
    notebook: { chart: '정현우 / 55세 / 남 / 주증상: 변비·복부 팽만 수개월' },
  }),
  ep5({
    id: 'phase5_ep7', phase: 5, day: 9,
    patient: { name: '한지영', age: 44, chiefComplaint: '기침·흉부 압박감 (3주)', initialEmotion: 'neutral' },
    eventContext: null,
    script: ep5_7,
    notebook: { chart: '한지영 / 44세 / 여 / 기침·흉부 압박감 3주 (지하철 원인 확신)' },
  }),
  ep5({
    id: 'phase5_ep8', phase: 5, day: 9,
    patient: { name: '노민호', age: 31, chiefComplaint: '무기력·의욕 저하 (3개월)', initialEmotion: 'guarded' },
    eventContext: null,
    script: ep5_8,
    notebook: { chart: '노민호 / 31세 / 남 / 무기력·의욕 저하 3개월 (개발자, 데이터 기술형)' },
  }),
  // Day 10: 독감 유행 이틀째 — 독감 진단서 요구 + 다양한 외래 (8명)
  ep5({
    id: 'phase5_ep9', phase: 5, day: 10,
    patient: { name: '이동현', age: 38, chiefComplaint: '발열·오한·근육통 (독감·진단서 요청)', initialEmotion: 'anxious' },
    eventContext: 'flu',
    script: ep5_9,
    notebook: { chart: '이동현 / 38세 / 남 / 발열 39.1도·오한·근육통 2일 (영업직, 진단서 요청)' },
  }),
  ep5({
    id: 'phase5_ep10', phase: 5, day: 10,
    patient: { name: '문영숙', age: 61, chiefComplaint: '소화불량·식욕 부진 (수개월)', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep5_10,
    notebook: { chart: '문영숙 / 61세 / 여 / 소화불량·식욕 부진 수개월 (남편 병간호 중)' },
  }),
  ep5({
    id: 'phase5_ep11', phase: 5, day: 10,
    patient: { name: '이태민', age: 22, chiefComplaint: '이명 (1개월)', initialEmotion: 'neutral' },
    eventContext: null,
    script: ep5_11,
    notebook: { chart: '이태민 / 22세 / 남 / 이명 1개월 (이어폰 과사용)' },
  }),
  ep5({
    id: 'phase5_ep12', phase: 5, day: 10,
    patient: { name: '강철수', age: 63, chiefComplaint: '발열·기침·탈수', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'appearance'] },
    script: ep5_12,
    notebook: { chart: '강철수 / 63세 / 남 / 발열·기침·탈수 수일 (노숙 상태)' },
  }),
  ep5({
    id: 'phase5_ep13', phase: 5, day: 10,
    patient: { name: '조은미', age: 32, chiefComplaint: '자녀(7세) 기침·발열 (보호자 내원)', initialEmotion: 'anxious' },
    eventContext: null,
    script: ep5_13,
    interludeBefore: 'meal_day10',
    notebook: { chart: '조은미 / 32세 / 여 / 보호자 내원 — 7세 자녀 기침·발열' },
  }),
  ep5({
    id: 'phase5_ep14', phase: 5, day: 10,
    patient: { name: '최석훈', age: 47, chiefComplaint: '불안장애 재진 (단약 후 재발)', initialEmotion: 'guarded' },
    eventContext: null,
    script: ep5_14,
    notebook: { chart: '최석훈 / 47세 / 남 / 불안장애 재진 — 자의로 단약 후 재발' },
  }),
  ep5({
    id: 'phase5_ep15', phase: 5, day: 10,
    patient: { name: '윤미선', age: 54, chiefComplaint: '반복 복통·설사 (IBS 의심)', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep5_15,
    notebook: { chart: '윤미선 / 54세 / 여 / 반복 복통·설사 (IBS 의심, 원인 모름)' },
  }),
  ep5({
    id: 'phase5_ep16', phase: 5, day: 10,
    patient: { name: '박준영', age: 29, chiefComplaint: '기침·가래·미열 (1주)', initialEmotion: 'neutral' },
    eventContext: null,
    script: ep5_16,
    notebook: { chart: '박준영 / 29세 / 남 / 기침·가래·미열 1주 (헬스장 시작 직후)' },
  }),
  // Day 11: 독감 피크 + 다양한 외래 마무리 (8명)
  ep5({
    id: 'phase5_ep17', phase: 5, day: 11,
    patient: { name: '류성진', age: 44, chiefComplaint: '발열·인후통·기침 (3일)', initialEmotion: 'neutral' },
    eventContext: 'flu',
    script: ep5_17,
    notebook: { chart: '류성진 / 44세 / 남 / 발열·인후통·기침 3일 (공장 근무, 빨리 끝내려 함)' },
  }),
  ep5({
    id: 'phase5_ep18', phase: 5, day: 11,
    patient: { name: '송하은', age: 29, chiefComplaint: '발열·근육통·두통 (1일, 급성)', initialEmotion: 'anxious' },
    eventContext: 'flu',
    script: ep5_18,
    notebook: { chart: '송하은 / 29세 / 여 / 발열·근육통·두통 1일 급성 발현 (콜센터)' },
  }),
  ep5({
    id: 'phase5_ep19', phase: 5, day: 11,
    patient: { name: '한보람', age: 38, chiefComplaint: '구역·명치 불편감 (수개월)', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep5_19,
    notebook: { chart: '한보람 / 38세 / 여 / 구역·명치 불편감 수개월 (프리랜서 디자이너)' },
  }),
  ep5({
    id: 'phase5_ep20', phase: 5, day: 11,
    patient: { name: '임기택', age: 70, chiefComplaint: '만성 기침·가래 (수년 악화)', initialEmotion: 'neutral' },
    eventContext: null,
    script: ep5_20,
    notebook: { chart: '임기택 / 70세 / 남 / 만성 기침·가래 수년 악화 (자녀 동반)' },
  }),
  ep5({
    id: 'phase5_ep21', phase: 5, day: 11,
    patient: { name: '이수현', age: 41, chiefComplaint: '복통·구역감 (2주)', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'appearance'] },
    script: ep5_21,
    interludeBefore: 'meal_day11',
    notebook: { chart: '이수현 / 41세 / 여 / 복통·구역감 2주 (긴장된 모습)' },
  }),
  ep5({
    id: 'phase5_ep22', phase: 5, day: 11,
    patient: { name: '정다은', age: 19, chiefComplaint: '시험 불안·손떨림·두근거림 (반복)', initialEmotion: 'anxious' },
    eventContext: null,
    script: ep5_22,
    notebook: { chart: '정다은 / 19세 / 여 / 시험 불안·손떨림·두근거림 반복 (재수생)' },
  }),
  ep5({
    id: 'phase5_ep23', phase: 5, day: 11,
    patient: { name: '오상철', age: 52, chiefComplaint: '목 이물감·삼킴 불편 (3주)', initialEmotion: 'guarded' },
    eventContext: null,
    script: ep5_23,
    notebook: { chart: '오상철 / 52세 / 남 / 목 이물감·삼킴 불편 3주 (인터넷 암 의심)' },
  }),
  ep5({
    id: 'phase5_ep24', phase: 5, day: 11,
    patient: { name: '백지현', age: 46, chiefComplaint: '집중력 저하·기억력 감퇴 (수개월)', initialEmotion: 'neutral' },
    eventContext: null,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep5_24,
    notebook: { chart: '백지현 / 46세 / 여 / 집중력 저하·기억력 감퇴 수개월 (중학교 교사, 학폭 처리 후)' },
  }),
]

export default allEpisodes
