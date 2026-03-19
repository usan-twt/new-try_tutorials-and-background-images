import ep1_1 from './phases/phase1/scripts/ep1_1.json'
import ep1_2 from './phases/phase1/scripts/ep1_2.json'
import ep1_3 from './phases/phase1/scripts/ep1_3.json'
import ep2_1 from './phases/phase2/scripts/ep2_1.json'
import ep2_2 from './phases/phase2/scripts/ep2_2.json'
import ep2_3 from './phases/phase2/scripts/ep2_3.json'
import ep3_1 from './phases/phase3/scripts/ep3_1.json'
import ep3_2 from './phases/phase3/scripts/ep3_2.json'
import ep3_3 from './phases/phase3/scripts/ep3_3.json'

export const dayBudgets = {
  4: { totalTurns: 10, episodes: ['phase3_ep1', 'phase3_ep2'] },
}

export const interludes = {
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
    afterReaction: [
      { speaker: '선배', text: '처음엔 다 그래. 나도 그랬어.' },
      { speaker: '선배', text: '어제 잘했잖아. 할 수 있어.' },
      { speaker: '선배', text: '내일 보자.', pause: true },
    ],
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
  {
    id: 'phase2_ep1', phase: 2, day: 2,
    patient: { name: '김영희', age: 47, chiefComplaint: '허리 통증', initialEmotion: 'neutral' },
    directionTags: true, script: ep2_1,
    interludeBefore: 'after_phase1',
    dayEndData: { patients: [{ name: '김영희', age: 47, chiefComplaint: '허리 통증' }] },
    notebook: { chart: '김영희 / 47세 / 여 / 주증상: 허리 통증 2주' },
  },
  {
    id: 'phase2_ep2', phase: 2, day: 2,
    patient: { name: '최민호', age: 22, chiefComplaint: '불면', initialEmotion: 'guarded' },
    directionTags: true, script: ep2_2,
    interludeBefore: 'after_ep2_1',
    dayEndData: {
      patients: [
        { name: '김영희', age: 47, chiefComplaint: '허리 통증' },
        { name: '최민호', age: 22, chiefComplaint: '불면' },
      ],
    },
    notebook: { chart: '최민호 / 22세 / 남 / 주증상: 불면 3개월' },
  },
  {
    id: 'phase2_ep3', phase: 2, day: 3,
    patient: { name: '한복동', age: 71, chiefComplaint: '기침', initialEmotion: 'neutral' },
    directionTags: true, script: ep2_3,
    interludeBefore: 'after_ep2_2',
    dayEndData: { patients: [{ name: '한복동', age: 71, chiefComplaint: '기침' }] },
    notebook: { chart: '한복동 / 71세 / 남 / 주증상: 만성 기침 2개월' },
  },
  // ── Phase 3 ──
  {
    id: 'phase3_ep1', phase: 3, day: 4,
    patient: { name: '오철수', age: 55, chiefComplaint: '어깨 통증', initialEmotion: 'neutral' },
    directionTags: true, maxTurns: 8, script: ep3_1,
    dayEndData: { patients: [{ name: '오철수', age: 55, chiefComplaint: '어깨 통증' }] },
    notebook: { chart: '오철수 / 55세 / 남 / 주증상: 좌측 어깨 통증 및 운동 제한 1개월' },
  },
  {
    id: 'phase3_ep2', phase: 3, day: 4,
    patient: { name: '정수아', age: 29, chiefComplaint: '아이 발열', initialEmotion: 'anxious' },
    directionTags: true, maxTurns: 8, script: ep3_2,
    dayEndData: {
      patients: [
        { name: '오철수', age: 55, chiefComplaint: '어깨 통증' },
        { name: '정수아', age: 29, chiefComplaint: '아이 발열' },
      ],
    },
    notebook: { chart: '정수아 / 29세 / 여 / 아이(14개월) 발열 38.5°C 1일' },
  },
  {
    id: 'phase3_ep3', phase: 3, day: 5,
    patient: { name: '윤서연', age: 41, chiefComplaint: '불면', initialEmotion: 'guarded' },
    directionTags: true, maxTurns: 8,
    rapportGating: { threshold: 2, families: ['emotional', 'life'] },
    script: ep3_3,
    interludeBefore: 'before_ep3_3',
    dayEndData: { patients: [{ name: '윤서연', age: 41, chiefComplaint: '불면' }] },
    notebook: { chart: '윤서연 / 41세 / 여 / 주증상: 불면 (기간 미상)' },
  },
]

export default allEpisodes
