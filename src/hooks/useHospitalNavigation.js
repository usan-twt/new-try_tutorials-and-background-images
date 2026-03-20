import { useState, useEffect, useRef, useCallback } from 'react'
import { FLOORS, ROOM_DESCRIPTIONS, ROOM_DESCRIPTIONS_EVENING, PLAYER_SPEED, INTERACT_RANGE, CLINIC_IDS } from '../data/hospitalMap'
import { getNPCDialogues } from '../data/corridorEvents'

// ─── 가이드 투어 웨이포인트 ───────────────────────────────────────
const GUIDED_WAYPOINTS = [
  {
    floor: 1, x: 700,
    dialogue: { name: '박 선배', text: '여기가 1층 외래야. 저기 진료실 두 개 보이지? 오늘 네가 볼 곳이야. 위층도 잠깐 보여줄게 — 저기 계단 올라가봐.' },
  },
  {
    floor: 2, x: 400,
    dialogue: { name: '박 선배', text: '2층 병동이야. 입원 환자들 있어. 위층 의국도 보자 — 왼쪽 계단 올라가봐.' },
  },
  {
    floor: 3, x: 240,
    dialogue: { name: '박 선배', text: '3층 의국이야. 우리 공간이지. 자, 이제 내려가서 진료 시작하자.' },
  },
  {
    floor: 1, x: 360,
    dialogue: { name: '박 선배', text: '준비됐어? 진료실 1이나 2 들어가봐. 첫 환자 기다리고 있어.' },
    isLast: true,
  },
]

// 아침/저녁 팔레트
export function getPalette(timeOfDay) {
  return timeOfDay === 'morning' ? {
    sky: '#f5dfa0', wallTop: '#e8d5a8', wall: '#dcc898',
    wainscot: '#c4a060', floorTop: '#d8b878', floor: '#c8a868',
    floorShine: 'rgba(255,240,180,0.3)', windowLight: 'rgba(255,230,150,0.5)',
    ceilingTile: '#e0d0a8', ceilingLine: 'rgba(180,160,120,0.3)',
    doorFrame: '#a08050', doorFill: '#8b6914', doorDark: '#6a5020',
    textPrimary: '#5a4a2a', textSecondary: '#8a7a5a',
  } : {
    sky: '#6a5a48', wallTop: '#9a8a70', wall: '#8a7a60',
    wainscot: '#7a6a48', floorTop: '#887058', floor: '#786050',
    floorShine: 'rgba(200,180,140,0.1)', windowLight: 'rgba(100,120,160,0.2)',
    ceilingTile: '#8a7a60', ceilingLine: 'rgba(60,50,40,0.3)',
    doorFrame: '#6a5030', doorFill: '#5a4020', doorDark: '#4a3018',
    textPrimary: '#c8b890', textSecondary: '#a09070',
  }
}

