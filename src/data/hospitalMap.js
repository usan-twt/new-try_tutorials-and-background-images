// ─── 병원 맵 데이터 ──────────────────────────────────────────────

export const PLAYER_SPEED = 3.5
export const INTERACT_RANGE = 55

export const FLOORS = {
  1: {
    label: '1층 · 외래',
    width: 900,
    rooms: [
      { id: 'reception', name: '접수처', x: 80, width: 80, type: 'counter' },
      { id: 'clinic1', name: '진료실 1', x: 260, width: 80, type: 'door' },
      { id: 'clinic2', name: '진료실 2', x: 420, width: 80, type: 'door' },
      { id: 'vending1', name: '자판기', x: 620, width: 56, type: 'vending' },
    ],
    npcs: [
      { id: 'patient_wait', name: '대기 환자', x: 180, color: '#d8d0c0' },
      { id: 'peer_lee', name: '이 동기', x: 530, color: '#e8dcc0' },
    ],
    stairs: { x: 780, direction: 'up', targetFloor: 2 },
    decorations: [
      { type: 'bench', x: 160 },
      { type: 'board', x: 350 },
      { type: 'plant', x: 560 },
    ],
  },
  2: {
    label: '2층 · 병동',
    width: 900,
    rooms: [
      { id: 'nurse_st', name: '스테이션', x: 120, width: 100, type: 'counter' },
      { id: 'ward1', name: '401호', x: 320, width: 72, type: 'door' },
      { id: 'ward2', name: '402호', x: 470, width: 72, type: 'door' },
      { id: 'ward3', name: '403호', x: 620, width: 72, type: 'door' },
    ],
    npcs: [
      { id: 'nurse_kim', name: '김 간호사', x: 160, color: '#d0e0d8' },
      { id: 'patient_family', name: '보호자', x: 540, color: '#d8d0c0' },
    ],
    stairsDown: { x: 780, direction: 'down', targetFloor: 1 },
    stairsUp: { x: 50, direction: 'up', targetFloor: 3 },
    decorations: [
      { type: 'board', x: 250 },
      { type: 'bench', x: 400 },
      { type: 'plant', x: 720 },
    ],
  },
  3: {
    label: '3층 · 의국',
    width: 900,
    rooms: [
      { id: 'office', name: '의국', x: 160, width: 100, type: 'door', sub: '탈의실' },
      { id: 'seminar', name: '세미나실', x: 380, width: 80, type: 'door' },
      { id: 'vending2', name: '자판기', x: 560, width: 56, type: 'vending' },
      { id: 'rooftop', name: '옥상 출입구', x: 720, width: 72, type: 'door' },
    ],
    npcs: [
      { id: 'senior_park', name: '박 선배', x: 240, color: '#e0d8c0' },
    ],
    stairsDown: { x: 50, direction: 'down', targetFloor: 2 },
    decorations: [
      { type: 'board', x: 300 },
      { type: 'bench', x: 480 },
      { type: 'plant', x: 660 },
    ],
  },
}

export const ROOM_DESCRIPTIONS = {
  reception: '접수 창구. 번호표 기계가 윙윙거린다.',
  clinic1: '오전 외래 진료실. 차트가 쌓여 있다.',
  clinic2: '오후 외래 진료실. 아직 불이 꺼져 있다.',
  vending1: '커피 한 잔, 300원. 설탕은 세 번째 버튼.',
  vending2: '위층 자판기는 커피가 좀 더 진하다. 아무도 모르는 사실.',
  nurse_st: '차트와 모니터 사이로 간호사들의 손이 바쁘게 움직인다.',
  ward1: '401호. 커튼 너머로 조용한 숨소리.',
  ward2: '402호. 창가 침대에 꽃이 놓여 있다.',
  ward3: '403호. 비어 있다. 시트가 깨끗하게 정돈되어 있다.',
  office: '선배의 자리에 라면 국물 자국. 안쪽에 탈의실이 보인다.',
  seminar: '아무도 없다. 빔프로젝터만 윙윙거린다.',
  rooftop: '잠겨 있다. 틈 사이로 바람이 느껴진다.',
}

// 저녁 전용 방 설명 (morning 기본값에서 재정의)
export const ROOM_DESCRIPTIONS_EVENING = {
  ...ROOM_DESCRIPTIONS,
  reception: '접수 창구. 번호표 기계가 꺼져 있다.',
  clinic1: '오전 외래 진료실. 오늘 진료가 끝났다.',
  clinic2: '오후 외래 진료실. 불이 꺼져 있다.',
  nurse_st: '스테이션. 퇴근 준비가 한창이다.',
}

// 진료실 ID 목록 (진입 시 에피소드 트리거)
export const CLINIC_IDS = new Set(['clinic1', 'clinic2'])
