import { useState, useEffect } from 'react'
import './PhaseIntro.css'

const PHASE_INTROS = {
  1: [
    { text: '첫째 날', delay: 0 },
    { text: '선배가 옆에 있다.', delay: 1000 },
  ],
  2: [
    { text: '둘째 날 아침', delay: 0 },
    { text: '오늘 나 바빠서 못 갈 것 같아. 혼자 해봐.', delay: 1200, style: 'senior' },
  ],
  3: [
    { text: '셋째 주', delay: 0 },
    { text: '오늘 외래 환자가 좀 많아요.', delay: 1200, style: 'nurse' },
  ],
}

export default function PhaseIntro({ phase, onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)

  const lines = PHASE_INTROS[phase] || PHASE_INTROS[1]

  useEffect(() => {
    setVisibleLines(0)
    setFadingOut(false)

    // 첫 줄 즉시 표시
    const t0 = setTimeout(() => setVisibleLines(1), 300)

    // 이후 줄 순차 표시
    const timers = lines.slice(1).map((line, i) =>
      setTimeout(() => setVisibleLines(i + 2), 300 + line.delay)
    )

    // 모든 줄 표시 후 2초 대기 → 페이드아웃 → 전환
    const totalDelay = 300 + (lines[lines.length - 1]?.delay || 0) + 2000
    const fadeTimer = setTimeout(() => setFadingOut(true), totalDelay)
    const completeTimer = setTimeout(() => onComplete(), totalDelay + 1000)

    return () => {
      clearTimeout(t0)
      timers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [phase])

  return (
    <div className={`phase-intro ${fadingOut ? 'phase-intro--fading' : ''}`}>
      <div className="phase-intro__content">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`phase-intro__line ${line.style ? `phase-intro__line--${line.style}` : ''} ${i < visibleLines ? 'visible' : ''}`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  )
}
