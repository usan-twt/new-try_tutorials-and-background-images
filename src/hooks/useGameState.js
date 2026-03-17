import { useState, useCallback } from 'react'
import phase1Episodes from '../data/phases/phase1/episodes'

const allEpisodes = [...phase1Episodes]

const INITIAL_STATE = {
  currentPhase: 1,
  currentEpisodeIndex: 0,
  screen: 'title', // title | phaseIntro | consultation | dayEnd
  patientsEncountered: [],
}

export default function useGameState() {
  const [state, setState] = useState(INITIAL_STATE)

  const currentEpisode = allEpisodes[state.currentEpisodeIndex] || null

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: 'phaseIntro',
      currentPhase: 1,
      currentEpisodeIndex: 0,
      patientsEncountered: [],
    }))
  }, [])

  const startConsultation = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'consultation' }))
  }, [])

  const endConsultation = useCallback(() => {
    if (!currentEpisode) return

    setState(prev => {
      const patient = currentEpisode.patient
      const updatedPatients = [
        ...prev.patientsEncountered,
        {
          name: patient.name,
          age: patient.age,
          chiefComplaint: patient.chiefComplaint,
        },
      ]

      return {
        ...prev,
        screen: 'dayEnd',
        patientsEncountered: updatedPatients,
      }
    })
  }, [currentEpisode])

  const nextEpisode = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentEpisodeIndex + 1

      if (nextIndex >= allEpisodes.length) {
        // 모든 에피소드 완료
        return { ...prev, screen: 'complete' }
      }

      const nextEp = allEpisodes[nextIndex]
      const isNewPhase = nextEp.phase !== prev.currentPhase

      return {
        ...prev,
        currentEpisodeIndex: nextIndex,
        currentPhase: nextEp.phase,
        screen: isNewPhase ? 'phaseIntro' : 'consultation',
      }
    })
  }, [])

  return {
    state,
    currentEpisode,
    startGame,
    startConsultation,
    endConsultation,
    nextEpisode,
  }
}