export default function useHospitalNavigation({ timeOfDay, onEnterClinic, onComplete, professorRelationLevel = 'neutral', nurseRelationLevel = 'neutral', initialDialogue = null, onInitialDialogueSeen = null, guided = false }) {
  const [currentFloor, setCurrentFloor] = useState(1)
  const [playerX, setPlayerX] = useState(80)
  const [guidedStep, setGuidedStep] = useState(0)
  const [tourComplete, setTourComplete] = useState(false)
  const [facing, setFacing] = useState('right')
  const [walking, setWalking] = useState(false)
  const [walkFrame, setWalkFrame] = useState(0)
  const [activeDialogue, setActiveDialogue] = useState(null)
  const [roomDescription, setRoomDescription] = useState(null)
  const [dialogueIndex, setDialogueIndex] = useState({})
  const [dialogueVisible, setDialogueVisible] = useState(false)
  const [floorTransition, setFloorTransition] = useState(null)
  const [roomPrompt, setRoomPrompt] = useState(null)

  const keysRef = useRef({})
  const gameLoopRef = useRef(null)
  const frameCountRef = useRef(0)
  const playerXRef = useRef(80)
  const floorRef = useRef(1)
  const hasDialogueRef = useRef(false)
  const floorTransitionRef = useRef(null)
  const dialogueIndexRef = useRef({})
  const walkingRef = useRef(false)
  const prevPromptRef = useRef(null)
  const activeIsInitialRef = useRef(false)
  const onInitialDialogueSeenRef = useRef(onInitialDialogueSeen)
  onInitialDialogueSeenRef.current = onInitialDialogueSeen
  // 가이드 투어 refs
  const guidedRef = useRef(guided)
  guidedRef.current = guided
  const guidedStepRef = useRef(0)
  guidedStepRef.current = guidedStep
  const tourCompleteRef = useRef(false)
  tourCompleteRef.current = tourComplete
  const guidedTriggeredRef = useRef(false)   // 현재 스텝이 이미 트리거됐는지
  const guidedWaypointActiveRef = useRef(false) // 웨이포인트 대화 진행 중인지

  playerXRef.current = playerX
  floorRef.current = currentFloor
  hasDialogueRef.current = !!(activeDialogue || roomDescription)
  floorTransitionRef.current = floorTransition
  dialogueIndexRef.current = dialogueIndex

  // ─── 소문 채널: 진입 시 자동 대화 ───────────────────────────────
  useEffect(() => {
    if (initialDialogue) {
      activeIsInitialRef.current = true
      setActiveDialogue(initialDialogue)
      setDialogueVisible(true)
    }
  }, []) // 마운트 시 1회만 실행

  // ─── 층 이동 ──────────────────────────────────────────────────
  const moveFloor = useCallback((targetFloor) => {
    if (floorTransitionRef.current) return
    const isGoingUp = targetFloor > floorRef.current
    setFloorTransition(isGoingUp ? 'up' : 'down')
    setTimeout(() => {
      setCurrentFloor(targetFloor)
      const target = FLOORS[targetFloor]
      const stair = isGoingUp ? target.stairsDown : (target.stairsUp || target.stairs)
      if (stair) setPlayerX(stair.x + 30)
      setTimeout(() => setFloorTransition(null), 300)
    }, 300)
  }, [])

  // ─── 상호작용 공통 ─────────────────────────────────────────────
  const openRoom = useCallback((room) => {
    // 아침 네비에서 진료실 입장 → 에피소드 시작
    if (timeOfDay === 'morning' && CLINIC_IDS.has(room.id) && onEnterClinic) {
      // 가이드 투어 미완료 시 차단
      if (guidedRef.current && !tourCompleteRef.current) {
        setActiveDialogue({ name: '박 선배', text: '잠깐, 먼저 구경 끝내자.' })
        setDialogueVisible(true)
        return
      }
      onEnterClinic()
      return
    }
    const descs = timeOfDay === 'evening' ? ROOM_DESCRIPTIONS_EVENING : ROOM_DESCRIPTIONS
    setRoomDescription({ ...room, description: descs[room.id] || '' })
    setDialogueVisible(true)
  }, [timeOfDay, onEnterClinic])

  const openNPC = useCallback((npc) => {
    const dialogues = getNPCDialogues(npc.id, professorRelationLevel, nurseRelationLevel, timeOfDay)
    if (!dialogues.length) return
    const idx = dialogueIndexRef.current[npc.id] || 0
    setActiveDialogue({ name: npc.name, text: dialogues[idx % dialogues.length] })
    setDialogueVisible(true)
    setDialogueIndex(prev => ({ ...prev, [npc.id]: (idx + 1) % dialogues.length }))
  }, [professorRelationLevel, nurseRelationLevel])

  const closeDialogue = useCallback(() => {
    setDialogueVisible(false)
    const wasInitial = activeIsInitialRef.current
    activeIsInitialRef.current = false
    const wasWaypoint = guidedWaypointActiveRef.current
    guidedWaypointActiveRef.current = false
    setTimeout(() => {
      setActiveDialogue(null)
      setRoomDescription(null)
      if (wasInitial) onInitialDialogueSeenRef.current?.()
      if (wasWaypoint) {
        const wp = GUIDED_WAYPOINTS[guidedStepRef.current]
        if (wp?.isLast) {
          setTourComplete(true)
        } else {
          setGuidedStep(s => s + 1)
          guidedTriggeredRef.current = false
        }
      }
    }, 180)
  }, [])

  // ─── 키 입력 ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (floorTransitionRef.current) return

      if (hasDialogueRef.current) {
        if (['Escape', 'Enter', ' '].includes(e.key)) closeDialogue()
        return
      }

      keysRef.current[e.key] = true

      if (e.key === 'ArrowUp') {
        const px = playerXRef.current
        const fl = FLOORS[floorRef.current]

        // 계단 올라가기
        const su = fl.stairs || fl.stairsUp
        if (su && Math.abs(px - (su.x + 30)) < INTERACT_RANGE) {
          moveFloor(su.targetFloor); return
        }
        // 방 진입
        const room = fl.rooms.find(r => Math.abs(px - (r.x + r.width / 2)) < INTERACT_RANGE)
        if (room) { openRoom(room); return }
        // NPC
        const npc = fl.npcs.find(n => Math.abs(px - n.x) < INTERACT_RANGE)
        if (npc) { openNPC(npc); return }
        // 저녁: 출구 (1층 왼쪽 끝)
        if (timeOfDay === 'evening' && floorRef.current === 1 && px < 40 && onComplete) {
          onComplete()
        }
      }

      if (e.key === 'ArrowDown') {
        const px = playerXRef.current
        const fl = FLOORS[floorRef.current]
        const sd = fl.stairsDown
        if (sd && Math.abs(px - (sd.x + 30)) < INTERACT_RANGE) moveFloor(sd.targetFloor)
      }

      if (['Enter', ' '].includes(e.key)) {
        const px = playerXRef.current
        const fl = FLOORS[floorRef.current]
        // 저녁: 출구
        if (timeOfDay === 'evening' && floorRef.current === 1 && px < 40 && onComplete) {
          onComplete(); return
        }
        const room = fl.rooms.find(r => Math.abs(px - (r.x + r.width / 2)) < INTERACT_RANGE)
        if (room) { openRoom(room); return }
        const npc = fl.npcs.find(n => Math.abs(px - n.x) < INTERACT_RANGE)
        if (npc) { openNPC(npc) }
      }

      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault()
    }

    const handleKeyUp = (e) => { keysRef.current[e.key] = false }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [moveFloor, openRoom, openNPC, closeDialogue, timeOfDay, onComplete])

  // ─── 게임 루프 ─────────────────────────────────────────────────
  useEffect(() => {
    const loop = () => {
      if (!hasDialogueRef.current && !floorTransitionRef.current) {
        const fl = FLOORS[floorRef.current]
        const isLeft = !!keysRef.current['ArrowLeft']
        const isRight = !!keysRef.current['ArrowRight']
        const isMoving = isLeft || isRight

        if (isMoving) {
          const prev = playerXRef.current
          const next = isLeft
            ? Math.max(20, prev - PLAYER_SPEED)
            : Math.min(fl.width - 30, prev + PLAYER_SPEED)
          if (next !== prev) {
            setPlayerX(next)
            setFacing(isLeft ? 'left' : 'right')
          }
          const fc = frameCountRef.current + 1
          frameCountRef.current = fc
          if (fc % 7 === 0) setWalkFrame(f => (f + 1) % 4)
        }

        if (isMoving !== walkingRef.current) {
          walkingRef.current = isMoving
          setWalking(isMoving)
        }
      }

      // 가이드 투어: 웨이포인트 자동 트리거
      if (guidedRef.current && !tourCompleteRef.current && !hasDialogueRef.current && !floorTransitionRef.current) {
        const wp = GUIDED_WAYPOINTS[guidedStepRef.current]
        if (wp && floorRef.current === wp.floor && Math.abs(playerXRef.current - wp.x) < INTERACT_RANGE) {
          if (!guidedTriggeredRef.current) {
            guidedTriggeredRef.current = true
            guidedWaypointActiveRef.current = true
            setActiveDialogue(wp.dialogue)
            setDialogueVisible(true)
          }
        }
      }

      // 프롬프트 계산
      const fl = FLOORS[floorRef.current]
      const px = playerXRef.current
      let prompt = null

      // 저녁: 출구 프롬프트
      if (timeOfDay === 'evening' && floorRef.current === 1 && px < 40) {
        prompt = { text: '퇴근하기', key: '↑' }
      } else {
        const nearRoom = fl.rooms.find(r => Math.abs(px - (r.x + r.width / 2)) < INTERACT_RANGE)
        const su = fl.stairs || fl.stairsUp
        const nearSU = su && Math.abs(px - (su.x + 30)) < INTERACT_RANGE
        const sd = fl.stairsDown
        const nearSD = sd && Math.abs(px - (sd.x + 30)) < INTERACT_RANGE

        if (nearRoom) {
          const isClinc = timeOfDay === 'morning' && CLINIC_IDS.has(nearRoom.id)
          prompt = { text: isClinc ? `${nearRoom.name} — 진료 시작` : nearRoom.name, key: '↑' }
        } else if (nearSU) {
          prompt = { text: `${su.targetFloor}층으로`, key: '↑' }
        } else if (nearSD) {
          prompt = { text: `${sd.targetFloor}층으로`, key: '↓' }
        }
      }

      const prevKey = prevPromptRef.current?.text
      const nextKey = prompt?.text
      if (prevKey !== nextKey) {
        prevPromptRef.current = prompt
        setRoomPrompt(prompt)
      }

      gameLoopRef.current = requestAnimationFrame(loop)
    }

    gameLoopRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(gameLoopRef.current)
  }, [timeOfDay])

  // ─── NPC 클릭 ─────────────────────────────────────────────────
  const handleNPCClick = useCallback((npc) => {
    if (hasDialogueRef.current || floorTransitionRef.current) return
    if (Math.abs(playerXRef.current - npc.x) < INTERACT_RANGE + 20) openNPC(npc)
  }, [openNPC])

  // 가이드 선배의 현재 위치 (guided 모드일 때만)
  const currentWP = guided && !tourComplete ? GUIDED_WAYPOINTS[guidedStep] : null
  const seniorGuidePos = currentWP ? { floor: currentWP.floor, x: currentWP.x } : null

  return {
    currentFloor, playerX, facing, walking, walkFrame,
    activeDialogue, roomDescription, dialogueVisible,
    floorTransition, roomPrompt,
    closeDialogue, handleNPCClick,
    seniorGuidePos, tourComplete,
  }
}
