import { useState, useCallback } from 'react'
import TitleScreen from './components/TitleScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState('title')

  const handleStart = useCallback(() => {
    setScreen('phase1')
  }, [])

  return (
    <div className="app">
      {screen === 'title' && (
        <TitleScreen
          onStart={handleStart}
          hasSaveData={false}
        />
      )}
      {screen === 'phase1' && (
        <div className="placeholder-phase">
          <p>Phase 1 — 진료실</p>
        </div>
      )}
    </div>
  )
}

export default App
