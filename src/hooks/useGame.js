import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import allEpisodes, { interludes, dayBudgets, dayConfig } from '../data/allEpisodes'
import { getApartmentTier } from '../data/apartmentData'
import { getRelationLevel, episodeNurseDelta, applyRelationDelta } from '../data/relationThresholds'
import { evaluatePhase, PHASE_N } from '../data/evaluationData'
import { NURSE_RUMOR, PERFORMANCE_NOTICE } from '../data/corporateHospitalEvents'
import { getMealInterlude } from '../data/mealScenes'

// ── 선택지 계산 ──
function computeChoices(turn, lastFamily, turnsRemaining, usedFamilies, activeEvent) {
  if (!turn) return null
  if (turn.choice) return null // Phase 1
  if (turn.firstChoices) return turn.firstChoices

  let choices = turn.pivots ? [...turn.pivots] : []
  if (lastFamily && turn.continue) {
    const cont = turn.continue[`after_${lastFamily}`]
    if (cont) {
      const idx = choices.findIndex(c => c.family === cont.family)
      if (idx !== -1) choices[idx] = cont
    }
  }

  // turnsRemaining이 적을 때 priority가 높은(숫자 큰) 선택지 제거 — 시간 부족의 서사적 표현
  if (turnsRemaining !== null && turnsRemaining <= 2 && choices.length > 2) {
    choices = choices.filter(c => !c.priority || c.priority <= 2)
  }
  if (turnsRemaining !== null && turnsRemaining <= 1 && choices.length > 1) {
    choices = choices.filter(c => !c.priority || c.priority <= 1)
  }

  // Phase 4+: requiresFamily — 해당 family를 이미 사용한 경우에만 노출
  if (usedFamilies) {
    choices = choices.filter(c => !c.requiresFamily || usedFamilies.has(c.requiresFamily))
  }
  // Phase 4+: requiresContext — 현재 이벤트 맥락이 일치하는 경우에만 노출
  if (activeEvent !== undefined) {
    choices = choices.filter(c => !c.requiresContext || c.requiresContext === activeEvent)
  }

  return choices.length > 0 ? choices : null
}

