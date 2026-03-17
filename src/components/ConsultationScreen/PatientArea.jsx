import { useMemo } from 'react'

const EMOTION_MAP = {
  neutral:    { color: '#A8B0A0', scale: 1.0,  animation: 'none' },
  anxious:    { color: '#C4A870', scale: 0.95, animation: 'tremble' },
  guarded:    { color: '#8A8A8A', scale: 0.9,  animation: 'none' },
  warming:    { color: '#B8A080', scale: 1.05, animation: 'pulse-slow' },
  opened:     { color: '#A0B8A0', scale: 1.1,  animation: 'pulse-slow' },
  distressed: { color: '#B07070', scale: 0.88, animation: 'tremble-fast' },
}

export default function PatientArea({ patient, currentEmotion }) {
  const emotion = currentEmotion || patient.initialEmotion || 'neutral'
  const config = EMOTION_MAP[emotion] || EMOTION_MAP.neutral

  const orbStyle = useMemo(() => ({
    width: `${80 * config.scale}px`,
    height: `${80 * config.scale}px`,
    background: `radial-gradient(circle at 40% 38%, ${config.color}88, ${config.color}40, transparent)`,
    borderRadius: '50%',
    transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [config])

  return (
    <div className="patient-area">
      <div className="patient-area__orb-container">
        <div
          className={`patient-area__orb ${config.animation !== 'none' ? `patient-area__orb--${config.animation}` : ''}`}
          style={orbStyle}
        />
      </div>
      <p className="patient-area__name">{patient.name}</p>
      <p className="patient-area__info">{patient.age}세 · {patient.chiefComplaint}</p>
    </div>
  )
}
