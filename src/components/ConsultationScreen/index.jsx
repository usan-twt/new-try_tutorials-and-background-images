import { useEffect, useState } from 'react'
import useScriptEngine from '../../hooks/useScriptEngine'
import PatientArea from './PatientArea'
import DialogArea from './DialogArea'
import ChoicePanel from './ChoicePanel'
import InnerVoice from './InnerVoice'
import TurnIndicator from './TurnIndicator'
import NotebookPanel from '../NotebookPanel'
import './ConsultationScreen.css'

export default function ConsultationScreen({ episode, onEnd }) {
  const episodeConfig = {
    maxTurns: episode.maxTurns ?? null,
    rapportGating: episode.rapportGating ?? null,
  }

  const {
    phase,
    messages,
    currentTurn,
    currentChoices,
    waitingForChoice,
    showSeniorGuide,
    usedFamilies,
    innerVoice,
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
  } = useScriptEngine(episode.script, episodeConfig)

  const [currentEmotion, setCurrentEmotion] = useState(
    episode.patient.initialEmotion
  )
  const [fadeIn, setFadeIn] = useState(false)

  const showNotebook = episode.phase >= 2 && episode.notebook

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    reset()
    setCurrentEmotion(episode.patient.initialEmotion)
    setFadeIn(false)
    const t = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(t)
  }, [episode.id])

  useEffect(() => {
    if (phase === 'opening') {
      const t = setTimeout(() => beginPlaying(), 1200)
      return () => clearTimeout(t)
    }
  }, [phase, beginPlaying])

  useEffect(() => {
    const patientMessages = messages.filter(m => m.emotion)
    if (patientMessages.length > 0) {
      const latest = patientMessages[patientMessages.length - 1]
      setCurrentEmotion(latest.emotion)
    }
  }, [messages])

  useEffect(() => {
    if (phase === 'closing') {
      const t = setTimeout(() => finishConsultation(), 2000)
      return () => clearTimeout(t)
    }
  }, [phase, finishConsultation])

  // 완료 → 상위 콜백 (usedFamilies + overtime 정보)
  useEffect(() => {
    if (phase === 'done') {
      onEnd(usedFamilies, { isOvertime, overtimeTurns, rapportUnlocked })
    }
  }, [phase, onEnd])

  return (
    <div className={`consultation-screen ${fadeIn ? 'consultation-screen--visible' : ''}`}>
      <TurnIndicator
        maxTurns={maxTurns}
        turnsRemaining={turnsRemaining}
        isOvertime={isOvertime}
      />

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
