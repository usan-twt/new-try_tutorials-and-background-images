import useGame from './hooks/useGame'
import TitleScreen from './components/TitleScreen'
import CorridorScene from './components/CorridorScene'
import PhaseIntro from './components/PhaseIntro'
import ConsultationScreen from './components/ConsultationScreen'
import DayEndScreen from './components/DayEndScreen'
import InterludeScene from './components/InterludeScene'
import NotebookPanel from './components/NotebookPanel'
import NavigationScreen from './components/NavigationScreen'
import ApartmentScreen from './components/ApartmentScreen'
import NewsScreen from './components/NewsScreen'

function App() {
  const game = useGame()
  const { screen, currentPhase, ep, dayEndState, currentInterlude } = game

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#1A1815' }}>
      {screen === 'title' && <TitleScreen onStart={game.startGame} onJumpToDay={game.jumpToDay} />}
      {screen === 'corridor' && <CorridorScene onComplete={game.finishCorridor} onNameSet={game.setPlayerName} />}
      {screen === 'morningNav' && (
        <NavigationScreen
          timeOfDay="morning"
          onEnterClinic={game.finishMorningNav}
          onComplete={game.finishMorningNav}
          professorRelationLevel={game.professorRelationLevel}
          nurseRelationLevel={game.nurseRelationLevel}
          pendingDocument={game.pendingDocument}
          onDocumentSeen={game.clearDocument}
          guided={!game.guidedTourDone}
          pendingRumor={game.pendingRumor}
          onRumorSeen={game.clearRumor}
        />
      )}
      {screen === 'eveningNav' && (
        <NavigationScreen
          timeOfDay="evening"
          onComplete={game.finishEveningNav}
          professorRelationLevel={game.professorRelationLevel}
          nurseRelationLevel={game.nurseRelationLevel}
          pendingRumor={game.pendingRumor}
          onRumorSeen={game.clearRumor}
        />
      )}
      {screen === 'phaseIntro' && <PhaseIntro phase={currentPhase} onComplete={game.startConsultation} />}
      {screen === 'consultation' && ep && (
        <>
          <ConsultationScreen game={game} />
          {ep.phase >= 2 && ep.notebook && <NotebookPanel chart={ep.notebook.chart} isFirstAppearance={ep.id === 'phase2_ep1'} />}
        </>
      )}
      {screen === 'dayEnd' && <DayEndScreen data={dayEndState} onNext={game.nextEpisode} />}
      {screen === 'apartment' && <ApartmentScreen tier={game.apartmentTier} economy={game.economy} onNext={game.finishApartment} />}
      {screen === 'interlude' && currentInterlude && <InterludeScene interlude={currentInterlude} onComplete={game.finishInterlude} />}
      {screen === 'news' && <NewsScreen event={game.activeEvent} onComplete={game.finishNews} />}
      {screen === 'complete' && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A1815' }}>
          <p style={{ fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 15, fontWeight: 300, color: 'rgba(232,224,208,0.5)', letterSpacing: '0.08em' }}>다음 주에 다시 옵니다.</p>
        </div>
      )}
    </div>
  )
}

export default App
