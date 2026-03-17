import { useState, useCallback } from 'react'
import phase1Episodes from '../data/phases/phase1/episodes'
import phase2Episodes from '../data/phases/phase2/episodes'
import interludes from '../data/interludes'

const allEpisodes = [...phase1Episodes, ...phase2Episodes]

const INITIAL_STATE = {
  currentPhase: 1,
  currentEpisodeIndex: 0,
  screen: 'title', // title | phaseIntro | consultation | dayEnd | interlude
  patientsEncountered: [],
  // Phase 2+: 선택한 family 기록 (에피소드별)
  episodeFamilies: [],
  // 인터루드 데이터
  currentInterlude: null,
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
      episodeFamilies: [],
      currentInterlude: null,
    }))
  }, [])

  const startConsultation = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'consultation' }))
  }, [])

  const endConsultation = useCallback((usedFamiliesSet) => {
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

      // Phase 2+: unasked 계산
      const families = usedFamiliesSet
        ? Array.from(usedFamiliesSet)
        : []
      const allFamilies = ['medical', 'life', 'emotional']
      const unusedFamilies = allFamilies.filter(f => !families.includes(f))

      const unasked = []
      const dayEndExtra = currentEpisode.script?.dayEndExtra
      if (dayEndExtra?.unasked) {
        for (const f of unusedFamilies) {
          if (dayEndExtra.unasked[f]) {
            unasked.push({
              patientName: patient.name,
              hint: dayEndExtra.unasked[f],
            })
          }
        }
      }

      return {
        ...prev,
        screen: 'dayEnd',
        patientsEncountered: updatedPatients,
        episodeFamilies: families,
        unasked,
      }
    })
  }, [currentEpisode])

  const nextEpisode = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentEpisodeIndex + 1

      if (nextIndex >= allEpisodes.length) {
        return { ...prev, screen: 'complete' }
      }

      const nextEp = allEpisodes[nextIndex]
      const isNewPhase = nextEp.phase !== prev.currentPhase

      // 인터루드 체크: 다음 에피소드에 interludeBefore가 있으면
      if (nextEp.interludeBefore && interludes[nextEp.interludeBefore]) {
        return {
          ...prev,
          currentEpisodeIndex: nextIndex,
          currentPhase: nextEp.phase,
          currentInterlude: interludes[nextEp.interludeBefore],
          screen: 'interlude',
          patientsEncountered: isNewPhase ? [] : prev.patientsEncountered,
        }
      }

      return {
        ...prev,
        currentEpisodeIndex: nextIndex,
        currentPhase: nextEp.phase,
        screen: isNewPhase ? 'phaseIntro' : 'consultation',
        patientsEncountered: isNewPhase ? [] : prev.patientsEncountered,
      }
    })
  }, [])

  const finishInterlude = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: 'consultation',
      currentInterlude: null,
    }))
  }, [])

  return {
    state,
    currentEpisode,
    startGame,
    startConsultation,
    endConsultation,
    nextEpisode,
    finishInterlude,
  }
}
