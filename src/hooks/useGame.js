import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import allEpisodes, { interludes } from '../data/allEpisodes'

// ── 화면 전환 FSM ──
const TRANSITIONS = {
  title:        { START: 'corridor' },
  corridor:     { DONE: 'phaseIntro' },
  phaseIntro:   { READY: 'consultation' },
  consultation: { END: 'dayEnd' },
  dayEnd:       { NEXT: 'interlude', SKIP: 'phaseIntro', DONE: 'complete' },
  interlude:    { DONE: 'consultation' },
}

function nextScreen(current, action) {
  return TRANSITIONS[current]?.[action] || current
}

// ── 선택지 계산 ──
function computeChoices(turn, lastFamily) {
  if (!turn) return null
  if (turn.choice) return null // Phase 1
  if (turn.firstChoices) return turn.firstChoices

  const choices = turn.pivots ? [...turn.pivots] : []
  if (lastFamily && turn.continue) {
    const cont = turn.continue[`after_${lastFamily}`]
    if (cont) {
      const idx = choices.findIndex(c => c.family === cont.family)
      if (idx !== -1) choices[idx] = cont
    }
  }
  return choices.length > 0 ? choices : null
}

export default function useGame() {
  // ── 네비게이션 ──
  const [screen, setScreen] = useState('title')
  const [epIndex, setEpIndex] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(1)
  const [playerName, setPlayerName] = useState('')

  // ── DayEnd 데이터 ──
  const [dayEndState, setDayEndState] = useState({
    patients: [], unasked: [], lastScene: [], overtime: [],
    isFinalEpisode: false,
  })
  const dayEndStateRef = useRef(dayEndState)
  useEffect(() => { dayEndStateRef.current = dayEndState }, [dayEndState])

  // ── 인터루드 ──
  const [currentInterlude, setCurrentInterlude] = useState(null)
  const [postInterludeScreen, setPostInterludeScreen] = useState('consultation')

  // ── 스크립트 엔진 ──
  const [phase, setPhase] = useState('opening')   // opening | playing | closing | done
  const [turnIndex, setTurnIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [waitingForChoice, setWaitingForChoice] = useState(false)
  const [showSeniorGuide, setShowSeniorGuide] = useState(false)
  const [lastFamily, setLastFamily] = useState(null)
  const [usedFamilies, setUsedFamilies] = useState(new Set())
  const [innerVoice, setInnerVoice] = useState(null)
  const [currentEmotion, setCurrentEmotion] = useState('neutral')

  // Phase 3 상태
  const [exchangeCount, setExchangeCount] = useState(0)
  const [rapportCount, setRapportCount] = useState(0)
  const [isOvertime, setIsOvertime] = useState(false)
  const [overtimeTurns, setOvertimeTurns] = useState(0)

  // ── 파생 값 ──
  const ep = allEpisodes[epIndex] || null
  const script = ep?.script || null
  const totalTurns = script?.turns?.length ?? 0
  const maxTurns = ep?.maxTurns ?? null
  const rapportGating = ep?.rapportGating ?? null
  const rapportUnlocked = rapportGating ? rapportCount >= rapportGating.threshold : true
  const turnsRemaining = maxTurns !== null ? Math.max(0, maxTurns - exchangeCount) : null

  const currentTurn = useMemo(() => {
    if (phase !== 'playing' || turnIndex >= totalTurns) return null
    return script.turns[turnIndex]
  }, [phase, turnIndex, totalTurns, script])

  const currentChoices = useMemo(
    () => computeChoices(currentTurn, lastFamily),
    [currentTurn, lastFamily],
  )

  // ── 스크립트 리셋 ──
  const resetScript = useCallback((episode) => {
    setPhase('opening')
    setTurnIndex(0)
    setMessages([])
    setWaitingForChoice(false)
    setShowSeniorGuide(false)
    setLastFamily(null)
    setUsedFamilies(new Set())
    setInnerVoice(null)
    setCurrentEmotion(episode.patient.initialEmotion)
    setExchangeCount(0)
    setRapportCount(0)
    setIsOvertime(false)
    setOvertimeTurns(0)
  }, [])

  // ── 턴 진행 공통 ──
  const advanceOrClose = useCallback((choiceIndex, scriptRef, isRapportUnlocked) => {
    const next = choiceIndex + 1
    if (next >= scriptRef.turns.length) {
      setTimeout(() => {
        const closing = isRapportUnlocked && scriptRef.closingGated
          ? scriptRef.closingGated : scriptRef.closing
        setMessages(prev => [...prev, { id: 'closing', speaker: closing.speaker, text: closing.text }])
        setPhase('closing')
      }, 800)
    } else {
      setTimeout(() => {
        setTurnIndex(next)
        setWaitingForChoice(true)
        if (scriptRef.turns[next]?.seniorGuide?.timing === 'before') setShowSeniorGuide(true)
      }, 400)
    }
  }, [])

  // ══════════ 네비게이션 액션 ══════════

  const startGame = useCallback(() => {
    setEpIndex(0)
    setCurrentPhase(1)
    setDayEndState({ patients: [], unasked: [], lastScene: [], overtime: [], isFinalEpisode: false })
    setScreen('corridor')
  }, [])

  const finishCorridor = useCallback(() => {
    setScreen('morningNav')
  }, [])

  const finishMorningNav = useCallback(() => {
    setScreen('phaseIntro')
  }, [])

  const finishEveningNav = useCallback(() => {
    setScreen('dayEnd')
  }, [])

  const startConsultation = useCallback(() => {
    const episode = allEpisodes[epIndex]
    resetScript(episode)
    setScreen('consultation')
  }, [epIndex, resetScript])

  const finishInterlude = useCallback(() => {
    setCurrentInterlude(null)
    if (postInterludeScreen === 'morningNav') {
      setScreen('morningNav')
    } else {
      const episode = allEpisodes[epIndex]
      resetScript(episode)
      setScreen('consultation')
    }
    setPostInterludeScreen('consultation')
  }, [epIndex, resetScript, postInterludeScreen])

  // ── 진료 종료 → dayEnd ──
  const endConsultation = useCallback(() => {
    setPhase('done')
  }, [])

  // phase === 'done'이 되면 App에서 호출
  // Phase 마지막 에피소드면 DayEnd 화면으로, 아니면 누적 후 다음 consultation
  const buildDayEnd = useCallback((usedFams, extraInfo = {}) => {
    if (!ep) return
    const patient = ep.patient
    const families = usedFams ? Array.from(usedFams) : []
    const allFamilies = ['medical', 'life', 'emotional']
    const unused = allFamilies.filter(f => !families.includes(f))
    const dayEndExtra = ep.script?.dayEndExtra

    const unasked = []
    if (dayEndExtra?.unasked) {
      for (const f of unused) {
        if (dayEndExtra.unasked[f]) unasked.push({ patientName: patient.name, hint: dayEndExtra.unasked[f] })
      }
    }

    const lastScene = []
    if (dayEndExtra?.lastScene) {
      lastScene.push({
        patientName: patient.name,
        description: extraInfo.rapportUnlocked && dayEndExtra.lastSceneGated
          ? dayEndExtra.lastSceneGated : dayEndExtra.lastScene,
      })
    }

    const overtime = []
    if (extraInfo.isOvertime && extraInfo.overtimeTurns > 0) {
      overtime.push({ patientName: patient.name, note: `다음 환자가 ${extraInfo.overtimeTurns * 5}분 더 기다렸습니다.` })
    }

    const isFinal = epIndex + 1 >= allEpisodes.length
    const nextEp = allEpisodes[epIndex + 1]
    const isPhaseEnd = isFinal || !nextEp || nextEp.phase !== ep.phase

    // 환자 정보 누적
    const newState = {
      patients: [...dayEndStateRef.current.patients, { name: patient.name, age: patient.age, chiefComplaint: patient.chiefComplaint }],
      unasked: [...dayEndStateRef.current.unasked, ...unasked],
      lastScene: [...dayEndStateRef.current.lastScene, ...lastScene],
      overtime: [...dayEndStateRef.current.overtime, ...overtime],
      isFinalEpisode: isFinal,
    }
    setDayEndState(newState)

    if (isPhaseEnd) {
      // Phase 마지막 → 저녁 네비 → DayEnd 화면
      setScreen('eveningNav')
    } else {
      // Phase 중간 → DayEnd 건너뛰고 바로 다음 에피소드
      const next = epIndex + 1
      setEpIndex(next)

      // 인터루드 체크 (Phase 중간 → 항상 consultation으로)
      if (nextEp.interludeBefore && interludes[nextEp.interludeBefore]) {
        setCurrentInterlude(interludes[nextEp.interludeBefore])
        setPostInterludeScreen('consultation')
        setScreen('interlude')
      } else {
        resetScript(nextEp)
        setScreen('consultation')
      }
    }
  }, [ep, epIndex, resetScript])

  const nextEpisode = useCallback(() => {
    const next = epIndex + 1
    if (next >= allEpisodes.length) {
      setScreen('complete')
      return
    }

    const nextEp = allEpisodes[next]
    const isNewPhase = nextEp.phase !== currentPhase

    setEpIndex(next)
    setCurrentPhase(nextEp.phase)

    if (isNewPhase) {
      setDayEndState({ patients: [], unasked: [], lastScene: [], overtime: [], isFinalEpisode: false })
    }

    // 인터루드 체크
    if (nextEp.interludeBefore && interludes[nextEp.interludeBefore]) {
      setCurrentInterlude(interludes[nextEp.interludeBefore])
      setPostInterludeScreen(isNewPhase ? 'morningNav' : 'consultation')
      setScreen('interlude')
      return
    }

    if (isNewPhase) {
      setScreen('morningNav')
    } else {
      resetScript(nextEp)
      setScreen('consultation')
    }
  }, [epIndex, currentPhase, resetScript])

  // ══════════ 스크립트 엔진 액션 ══════════

  const beginPlaying = useCallback(() => {
    if (!script) return
    setMessages([{ id: 'opening', speaker: script.opening.speaker, text: script.opening.text }])
    setPhase('playing')
    setTurnIndex(0)
    setWaitingForChoice(true)
    if (script.turns[0]?.seniorGuide?.timing === 'before') setShowSeniorGuide(true)
  }, [script])

  // ── 통합 send: Phase 1 + Phase 2+ 모두 처리 ──
  const send = useCallback((choice) => {
    if (!currentTurn || !waitingForChoice) return

    setWaitingForChoice(false)
    setShowSeniorGuide(false)
    setInnerVoice(null)

    const idx = turnIndex
    const isPhase1 = !!currentTurn.choice

    // Phase 1: choice 객체 없이 호출됨
    if (isPhase1) {
      const turn = currentTurn
      setMessages(prev => [...prev, { id: `d-${idx}`, speaker: 'doctor', text: turn.choice.text }])

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `p-${idx}`, speaker: turn.response.speaker,
          text: turn.response.text, emotion: turn.response.emotion,
        }])
        if (turn.response.emotion) setCurrentEmotion(turn.response.emotion)

        if (turn.seniorGuide?.timing === 'after') {
          setTimeout(() => {
            setMessages(prev => [...prev, { id: `s-${idx}`, speaker: 'senior', text: turn.seniorGuide.text }])
          }, 500)
        }
        advanceOrClose(idx, script, rapportUnlocked)
      }, 800)
      return
    }

    // Phase 2+: choice 객체 필요
    if (!choice) return
    const responseData = currentTurn.responses?.[choice.intent]
    if (!responseData) return

    // family 추적
    setLastFamily(choice.family)
    setUsedFamilies(prev => new Set([...prev, choice.family]))

    const newExchange = exchangeCount + 1
    setExchangeCount(newExchange)
    if (maxTurns !== null && newExchange > maxTurns && !isOvertime) setIsOvertime(true)
    if (maxTurns !== null && newExchange > maxTurns) setOvertimeTurns(prev => prev + 1)

    // 라포 계산
    let newRapportCount = rapportCount
    if (rapportGating?.families.includes(choice.family)) {
      newRapportCount = rapportCount + 1
      setRapportCount(newRapportCount)
    }
    const isUnlocked = rapportGating ? newRapportCount >= rapportGating.threshold : true

    const response = (isUnlocked && responseData.gatedResponse) ? responseData.gatedResponse : responseData

    setMessages(prev => [...prev, { id: `d-${idx}-${choice.intent}`, speaker: 'doctor', text: choice.text }])

    setTimeout(() => {
      if (response.innerVoice) {
        setInnerVoice(response.innerVoice)
        setTimeout(() => setInnerVoice(null), 2500)
      }
      if (response.emotion) setCurrentEmotion(response.emotion)
      setMessages(prev => [...prev, {
        id: `p-${idx}-${choice.intent}`, speaker: 'patient',
        text: response.text, emotion: response.emotion,
      }])

      // 턴 소진 경고
      if (maxTurns !== null && newExchange === maxTurns) {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: `nurse-${idx}`, speaker: 'system', text: '대기 환자가 있습니다.' }])
        }, 600)
      }

      advanceOrClose(idx, script, isUnlocked)
    }, 800)
  }, [currentTurn, waitingForChoice, turnIndex, script, exchangeCount, maxTurns,
      isOvertime, rapportGating, rapportCount, rapportUnlocked, advanceOrClose])

  return {
    // 네비게이션
    screen, currentPhase, ep, dayEndState, currentInterlude,
    playerName, setPlayerName, startGame, finishCorridor,
    finishMorningNav, finishEveningNav,
    startConsultation, nextEpisode, finishInterlude,
    // 스크립트 엔진
    phase, messages, currentTurn, currentChoices, currentEmotion,
    waitingForChoice, showSeniorGuide, innerVoice,
    usedFamilies, turnsRemaining, maxTurns, isOvertime, rapportUnlocked,
    beginPlaying, send, endConsultation, buildDayEnd,
    exchangeCount, overtimeTurns,
  }
}
