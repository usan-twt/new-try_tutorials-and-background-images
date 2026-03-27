import { useState, useEffect } from 'react'
import { FONTS } from '../styles/theme'

const serif = FONTS.serif

const INTROS = {
  1: [{ text: '첫째 날', delay: 0 }, { text: '선배가 옆에 있다.', delay: 1000, style: 'sub' }],
  2: [
    { text: '둘째 날', delay: 0 },
    { text: '복도가 어제보다 조용하게 느껴진다.', delay: 1200, style: 'sub' },
    { text: '주머니 속 수첩의 무게가 느껴진다.', delay: 3000, style: 'sub' },
    { text: '…할 수 있다.', delay: 4800, style: 'sub' },
  ],
  3: [{ text: '셋째 주', delay: 0 }, { text: '오늘 외래 환자가 좀 많아요.', delay: 1200, style: 'nurse' }],
}

const SUB_STYLES = {
  sub: { fontSize: 14, color: 'rgba(232,224,208,0.5)' },
  senior: { fontSize: 14, fontStyle: 'italic', color: 'rgba(176,160,112,0.6)' },
  nurse: { fontSize: 14, fontStyle: 'italic', color: 'rgba(232,224,208,0.35)' },
}

export default function PhaseIntro({ phase, onComplete }) {
  const [visible, setVisible] = useState(0)
  const [fading, setFading] = useState(false)
  const lines = INTROS[phase] || INTROS[1]

  useEffect(() => {
    setVisible(0); setFading(false)
    const timers = []
    timers.push(setTimeout(() => setVisible(1), 300))
    lines.slice(1).forEach((l, i) => timers.push(setTimeout(() => setVisible(i + 2), 300 + l.delay)))
    const total = 300 + (lines[lines.length - 1]?.delay || 0) + 2000
    timers.push(setTimeout(() => setFading(true), total))
    timers.push(setTimeout(onComplete, total + 1000))
    return () => timers.forEach(clearTimeout)
  }, [phase])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0908', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 1s', opacity: fading ? 0 : 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {lines.map((l, i) => (
          <p key={i} style={{
            fontFamily: serif, fontSize: 18, fontWeight: 300, color: '#E8E0D0', letterSpacing: '0.08em',
            opacity: i < visible ? 1 : 0, transform: i < visible ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.8s,transform 0.8s',
            ...(SUB_STYLES[l.style] || {}),
          }}>{l.text}</p>
        ))}
      </div>
    </div>
  )
}
