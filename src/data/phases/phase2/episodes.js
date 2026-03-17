import ep2_1 from './scripts/ep2_1.json'
import ep2_2 from './scripts/ep2_2.json'
import ep2_3 from './scripts/ep2_3.json'

const phase2Episodes = [
  {
    id: 'phase2_ep1',
    phase: 2,
    day: 2,
    patient: {
      name: '김영희',
      age: 48,
      chiefComplaint: '허리 통증',
      initialEmotion: 'anxious',
    },
    directionTags: true,
    script: ep2_1,
    dayEndData: {
      patients: [
        { name: '김영희', age: 48, chiefComplaint: '허리 통증' },
      ],
    },
    notebook: {
      chart: '김영희 / 48세 / 여 / 주증상: 요통 2개월',
    },
  },
  {
    id: 'phase2_ep2',
    phase: 2,
    day: 2,
    patient: {
      name: '최민호',
      age: 24,
      chiefComplaint: '불면',
      initialEmotion: 'guarded',
    },
    directionTags: true,
    script: ep2_2,
    dayEndData: {
      patients: [
        { name: '김영희', age: 48, chiefComplaint: '허리 통증' },
        { name: '최민호', age: 24, chiefComplaint: '불면' },
      ],
    },
    interludeBefore: 'after_ep2_1',
    notebook: {
      chart: '최민호 / 24세 / 남 / 주증상: 불면 3개월',
    },
  },
  {
    id: 'phase2_ep3',
    phase: 2,
    day: 3,
    patient: {
      name: '한복동',
      age: 71,
      chiefComplaint: '만성 기침',
      initialEmotion: 'neutral',
    },
    directionTags: true,
    script: ep2_3,
    dayEndData: {
      patients: [
        { name: '한복동', age: 71, chiefComplaint: '만성 기침' },
      ],
    },
    notebook: {
      chart: '한복동 / 71세 / 남 / 주증상: 기침 1개월 이상',
    },
  },
]

export default phase2Episodes
