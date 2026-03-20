import { useState, useEffect, useRef, useCallback } from 'react'
import { FLOORS, ROOM_DESCRIPTIONS, PLAYER_SPEED, INTERACT_RANGE, CLINIC_IDS } from '../data/hospitalMap'
import { getNPCDialogues } from '../data/corridorEvents'

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

export default function useHospitalNavigation({ timeOfDay, onEnterClinic, onComplete, professorRelationLevel = 'neutral', nurseRelationLevel = 'neutral', initialDialogue = null, onInitialDialogueSeen = null }) {
  const [currentFloor, setCurrentFloor] = useState(1)
  const [playerX, setPlayerX] = useState(80)
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
      onEnterClinic()
      return
    }
    setRoomDescription({ ...room, description: ROOM_DESCRIPTIONS[room.id] || '' })
    setDialogueVisible(true)
  }, [timeOfDay, onEnterClinic])

  const openNPC = useCallback((npc) => {
    const dialogues = getNPCDialogues(npc.id, professorRelationLevel, nurseRelationLevel)
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
    setTimeout(() => {
      setActiveDialogue(null)
      setRoomDescription(null)
      if (wasInitial) onInitialDialogueSeenRef.current?.()
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

  return {
    currentFloor, playerX, facing, walking, walkFrame,
    activeDialogue, roomDescription, dialogueVisible,
    floorTransition, roomPrompt,
    closeDialogue, handleNPCClick,
  }
}
