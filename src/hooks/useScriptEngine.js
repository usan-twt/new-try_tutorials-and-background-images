import { useState, useCallback, useMemo } from 'react'

// 스크립트 진행 상태
// phase: opening → playing → closing → done
export default function useScriptEngine(script) {
  const [phase, setPhase] = useState('opening')
  const [turnIndex, setTurnIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [waitingForChoice, setWaitingForChoice] = useState(false)
  const [showSeniorGuide, setShowSeniorGuide] = useState(false)
  const [lastFamily, setLastFamily] = useState(null)
  const [usedFamilies, setUsedFamilies] = useState(new Set())
  const [innerVoice, setInnerVoice] = useState(null)

  const totalTurns = script?.turns?.length ?? 0

  const currentTurn = useMemo(() => {
    if (phase !== 'playing' || turnIndex >= totalTurns) return null
    return script.turns[turnIndex]
  }, [phase, turnIndex, totalTurns, script])

  // Phase 2+: 현재 턴의 선택지 목록 계산
  const currentChoices = useMemo(() => {
    if (!currentTurn) return null

    // Phase 1: 단일 선택지
    if (currentTurn.choice) {
      return null // ChoicePanel이 Phase 1 모드로 동작
    }

    // Turn 0: firstChoices
    if (currentTurn.firstChoices) {
      return currentTurn.firstChoices
    }

    // 이후 턴: pivots + continue (같은 family 연속 시)
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
        // 같은 family의 pivot을 continue로 교체
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

    // 첫 턴에 선배 가이드가 있으면 표시 (Phase 1)
    const firstTurn = script.turns[0]
    if (firstTurn?.seniorGuide?.timing === 'before') {
      setShowSeniorGuide(true)
    }
  }, [script])

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

      const nextIndex = choiceIndex + 1
      if (nextIndex >= totalTurns) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: 'closing',
              speaker: script.closing.speaker,
              text: script.closing.text,
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
    }, 800)
  }, [currentTurn, waitingForChoice, turnIndex, totalTurns, script])

  // Phase 2+: 방향 선택지 클릭
  const selectDirectionChoice = useCallback((choice) => {
    if (!currentTurn || !waitingForChoice) return

    setWaitingForChoice(false)
    setInnerVoice(null)

    const choiceIndex = turnIndex
    const response = currentTurn.responses?.[choice.intent]
    if (!response) return

    // family 추적
    setLastFamily(choice.family)
    setUsedFamilies(prev => new Set([...prev, choice.family]))

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
      // 내면 독백 (있으면)
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

      // 다음 턴 또는 종료
      const nextIndex = choiceIndex + 1
      if (nextIndex >= totalTurns) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: 'closing',
              speaker: script.closing.speaker,
              text: script.closing.text,
            },
          ])
          setPhase('closing')
        }, 800)
      } else {
        setTimeout(() => {
          setTurnIndex(nextIndex)
          setWaitingForChoice(true)
        }, 400)
      }
    }, 800)
  }, [currentTurn, waitingForChoice, turnIndex, totalTurns, script])

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
    beginPlaying,
    selectChoice,
    selectDirectionChoice,
    finishConsultation,
    reset,
  }
}
