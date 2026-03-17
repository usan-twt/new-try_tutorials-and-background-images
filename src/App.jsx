import useGameState from './hooks/useGameState'
import TitleScreen from './components/TitleScreen'
import PhaseIntro from './components/PhaseIntro'
import ConsultationScreen from './components/ConsultationScreen'
import DayEndScreen from './components/DayEndScreen'
import InterludeScene from './components/InterludeScene'
import './App.css'

function App() {
  const {
    state,
    currentEpisode,
    startGame,
    startConsultation,
    endConsultation,
    nextEpisode,
    finishInterlude,
  } = useGameState()

  return (
    <div className="app">
      {state.screen === 'title' && (
        <TitleScreen
          onStart={startGame}
          hasSaveData={false}
        />
      )}

      {state.screen === 'phaseIntro' && (
        <PhaseIntro
          phase={state.currentPhase}
          onComplete={startConsultation}
        />
      )}

      {state.screen === 'consultation' && currentEpisode && (
        <ConsultationScreen
          episode={currentEpisode}
          onEnd={endConsultation}
        />
      )}

      {state.screen === 'dayEnd' && currentEpisode && (
        <DayEndScreen
          dayEndData={{
            patients: state.patientsEncountered,
            unasked: state.unasked,
            lastScene: state.lastScene,
            overtime: state.overtime,
            isFinalEpisode: state.isFinalEpisode,
          }}
          onNext={nextEpisode}
        />
      )}

      {state.screen === 'interlude' && state.currentInterlude && (
        <InterludeScene
          interlude={state.currentInterlude}
          onComplete={finishInterlude}
        />
      )}

      {state.screen === 'complete' && (
        <div className="complete-screen">
          <p className="complete-screen__text">다음 주에 다시 옵니다.</p>
        </div>
      )}
    </div>
  )
}

export default App
