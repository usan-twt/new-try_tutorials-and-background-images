import ep1_1 from './scripts/ep1_1.json'
import ep1_2 from './scripts/ep1_2.json'

const phase1Episodes = [
  {
    id: 'phase1_ep1',
    phase: 1,
    day: 1,
    patient: {
      name: '이정수',
      age: 52,
      chiefComplaint: '두통',
      initialEmotion: 'anxious',
    },
    script: ep1_1,
    dayEndData: {
      patients: [
        { name: '이정수', age: 52, chiefComplaint: '두통' },
      ],
    },
  },
  {
    id: 'phase1_ep2',
    phase: 1,
    day: 1,
    patient: {
      name: '박수진',
      age: 34,
      chiefComplaint: '소화불량',
      initialEmotion: 'neutral',
    },
    script: ep1_2,
    dayEndData: {
      patients: [
        { name: '이정수', age: 52, chiefComplaint: '두통' },
        { name: '박수진', age: 34, chiefComplaint: '소화불량' },
      ],
    },
  },
]

export default phase1Episodes
