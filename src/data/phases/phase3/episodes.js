import ep3_1 from './scripts/ep3_1.json'
import ep3_2 from './scripts/ep3_2.json'
import ep3_3 from './scripts/ep3_3.json'

const phase3Episodes = [
  {
    id: 'phase3_ep1',
    phase: 3,
    day: 4,
    patient: {
      name: '오철수',
      age: 55,
      chiefComplaint: '어깨 통증',
      initialEmotion: 'neutral',
    },
    directionTags: true,
    maxTurns: 5,
    script: ep3_1,
    dayEndData: {
      patients: [
        { name: '오철수', age: 55, chiefComplaint: '어깨 통증' },
      ],
    },
    notebook: {
      chart: '오철수 / 55세 / 남 / 주증상: 좌측 어깨 통증 및 운동 제한 1개월',
    },
  },
  {
    id: 'phase3_ep2',
    phase: 3,
    day: 4,
    patient: {
      name: '정수아',
      age: 29,
      chiefComplaint: '아이 발열',
      initialEmotion: 'anxious',
    },
    directionTags: true,
    maxTurns: 5,
    script: ep3_2,
    dayEndData: {
      patients: [
        { name: '오철수', age: 55, chiefComplaint: '어깨 통증' },
        { name: '정수아', age: 29, chiefComplaint: '아이 발열' },
      ],
    },
    notebook: {
      chart: '정수아 / 29세 / 여 / 아이(14개월) 발열 38.5°C 1일',
    },
  },
  {
    id: 'phase3_ep3',
    phase: 3,
    day: 5,
    patient: {
      name: '윤서연',
      age: 41,
      chiefComplaint: '불면',
      initialEmotion: 'guarded',
    },
    directionTags: true,
    maxTurns: 6,
    rapportGating: {
      threshold: 2,
      families: ['emotional', 'life'],
    },
    script: ep3_3,
    dayEndData: {
      patients: [
        { name: '윤서연', age: 41, chiefComplaint: '불면' },
      ],
    },
    interludeBefore: 'before_ep3_3',
    notebook: {
      chart: '윤서연 / 41세 / 여 / 주증상: 불면 (기간 미상)',
    },
  },
]

export default phase3Episodes