// 식사 인터루드 placeholder를 economy 기반 실제 장면으로 교체
function resolveInterlude(interlude, economy) {
  if (interlude?.type === 'meal') return getMealInterlude(economy)
  return interlude
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
    isFinalEpisode: false, missedCount: 0,
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

  // ── 경제 시스템 ──
  const [economy, setEconomy] = useState(50)
  const [pendingMove, setPendingMove] = useState(null)
  const [postApartmentScreen, setPostApartmentScreen] = useState('phaseIntro')

  // ── 관계 시스템 ──
  const [professorRelation, setProfessorRelation] = useState(50)
  const [nurseRelation, setNurseRelation] = useState(50)

  // ── 전공의 평가 ──
  const [lastEvalGrade, setLastEvalGrade] = useState(null)

  // ── 점진적 노출 (기업 병원) ──
  const [pendingRumor, setPendingRumor] = useState(null)     // 소문 채널
  const [pendingDocument, setPendingDocument] = useState(null) // 제도 채널

  // Phase 3 상태
  const [exchangeCount, setExchangeCount] = useState(0)
  const [rapportCount, setRapportCount] = useState(0)
  const [isOvertime, setIsOvertime] = useState(false)
  const [overtimeTurns, setOvertimeTurns] = useState(0)
  const [dayTurnsUsed, setDayTurnsUsed] = useState(0)

  // Phase 4+ 상태
  const [activeEvent, setActiveEvent] = useState(null)       // 'food_poisoning' | 'flu' | null
  const [dailyPatientCounts, setDailyPatientCounts] = useState([]) // 하루별 진료 환자 수 누산
  const [dayPatientsSeen, setDayPatientsSeen] = useState(0)  // 오늘 진료한 환자 수
  const [postNewsScreen, setPostNewsScreen] = useState('morningNav')

  // ── 파생 값 ──
  const ep = allEpisodes[epIndex] || null
  const script = ep?.script || null
  const totalTurns = script?.turns?.length ?? 0
  const maxTurns = ep?.maxTurns ?? null
  const minTurns = ep?.minTurns ?? null
  const rapportGating = ep?.rapportGating ?? null
  const rapportUnlocked = rapportGating ? rapportCount >= rapportGating.threshold : true
  const dayBudget = ep?.day != null ? (dayBudgets[ep.day] ?? null) : null
  // 선택지 필터링: 에피소드 자체 턴 기준 (ep 간 공유 안 함)
  const turnsRemaining = maxTurns !== null ? Math.max(0, maxTurns - exchangeCount) : null
  // 도트 인디케이터 & 오버타임: day budget 기준
  const dayTurnsRemaining = dayBudget ? Math.max(0, dayBudget.totalTurns - dayTurnsUsed) : null
  // Phase 4+: minTurns 이후 진료 자발 종료 가능
  const canEndConsultation = minTurns !== null && exchangeCount >= minTurns && phase === 'playing'

  const apartmentTier = getApartmentTier(economy)
  const professorRelationLevel = getRelationLevel(professorRelation)
  const nurseRelationLevel = getRelationLevel(nurseRelation)

  const currentTurn = useMemo(() => {
    if (phase !== 'playing' || turnIndex >= totalTurns) return null
    return script.turns[turnIndex]
  }, [phase, turnIndex, totalTurns, script])

  const currentChoices = useMemo(
    () => computeChoices(currentTurn, lastFamily, turnsRemaining, usedFamilies, activeEvent),
    [currentTurn, lastFamily, turnsRemaining, usedFamilies, activeEvent],
  )

  // ── 스크립트 리셋 ──
  const resetScript = useCallback((episode, resetDay = false, withTransition = false) => {
    setPhase(withTransition ? 'entering' : 'opening')
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
    if (resetDay) setDayTurnsUsed(0)
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
    setDayEndState({ patients: [], unasked: [], lastScene: [], overtime: [], isFinalEpisode: false, missedCount: 0 })
    setDayTurnsUsed(0)
    setDayPatientsSeen(0)
    setDailyPatientCounts([])
    setActiveEvent(null)
    setEconomy(50)
    setPendingMove(null)
    setProfessorRelation(50)
    setNurseRelation(50)
    setLastEvalGrade(null)
    setPendingRumor(null)
    setPendingDocument(null)
    setGuidedTourDone(false)
    setScreen('corridor')
  }, [])

  const finishCorridor = useCallback(() => {
    setScreen('morningNav')
  }, [])

  const [guidedTourDone, setGuidedTourDone] = useState(false)
  const finishMorningNav = useCallback(() => {
    setGuidedTourDone(true)
    // Phase 4+: 같은 Phase 내 일 전환이면 phaseIntro 없이 바로 진료
    const ep = allEpisodes[epIndex]
    const prevEp = allEpisodes[epIndex - 1]
    const isSamePhaseDayTransition = ep && prevEp && ep.phase >= 4 && ep.phase === prevEp.phase
    if (isSamePhaseDayTransition) {
      const episode = allEpisodes[epIndex]
      resetScript(episode, true)
      setScreen('consultation')
    } else {
      setScreen('phaseIntro')
    }
  }, [epIndex, resetScript])

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

  const finishApartment = useCallback(() => {
    setPendingMove(null)
    if (postApartmentScreen === 'interlude') {
      setScreen('interlude')
    } else if (postApartmentScreen === 'morningNav') {
      setScreen('morningNav')
    } else {
      const episode = allEpisodes[epIndex]
      resetScript(episode)
      setScreen('consultation')
    }
    setPostApartmentScreen('phaseIntro')
  }, [epIndex, postApartmentScreen, resetScript])

  // ── 진료 종료 → dayEnd ──
  const endConsultation = useCallback(() => { setPhase('done') }, [])
  // ── 환자 입장 전환 완료 → opening ──
  const beginOpening = useCallback(() => { setPhase('opening') }, [])

  // phase === 'done'이 되면 App에서 호출
  // Phase 4+: 일(day) 경계도 eveningNav → DayEnd로 처리
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
    // Phase 4+: 일 경계도 DayEnd 화면 표시
    const isDayBoundary = ep.phase >= 4 && (isFinal || !nextEp || nextEp.day !== ep.day)
    const shouldShowDayEnd = isPhaseEnd || isDayBoundary

    // 에피소드 완료: 라포 기반 간호사 관계 변동
    const nurseDelta = episodeNurseDelta(rapportCount, rapportGating)
    if (nurseDelta !== 0) setNurseRelation(prev => applyRelationDelta(prev, nurseDelta))

    // 오늘 진료 환자 수 누적
    const newDayPatientsSeen = dayPatientsSeen + 1
    setDayPatientsSeen(newDayPatientsSeen)

    if (shouldShowDayEnd) {
      // Phase 4+: 일 단위로 dailyPatientCounts 기록
      if (ep.phase >= 4) {
        setDailyPatientCounts(prev => [...prev, newDayPatientsSeen])
      }
      // 미진료 환자 수: 해당 일의 전체 에피소드 수 - 실제 진료 수
      const totalForDay = ep.phase >= 4
        ? allEpisodes.filter(e => e.phase === ep.phase && e.day === ep.day).length
        : 0
      const missedCount = Math.max(0, totalForDay - newDayPatientsSeen)

      const newState = {
        patients: [...dayEndStateRef.current.patients, { name: patient.name, age: patient.age, chiefComplaint: patient.chiefComplaint }],
        unasked: [...dayEndStateRef.current.unasked, ...unasked],
        lastScene: [...dayEndStateRef.current.lastScene, ...lastScene],
        overtime: [...dayEndStateRef.current.overtime, ...overtime],
        isFinalEpisode: isFinal,
        missedCount,
      }
      setDayEndState(newState)
      setScreen('eveningNav')
    } else {
      // Phase 중간 → DayEnd 건너뛰고 바로 다음 에피소드
      const newState = {
        patients: [...dayEndStateRef.current.patients, { name: patient.name, age: patient.age, chiefComplaint: patient.chiefComplaint }],
        unasked: [...dayEndStateRef.current.unasked, ...unasked],
        lastScene: [...dayEndStateRef.current.lastScene, ...lastScene],
        overtime: [...dayEndStateRef.current.overtime, ...overtime],
        isFinalEpisode: false,
        missedCount: 0,
      }
      setDayEndState(newState)

      const next = epIndex + 1
      setEpIndex(next)
      const isNewDay = nextEp.day !== ep.day

      if (nextEp.interludeBefore && interludes[nextEp.interludeBefore]) {
        setCurrentInterlude(resolveInterlude(interludes[nextEp.interludeBefore], economy))
        setPostInterludeScreen('consultation')
        setScreen('interlude')
      } else {
        resetScript(nextEp, isNewDay, true)
        setScreen('consultation')
      }
    }
  }, [ep, epIndex, resetScript, rapportCount, rapportGating, economy, dayPatientsSeen])

  const nextEpisode = useCallback(() => {
    const completedEp = allEpisodes[epIndex]
    const completedDay = completedEp?.day ?? null
    const completedPhase = currentPhase

    const next = epIndex + 1
    const isFinal = next >= allEpisodes.length
    const nextEp = isFinal ? null : allEpisodes[next]
    const isNewPhase = isFinal || nextEp.phase !== completedPhase
    // Phase 4+: 일(day) 경계 — 같은 Phase 내에서도 dayEnd가 발생
    const isPhase4DayTransition = completedPhase >= 4 && !isNewPhase

    // ── Economy & 관계 변동 ──
    let newEconomy = economy
    if (completedPhase >= 4) {
      // Phase 4+: 하루별 [(진료 환자 수 - N) + 2] × 2
      const N = PHASE_N[completedPhase] ?? 5
      const dayDelta = (dayPatientsSeen - N + 2) * 2
      newEconomy = Math.min(100, Math.max(0, economy + dayDelta))
      setEconomy(newEconomy)
      setLastEvalGrade(null)
      // tier 변경은 Phase 말에만 확정
      if (isNewPhase) {
        const prevTier = getApartmentTier(economy)
        const newTier = getApartmentTier(newEconomy)
        setPendingMove(prevTier !== newTier ? { from: prevTier, to: newTier } : null)
      } else {
        setPendingMove(null)
      }
    } else {
      // Phase 1–3: 오버타임 횟수 기반 등급
      const overtimeCount = dayEndStateRef.current.overtime.length
      const { grade, economyDelta, profRelationDelta } = evaluatePhase(completedPhase, overtimeCount)
      setLastEvalGrade(grade)
      if (profRelationDelta !== 0) setProfessorRelation(prev => applyRelationDelta(prev, profRelationDelta))
      newEconomy = Math.min(100, Math.max(0, economy + economyDelta))
      const prevTier = getApartmentTier(economy)
      const newTier = getApartmentTier(newEconomy)
      setEconomy(newEconomy)
      setPendingMove(prevTier !== newTier ? { from: prevTier, to: newTier } : null)
    }

    // ── 게임 종료 ──
    if (isFinal) {
      setPendingDocument(PERFORMANCE_NOTICE)
      setScreen('complete')
      return
    }

    setEpIndex(next)
    setCurrentPhase(nextEp.phase)

    // ── Phase 전환 초기화 ──
    if (isNewPhase) {
      setDayEndState({ patients: [], unasked: [], lastScene: [], overtime: [], isFinalEpisode: false, missedCount: 0 })
      setDayTurnsUsed(0)
      setDayPatientsSeen(0)
      setDailyPatientCounts([])
      if (nextEp.phase === 3) setPendingRumor(NURSE_RUMOR)
      // Phase 4 진입: 식중독 뉴스 이벤트
      if (nextEp.phase === 4) {
        setActiveEvent('food_poisoning')
        setPostNewsScreen('morningNav')
        setScreen('news')
        return
      }
      // Phase 5 진입: 독감 뉴스 이벤트
      if (nextEp.phase === 5) {
        setActiveEvent('flu')
        setPostNewsScreen('morningNav')
        setScreen('news')
        return
      }
    } else if (isPhase4DayTransition) {
      // Phase 4+ 일 전환: dayEnd 데이터만 초기화, dailyPatientCounts는 유지
      setDayEndState({ patients: [], unasked: [], lastScene: [], overtime: [], isFinalEpisode: false, missedCount: 0 })
      setDayTurnsUsed(0)
      setDayPatientsSeen(0)
    }

    // ── 자취방 등장 체크 ──
    if (completedDay && dayConfig[completedDay]?.showApartment) {
      const goToMorning = isNewPhase || isPhase4DayTransition
      if (nextEp.interludeBefore && interludes[nextEp.interludeBefore]) {
        setCurrentInterlude(resolveInterlude(interludes[nextEp.interludeBefore], newEconomy))
        setPostInterludeScreen(goToMorning ? 'morningNav' : 'consultation')
        setPostApartmentScreen('interlude')
      } else if (goToMorning) {
        setPostApartmentScreen('morningNav')
      } else {
        setPostApartmentScreen('consultation')
      }
      setScreen('apartment')
      return
    }

    // ── 인터루드 체크 ──
    if (nextEp.interludeBefore && interludes[nextEp.interludeBefore]) {
      const goToMorning = isNewPhase || isPhase4DayTransition
      setCurrentInterlude(resolveInterlude(interludes[nextEp.interludeBefore], newEconomy))
      setPostInterludeScreen(goToMorning ? 'morningNav' : 'consultation')
      setScreen('interlude')
      return
    }

    // ── 화면 전환 ──
    if (isNewPhase || isPhase4DayTransition) {
      setScreen('morningNav')
    } else {
      resetScript(nextEp)
      setScreen('consultation')
    }
  }, [epIndex, currentPhase, economy, dayPatientsSeen, resetScript])

  // ══════════ 스크립트 엔진 액션 ══════════

  const beginPlaying = useCallback(() => {
    if (!script) return
    const nurseInfo = script.nurseInfo

    if (nurseInfo?.available) {
      // 1단계: 간호사 메시지 먼저
      setMessages([{ id: 'nurseInfo', speaker: 'nurse', text: nurseInfo.text }])
      setPhase('playing')
      // 2단계: 딜레이 후 opening + 선택지 활성화
      setTimeout(() => {
        setMessages(prev => [...prev, { id: 'opening', speaker: script.opening.speaker, text: script.opening.text }])
        setTurnIndex(0)
        setWaitingForChoice(true)
        if (script.turns[0]?.seniorGuide?.timing === 'before') setShowSeniorGuide(true)
      }, 1200)
    } else {
      setMessages([{ id: 'opening', speaker: script.opening.speaker, text: script.opening.text }])
      setPhase('playing')
      setTurnIndex(0)
      setWaitingForChoice(true)
      if (script.turns[0]?.seniorGuide?.timing === 'before') setShowSeniorGuide(true)
    }
  }, [script])

  // ── 통합 send: Phase 1 + Phase 2+ 모두 처리 ──
  const send = useCallback((choice) => {
    if (!currentTurn || !waitingForChoice) return

    setWaitingForChoice(false)
    setShowSeniorGuide(false)
    setInnerVoice(null)

    const idx = turnIndex

    // Phase 1: choice 객체 없이 호출됨
    if (currentTurn.choice) {
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

    let newDayTurnsUsed = dayTurnsUsed
    if (dayBudget) {
      newDayTurnsUsed = dayTurnsUsed + 1
      setDayTurnsUsed(newDayTurnsUsed)
    }

    const isOvertimeNow = dayBudget
      ? newDayTurnsUsed > dayBudget.totalTurns
      : maxTurns !== null && newExchange > maxTurns
    if (isOvertimeNow && !isOvertime) setIsOvertime(true)
    if (isOvertimeNow) setOvertimeTurns(prev => prev + 1)

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

      // day budget 소진 경고 (Phase 3: 일 턴 한도 도달 시 시스템 알림)
      if (dayBudget && newDayTurnsUsed === dayBudget.totalTurns) {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: `nurse-day-${idx}`, speaker: 'system', text: '대기 환자가 있습니다.' }])
        }, 600)
      }

      // Phase 4+: 에피소드 maxTurns - 2 도달 시 간호사 눈치 메시지
      if (maxTurns !== null && newExchange === maxTurns - 2) {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: `nurse-hint-${idx}`, speaker: 'nurse', text: '다음 환자 오실 시간이 가까워요.' }])
        }, 1000)
        advanceOrClose(idx, script, isUnlocked)
        return
      }

      // Phase 4+: 에피소드 maxTurns 도달 시 forceClose (강제 종료)
      if (maxTurns !== null && newExchange >= maxTurns) {
        const fc = script.forceClose
        setTimeout(() => {
          const forceMessages = []
          if (fc?.nurse) forceMessages.push({ id: `fc-nurse-${idx}`, speaker: 'nurse', text: fc.nurse })
          if (fc?.patient) forceMessages.push({ id: `fc-patient-${idx}`, speaker: 'patient', text: fc.patient })
          setMessages(prev => [...prev, ...forceMessages])
          setPhase('closing')
        }, 600)
        return // advanceOrClose 호출 안 함
      }

      advanceOrClose(idx, script, isUnlocked)
    }, 800)
  }, [currentTurn, waitingForChoice, turnIndex, script, exchangeCount, maxTurns,
      isOvertime, rapportGating, rapportCount, rapportUnlocked, advanceOrClose,
      dayBudget, dayTurnsUsed])

  // Phase 4+: 뉴스 화면 종료 → postNewsScreen으로 이동
  const finishNews = useCallback(() => {
    const dest = postNewsScreen
    setPostNewsScreen('morningNav')
    setScreen(dest)
  }, [postNewsScreen])

  // Phase 4+: minTurns 이후 플레이어가 진료를 자발적으로 종료
  const voluntaryClose = useCallback(() => {
    if (!canEndConsultation || !script) return
    const closing = rapportUnlocked && script.closingGated
      ? script.closingGated : script.closing
    setMessages(prev => [...prev, { id: 'closing-voluntary', speaker: closing.speaker, text: closing.text }])
    setPhase('closing')
  }, [canEndConsultation, script, rapportUnlocked])

  const clearRumor = useCallback(() => setPendingRumor(null), [])
  const clearDocument = useCallback(() => setPendingDocument(null), [])

  return {
    // 네비게이션
    screen, currentPhase, ep, dayEndState, currentInterlude,
    playerName, setPlayerName, startGame, finishCorridor,
    finishMorningNav, finishEveningNav,
    startConsultation, nextEpisode, finishInterlude, finishApartment,
    // 경제 시스템
    economy, apartmentTier, pendingMove,
    // 관계 시스템
    professorRelation, nurseRelation, professorRelationLevel, nurseRelationLevel,
    // 전공의 평가
    lastEvalGrade,
    // 점진적 노출
    pendingRumor, clearRumor,
    pendingDocument, clearDocument,
    // 가이드 투어
    guidedTourDone,
    // 스크립트 엔진
    phase, messages, currentTurn, currentChoices, currentEmotion,
    waitingForChoice, showSeniorGuide, innerVoice,
    usedFamilies, turnsRemaining, maxTurns, isOvertime, rapportUnlocked,
    beginPlaying, beginOpening, send, endConsultation, buildDayEnd,
    exchangeCount, overtimeTurns, dayTurnsUsed, dayTurnsRemaining,
    dayBudgetTotal: dayBudget?.totalTurns ?? null,
    // Phase 4+
    activeEvent, dailyPatientCounts, finishNews,
    minTurns, canEndConsultation, voluntaryClose,
  }
}
