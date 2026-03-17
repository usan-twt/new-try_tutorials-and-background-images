import { useState, useCallback, useMemo } from 'react'

// 스크립트 진행 상태
// phase: opening → playing → closing → done
export default function useScriptEngine(script) {
  const [phase, setPhase] = useState('opening')
  const [turnIndex, setTurnIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [waitingForChoice, setWaitingForChoice] = useState(false)
  const [showSeniorGuide, setShowSeniorGuide] = useState(false)

  const totalTurns = script?.turns?.length ?? 0

  const currentTurn = useMemo(() => {
    if (phase !== 'playing' || turnIndex >= totalTurns) return null
    return script.turns[turnIndex]
  }, [phase, turnIndex, totalTurns, script])

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

    // 첫 턴에 선배 가이드가 있으면 표시
    const firstTurn = script.turns[0]
    if (firstTurn?.seniorGuide?.timing === 'before') {
      setShowSeniorGuide(true)
    }
  }, [script])

  // 선택지 클릭 처리
  const selectChoice = useCallback(() => {
    if (!currentTurn || !waitingForChoice) return

    setWaitingForChoice(false)
    setShowSeniorGuide(false)

    const turn = currentTurn
    const choiceIndex = turnIndex

    // 의사 발화 추가
    setMessages(prev => [
      ...prev,
      {
        id: `doctor-${choiceIndex}`,
        speaker: 'doctor',
        text: turn.choice.text,
      },
    ])

    // 0.8초 후 환자 반응
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

      // after 타이밍 선배 가이드
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

      // 다음 턴 또는 종료
      const nextIndex = choiceIndex + 1
      if (nextIndex >= totalTurns) {
        // 클로징으로
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

          // 다음 턴의 before 선배 가이드
          const nextTurn = script.turns[nextIndex]
          if (nextTurn?.seniorGuide?.timing === 'before') {
            setShowSeniorGuide(true)
          }
        }, 400)
      }
    }, 800)
  }, [currentTurn, waitingForChoice, turnIndex, totalTurns, script])

  // 클로징 확인 → 진료 종료
  const finishConsultation = useCallback(() => {
    setPhase('done')
  }, [])

  // 엔진 리셋 (새 에피소드용)
  const reset = useCallback(() => {
    setPhase('opening')
    setTurnIndex(0)
    setMessages([])
    setWaitingForChoice(false)
    setShowSeniorGuide(false)
  }, [])

  return {
    phase,
    turnIndex,
    totalTurns,
    messages,
    currentTurn,
    waitingForChoice,
    showSeniorGuide,
    beginPlaying,
    selectChoice,
    finishConsultation,
    reset,
  }
}
