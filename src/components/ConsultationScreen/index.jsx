import { useEffect, useCallback, useState } from 'react'
import useScriptEngine from '../../hooks/useScriptEngine'
import PatientArea from './PatientArea'
import DialogArea from './DialogArea'
import ChoicePanel from './ChoicePanel'
import InnerVoice from './InnerVoice'
import NotebookPanel from '../NotebookPanel'
import './ConsultationScreen.css'

export default function ConsultationScreen({ episode, onEnd }) {
  const {
    phase,
    messages,
    currentTurn,
    currentChoices,
    waitingForChoice,
    showSeniorGuide,
    usedFamilies,
    innerVoice,
    beginPlaying,
    selectChoice,
    selectDirectionChoice,
    finishConsultation,
    reset,
  } = useScriptEngine(episode.script)

  const [currentEmotion, setCurrentEmotion] = useState(
    episode.patient.initialEmotion
  )
  const [fadeIn, setFadeIn] = useState(false)

  const showNotebook = episode.phase >= 2 && episode.notebook

  // 진입 페이드인
  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(t)
  }, [])

  // 에피소드 변경 시 리셋
  useEffect(() => {
    reset()
    setCurrentEmotion(episode.patient.initialEmotion)
    setFadeIn(false)
    const t = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(t)
  }, [episode.id])

  // 오프닝 → 플레이 자동 전환
  useEffect(() => {
    if (phase === 'opening') {
      const t = setTimeout(() => beginPlaying(), 1200)
      return () => clearTimeout(t)
    }
  }, [phase, beginPlaying])

  // 감정 상태 추적
  useEffect(() => {
    const patientMessages = messages.filter(m => m.emotion)
    if (patientMessages.length > 0) {
      const latest = patientMessages[patientMessages.length - 1]
      setCurrentEmotion(latest.emotion)
    }
  }, [messages])

  // 클로징 → 진료 종료
  useEffect(() => {
    if (phase === 'closing') {
      const t = setTimeout(() => finishConsultation(), 2000)
      return () => clearTimeout(t)
    }
  }, [phase, finishConsultation])

  // 완료 → 상위 콜백 (usedFamilies 전달)
  useEffect(() => {
    if (phase === 'done') {
      onEnd(usedFamilies)
    }
  }, [phase, onEnd])

  return (
    <div className={`consultation-screen ${fadeIn ? 'consultation-screen--visible' : ''}`}>
      <PatientArea
        patient={episode.patient}
        currentEmotion={currentEmotion}
      />

      <DialogArea messages={messages} />

      <InnerVoice text={innerVoice} />

      <ChoicePanel
        currentTurn={currentTurn}
        currentChoices={currentChoices}
        waitingForChoice={waitingForChoice}
        showSeniorGuide={showSeniorGuide}
        onSelect={selectChoice}
        onSelectDirection={selectDirectionChoice}
      />

      {showNotebook && (
        <NotebookPanel chart={episode.notebook.chart} />
      )}
    </div>
  )
}
