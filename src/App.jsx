import useGame from './hooks/useGame'
import TitleScreen from './components/TitleScreen'
import PhaseIntro from './components/PhaseIntro'
import ConsultationScreen from './components/ConsultationScreen'
import DayEndScreen from './components/DayEndScreen'
import InterludeScene from './components/InterludeScene'
import NotebookPanel from './components/NotebookPanel'

function App() {
  const game = useGame()
  const { screen, currentPhase, ep, dayEndState, currentInterlude } = game

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#1A1815' }}>
      {screen === 'title' && <TitleScreen onStart={game.startGame} />}
      {screen === 'phaseIntro' && <PhaseIntro phase={currentPhase} onComplete={game.startConsultation} />}
      {screen === 'consultation' && ep && (
        <>
          <ConsultationScreen game={game} />
          {ep.phase >= 2 && ep.notebook && <NotebookPanel chart={ep.notebook.chart} />}
        </>
      )}
      {screen === 'dayEnd' && <DayEndScreen data={dayEndState} onNext={game.nextEpisode} />}
      {screen === 'interlude' && currentInterlude && <InterludeScene interlude={currentInterlude} onComplete={game.finishInterlude} />}
      {screen === 'complete' && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A1815' }}>
          <p style={{ fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 15, fontWeight: 300, color: 'rgba(232,224,208,0.5)', letterSpacing: '0.08em' }}>다음 주에 다시 옵니다.</p>
        </div>
      )}
    </div>
  )
}

export default App
