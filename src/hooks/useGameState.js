import { useState, useCallback } from 'react'
import phase1Episodes from '../data/phases/phase1/episodes'
import phase2Episodes from '../data/phases/phase2/episodes'
import phase3Episodes from '../data/phases/phase3/episodes'
import interludes from '../data/interludes'

const allEpisodes = [...phase1Episodes, ...phase2Episodes, ...phase3Episodes]

const INITIAL_STATE = {
  currentPhase: 1,
  currentEpisodeIndex: 0,
  screen: 'title', // title | phaseIntro | consultation | dayEnd | interlude | complete
  patientsEncountered: [],
  episodeFamilies: [],
  currentInterlude: null,
  // Phase 2+
  unasked: [],
  // Phase 3
  lastScene: [],
  overtime: [],
  isFinalEpisode: false,
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
      unasked: [],
      lastScene: [],
      overtime: [],
      isFinalEpisode: false,
    }))
  }, [])

  const startConsultation = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'consultation' }))
  }, [])

  const endConsultation = useCallback((usedFamiliesSet, extraInfo = {}) => {
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

      // unasked 계산
      const families = usedFamiliesSet ? Array.from(usedFamiliesSet) : []
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

      // Phase 3: lastScene
      const lastScene = [...prev.lastScene]
      if (dayEndExtra?.lastScene) {
        const sceneText = extraInfo.rapportUnlocked && dayEndExtra.lastSceneGated
          ? dayEndExtra.lastSceneGated
          : dayEndExtra.lastScene
        lastScene.push({
          patientName: patient.name,
          description: sceneText,
        })
      }

      // Phase 3: overtime
      const overtime = [...prev.overtime]
      if (extraInfo.isOvertime && extraInfo.overtimeTurns > 0) {
        const waitMinutes = extraInfo.overtimeTurns * 5
        overtime.push({
          patientName: patient.name,
          note: `다음 환자가 ${waitMinutes}분 더 기다렸습니다.`,
        })
      }

      // 마지막 에피소드 여부
      const nextIndex = prev.currentEpisodeIndex + 1
      const isFinalEpisode = nextIndex >= allEpisodes.length

      return {
        ...prev,
        screen: 'dayEnd',
        patientsEncountered: updatedPatients,
        episodeFamilies: families,
        unasked,
        lastScene,
        overtime,
        isFinalEpisode,
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
      const isNewDay = nextEp.day !== allEpisodes[prev.currentEpisodeIndex]?.day

      // 인터루드 체크
      if (nextEp.interludeBefore && interludes[nextEp.interludeBefore]) {
        return {
          ...prev,
          currentEpisodeIndex: nextIndex,
          currentPhase: nextEp.phase,
          currentInterlude: interludes[nextEp.interludeBefore],
          screen: 'interlude',
          patientsEncountered: isNewDay ? [] : prev.patientsEncountered,
          lastScene: isNewDay ? [] : prev.lastScene,
          overtime: isNewDay ? [] : prev.overtime,
        }
      }

      return {
        ...prev,
        currentEpisodeIndex: nextIndex,
        currentPhase: nextEp.phase,
        screen: isNewPhase ? 'phaseIntro' : 'consultation',
        patientsEncountered: isNewDay ? [] : prev.patientsEncountered,
        lastScene: isNewDay ? [] : prev.lastScene,
        overtime: isNewDay ? [] : prev.overtime,
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
