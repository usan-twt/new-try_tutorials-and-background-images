import { getApartmentTier } from './apartmentData'

// 경제 등급별 식사 장면 풀
// character 슬롯에 장소명을 넣어 InterludeScene의 헤더로 표시
const MEAL_SCENES = {
  basement: [
    {
      location: '매점',
      lines: [
        { text: '삼각김밥 하나. 소금이 많다.' },
        { text: '복도 끝 창가에 기대어 먹는다.', pause: true },
        { text: '다음 환자 시간까지 12분.' },
      ],
    },
    {
      location: '자판기 앞',
      lines: [
        { text: '동전이 몇 개 남아 있다.' },
        { text: '따뜻한 캔커피 하나.', pause: true },
        { text: '단맛이 지나치게 강하다.' },
      ],
    },
  ],
  studio: [
    {
      location: '구내식당',
      lines: [
        { text: '된장찌개 정식. 줄이 길어서 10분을 기다렸다.' },
        { text: '밥 먹는 사람들의 소리가 섞인다.', pause: true },
        { text: '맛은 그럭저럭이다.' },
      ],
    },
    {
      location: '편의점',
      lines: [
        { text: '도시락을 하나 샀다.' },
        { text: '전자레인지 앞에서 2분. 창밖을 봤다.', pause: true },
        { text: '비가 올 것 같다.' },
      ],
    },
  ],
  twoRoom: [
    {
      location: '근처 식당',
      lines: [
        { text: '점심치고는 조용한 곳이다.' },
        { text: '혼자 앉아 창가를 봤다.', pause: true },
        { text: '나쁘지 않다.' },
      ],
    },
    {
      location: '근처 식당',
      lines: [
        { text: '선배가 밥 먹었냐고 물었다.' },
        { text: '같이 나갔다. 말이 별로 없었다.', pause: true },
        { text: '그래도 나쁘지 않은 점심이었다.' },
      ],
    },
  ],
}

// economy 값을 받아 해당 등급 풀에서 랜덤 장면을 반환
// InterludeScene과 호환: character 필드에 장소명, reactions 없음(자동 종료)
export function getMealInterlude(economy) {
  const tier = getApartmentTier(economy)
  const scenes = MEAL_SCENES[tier] ?? MEAL_SCENES.studio
  const scene = scenes[Math.floor(Math.random() * scenes.length)]
  return {
    type: 'meal',
    character: scene.location,
    lines: scene.lines,
  }
}
