// NPC 복도 대사 — 관계 수준에 따라 분기
// all: 관계 무관 / hostile·neutral·favorable: 관계 연동

const NPC_DIALOGUES = {
  patient_wait: {
    all: [
      '(접수 번호표를 쥐고 불안한 눈으로 앉아 있다.)',
      '…아직 안 불렀나.',
    ],
  },
  peer_lee: {
    all: [
      '야, 어제 그 환자 있잖아. 나는 생활 쪽으로 물어봤거든? 완전 다른 얘기가 나오더라.',
      '오늘 점심 뭐 먹을지 생각해 놨어?',
      '솔직히 어제 좀 힘들었어. 근데 뭐, 오늘도 해야지.',
    ],
  },
  nurse_kim: {
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
  patient_family: {
    all: [
      '…선생님, 저희 어머니 언제쯤 퇴원할 수 있을까요?',
      '(고개를 숙이고 있다.)',
    ],
  },
  senior_park: {
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
}

// npcId와 현재 관계 수준을 받아 해당 대사 배열 반환
export function getNPCDialogues(npcId, professorLevel, nurseLevel) {
  const pool = NPC_DIALOGUES[npcId]
  if (!pool) return []
  if (pool.all) return pool.all
  if (npcId === 'nurse_kim') return pool[nurseLevel] ?? pool.neutral
  if (npcId === 'senior_park') return pool[professorLevel] ?? pool.neutral
  return pool.neutral ?? []
}
