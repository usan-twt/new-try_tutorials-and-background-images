import { useState, useCallback, useMemo } from 'react'

// 스크립트 진행 상태
// phase: opening → playing → closing → done
export default function useScriptEngine(script, episodeConfig = {}) {
  const [phase, setPhase] = useState('opening')
  const [turnIndex, setTurnIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [waitingForChoice, setWaitingForChoice] = useState(false)
  const [showSeniorGuide, setShowSeniorGuide] = useState(false)
  const [lastFamily, setLastFamily] = useState(null)
  const [usedFamilies, setUsedFamilies] = useState(new Set())
  const [innerVoice, setInnerVoice] = useState(null)

  // Phase 3: 턴/라포 상태
  const [exchangeCount, setExchangeCount] = useState(0)
  const [rapportFamilyCount, setRapportFamilyCount] = useState(0)
  const [isOvertime, setIsOvertime] = useState(false)
  const [overtimeTurns, setOvertimeTurns] = useState(0)

  const totalTurns = script?.turns?.length ?? 0
  const maxTurns = episodeConfig.maxTurns ?? null
  const rapportGating = episodeConfig.rapportGating ?? script?.rapportGating ?? null

  // 라포 달성 여부
  const rapportUnlocked = rapportGating
    ? rapportFamilyCount >= rapportGating.threshold
    : true

  // 남은 턴 (표시용)
  const turnsRemaining = maxTurns !== null
    ? Math.max(0, maxTurns - exchangeCount)
    : null

  const currentTurn = useMemo(() => {
    if (phase !== 'playing' || turnIndex >= totalTurns) return null
    return script.turns[turnIndex]
  }, [phase, turnIndex, totalTurns, script])

  // Phase 2+: 현재 턴의 선택지 목록 계산
  const currentChoices = useMemo(() => {
    if (!currentTurn) return null

    // Phase 1: 단일 선택지
    if (currentTurn.choice) {
      return null
    }

    // Turn 0: firstChoices
    if (currentTurn.firstChoices) {
      return currentTurn.firstChoices
    }

    // 이후 턴: pivots + continue
    const choices = []

    if (currentTurn.pivots) {
      for (const pivot of currentTurn.pivots) {
        choices.push(pivot)
      }
    }

    // 같은 family 연속 시 continue 선택지로 교체
    if (lastFamily && currentTurn.continue) {
      const continueKey = `after_${lastFamily}`
      const continueChoice = currentTurn.continue[continueKey]
      if (continueChoice) {
        const idx = choices.findIndex(c => c.family === continueChoice.family)
        if (idx !== -1) {
          choices[idx] = continueChoice
        }
      }
    }

    return choices.length > 0 ? choices : null
  }, [currentTurn, lastFamily])

  // 오프닝 완료 → 첫 턴 시작
  const beginPlaying = useCallback(() => {
    if (!script) return

    setMessages([{
      id: 'opening',
      speaker: script.opening.speaker,
      text: script.opening.text,
    }])
    setPhase('playing')
    setTurnIndex(0)
    setWaitingForChoice(true)
    setLastFamily(null)
    setUsedFamilies(new Set())
    setInnerVoice(null)
    setExchangeCount(0)
    setRapportFamilyCount(0)
    setIsOvertime(false)
    setOvertimeTurns(0)

    const firstTurn = script.turns[0]
    if (firstTurn?.seniorGuide?.timing === 'before') {
      setShowSeniorGuide(true)
    }
  }, [script])

  // 턴 종료 시 공통 처리
  const advanceOrClose = useCallback((choiceIndex) => {
    const nextIndex = choiceIndex + 1
    if (nextIndex >= totalTurns) {
      // 스크립트 소진 → 클로징
      setTimeout(() => {
        // 라포 달성 여부에 따른 클로징 분기
        const closingData = rapportUnlocked && script.closingGated
          ? script.closingGated
          : script.closing
        setMessages(prev => [
          ...prev,
          {
            id: 'closing',
            speaker: closingData.speaker,
            text: closingData.text,
          },
        ])
        setPhase('closing')
      }, 800)
    } else {
      setTimeout(() => {
        setTurnIndex(nextIndex)
        setWaitingForChoice(true)
        const nextTurn = script.turns[nextIndex]
        if (nextTurn?.seniorGuide?.timing === 'before') {
          setShowSeniorGuide(true)
        }
      }, 400)
    }
  }, [totalTurns, script, rapportUnlocked])

  // Phase 1: 단일 선택지 클릭
  const selectChoice = useCallback(() => {
    if (!currentTurn || !waitingForChoice || !currentTurn.choice) return

    setWaitingForChoice(false)
    setShowSeniorGuide(false)

    const turn = currentTurn
    const choiceIndex = turnIndex

    setMessages(prev => [
      ...prev,
      {
        id: `doctor-${choiceIndex}`,
        speaker: 'doctor',
        text: turn.choice.text,
      },
    ])

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `patient-${choiceIndex}`,
          speaker: turn.response.speaker,
          text: turn.response.text,
          emotion: turn.response.emotion,
        },
      ])

      if (turn.seniorGuide?.timing === 'after') {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: `senior-${choiceIndex}`,
              speaker: 'senior',
              text: turn.seniorGuide.text,
            },
          ])
        }, 500)
      }

      advanceOrClose(choiceIndex)
    }, 800)
  }, [currentTurn, waitingForChoice, turnIndex, advanceOrClose])

  // Phase 2+: 방향 선택지 클릭
  const selectDirectionChoice = useCallback((choice) => {
    if (!currentTurn || !waitingForChoice) return

    setWaitingForChoice(false)
    setInnerVoice(null)

    const choiceIndex = turnIndex
    const responseData = currentTurn.responses?.[choice.intent]
    if (!responseData) return

    // family 추적
    setLastFamily(choice.family)
    setUsedFamilies(prev => new Set([...prev, choice.family]))

    // 교환 카운트 증가
    const newExchangeCount = exchangeCount + 1
    setExchangeCount(newExchangeCount)

    // Phase 3: 초과 진료 체크
    if (maxTurns !== null && newExchangeCount > maxTurns && !isOvertime) {
      setIsOvertime(true)
    }
    if (maxTurns !== null && newExchangeCount > maxTurns) {
      setOvertimeTurns(prev => prev + 1)
    }

    // Phase 3: 라포 카운트 (emotional/life)
    if (rapportGating && rapportGating.families.includes(choice.family)) {
      setRapportFamilyCount(prev => prev + 1)
    }

    // 라포 게이팅 적용: gatedResponse가 있고 라포 달성 시 교체
    // 현재 rapportFamilyCount는 아직 업데이트 전이므로 +1 고려
    const currentRapportCount = rapportGating && rapportGating.families.includes(choice.family)
      ? rapportFamilyCount + 1
      : rapportFamilyCount
    const isUnlocked = rapportGating
      ? currentRapportCount >= rapportGating.threshold
      : true

    const response = (isUnlocked && responseData.gatedResponse)
      ? responseData.gatedResponse
      : responseData

    // 의사 발화
    setMessages(prev => [
      ...prev,
      {
        id: `doctor-${choiceIndex}-${choice.intent}`,
        speaker: 'doctor',
        text: choice.text,
      },
    ])

    setTimeout(() => {
      // 내면 독백
      if (response.innerVoice) {
        setInnerVoice(response.innerVoice)
        setTimeout(() => setInnerVoice(null), 2500)
      }

      // 환자 반응
      setMessages(prev => [
        ...prev,
        {
          id: `patient-${choiceIndex}-${choice.intent}`,
          speaker: 'patient',
          text: response.text,
          emotion: response.emotion,
        },
      ])

      // Phase 3: 턴 소진 시 간호사 메시지
      if (maxTurns !== null && newExchangeCount === maxTurns) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: `nurse-overtime-${choiceIndex}`,
              speaker: 'system',
              text: '대기 환자가 있습니다.',
            },
          ])
        }, 600)
      }

      advanceOrClose(choiceIndex)
    }, 800)
  }, [currentTurn, waitingForChoice, turnIndex, exchangeCount, maxTurns,
      isOvertime, rapportGating, rapportFamilyCount, advanceOrClose])

  const finishConsultation = useCallback(() => {
    setPhase('done')
  }, [])

  const reset = useCallback(() => {
    setPhase('opening')
    setTurnIndex(0)
    setMessages([])
    setWaitingForChoice(false)
    setShowSeniorGuide(false)
    setLastFamily(null)
    setUsedFamilies(new Set())
    setInnerVoice(null)
    setExchangeCount(0)
    setRapportFamilyCount(0)
    setIsOvertime(false)
    setOvertimeTurns(0)
  }, [])

  return {
    phase,
    turnIndex,
    totalTurns,
    messages,
    currentTurn,
    currentChoices,
    waitingForChoice,
    showSeniorGuide,
    lastFamily,
    usedFamilies,
    innerVoice,
    // Phase 3
    exchangeCount,
    turnsRemaining,
    maxTurns,
    isOvertime,
    overtimeTurns,
    rapportUnlocked,
    beginPlaying,
    selectChoice,
    selectDirectionChoice,
    finishConsultation,
    reset,
  }
}
