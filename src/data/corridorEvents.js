// NPC 복도 대사 — 관계 수준 + 시간대(morning/evening)에 따라 분기

const NPC_DIALOGUES = {
  patient_wait: {
    morning: {
      all: [
        '(접수 번호표를 쥐고 불안한 눈으로 앉아 있다.)',
        '…아직 안 불렀나.',
      ],
    },
    evening: {
      all: [
        '(대기실이 비어 있다. 의자만 줄지어 있다.)',
        '(안내 방송이 멈춰 있다.)',
      ],
    },
  },

  peer_lee: {
    morning: {
      all: [
        '오늘 점심 뭐 먹을지 생각해 놨어?',
        '솔직히 오늘 좀 긴장되는데. 너는?',
        '나 오늘 환자 세 명이야. 너는?',
      ],
    },
    evening: {
      all: [
        '야, 오늘 수고했다. 어땠어?',
        '퇴근이다. 밥이나 먹을까?',
        '힘들었지? 나도 그랬어.',
      ],
    },
  },

  nurse_kim: {
    morning: {
      hostile: [
        '…(차트에서 눈을 떼지 않는다.)',
        '선생님, 다음 환자 이미 30분 기다리고 있어요.',
      ],
      neutral: [
        '아, 선생님. 오늘 외래 좀 밀릴 수 있어요.',
        '커피 드시고 오세요, 아직 시간 있어요.',
        '어제 3번 환자분 경과 좋아졌대요.',
      ],
      favorable: [
        '선생님, 오늘 일찍 오셨네요. 커피 한 잔 가져다드릴까요?',
        '어제 마지막 환자분이 선생님 많이 고마워했어요.',
        '오늘 일정 제가 미리 정리해뒀어요.',
      ],
    },
    evening: {
      hostile: [
        '…(퇴근 준비 중이다.)',
        '선생님, 퇴근하세요.',
      ],
      neutral: [
        '수고하셨어요, 선생님.',
        '내일 봐요.',
        '오늘 고생 많으셨어요.',
      ],
      favorable: [
        '오늘 정말 수고하셨어요, 선생님.',
        '내일도 잘 부탁드려요.',
        '퇴근하세요, 선생님. 오늘 고생 많으셨어요.',
      ],
    },
  },

  patient_family: {
    morning: {
      all: [
        '…선생님, 저희 어머니 언제쯤 퇴원할 수 있을까요?',
        '(고개를 숙이고 있다.)',
      ],
    },
    evening: {
      all: [
        '(면회 시간이 끝났는지 복도에 서서 기다리고 있다.)',
        '…수고 많으세요.',
      ],
    },
  },

  senior_park: {
    morning: {
      hostile: [
        '차트 미리 봤어? 준비가 돼 있어야 하는데.',
        '(지나치면서 짧게 고개만 끄덕인다.)',
      ],
      neutral: [
        '일찍 왔네. 좋아, 오늘 외래 차트 미리 봐둬.',
        '처음엔 다 그래. 익숙해지면 괜찮아질 거야.',
        '나도 1년차 때 매일 울었어. 농담 아니고.',
      ],
      favorable: [
        '어제 환자 진료 괜찮았어. 눈에 띄더라.',
        '외래 끝나고 시간 있어? 뭐 좀 같이 보자.',
        '그렇게 하면 돼. 감 잡혀가는 것 같다.',
      ],
    },
    evening: {
      hostile: [
        '(지나치면서 짧게 고개만 끄덕인다.)',
      ],
      neutral: [
        '수고했어. 퇴근해.',
        '오늘 어땠어?',
        '무리하지 마. 내일도 있어.',
      ],
      favorable: [
        '오늘 괜찮았어. 퇴근해.',
        '내일 봐.',
        '잘하고 있어. 그냥 계속 그렇게 해.',
      ],
    },
  },
}

// npcId, 관계 수준, 시간대를 받아 해당 대사 배열 반환
export function getNPCDialogues(npcId, professorLevel, nurseLevel, timeOfDay = 'morning') {
  const npcData = NPC_DIALOGUES[npcId]
  if (!npcData) return []
  const pool = npcData[timeOfDay] ?? npcData.morning
  if (!pool) return []
  if (pool.all) return pool.all
  if (npcId === 'nurse_kim') return pool[nurseLevel] ?? pool.neutral
  if (npcId === 'senior_park') return pool[professorLevel] ?? pool.neutral
  return pool.neutral ?? []
}
