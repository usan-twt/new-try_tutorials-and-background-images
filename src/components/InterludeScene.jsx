import { useState, useEffect, useCallback } from 'react'

export default function InterludeScene({ interlude, onComplete }) {
  const [visible, setVisible] = useState(0)
  const [showReactions, setShowReactions] = useState(false)
  const [fading, setFading] = useState(false)
  const lines = interlude?.lines || []
  const reactions = interlude?.reactions || null

  useEffect(() => {
    setVisible(0); setShowReactions(false); setFading(false)
    const timers = []
    let cur = 0
    const showNext = () => {
      cur++; setVisible(cur)
      if (cur < lines.length) {
        timers.push(setTimeout(showNext, lines[cur - 1]?.pause ? 1500 : 800))
      } else if (reactions) {
        timers.push(setTimeout(() => setShowReactions(true), 1000))
      } else {
        timers.push(setTimeout(() => { setFading(true); timers.push(setTimeout(onComplete, 1000)) }, 3000))
      }
    }
    timers.push(setTimeout(showNext, 600))
    return () => timers.forEach(clearTimeout)
  }, [interlude])

  const react = useCallback(() => { setFading(true); setTimeout(onComplete, 1000) }, [onComplete])

  return (
    <div style={{ width: '100%', height: '100%', background: '#1A1815', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 1s', opacity: fading ? 0 : 1 }}>
      <div style={{ maxWidth: 460, padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: 11, color: 'rgba(168,176,160,0.4)', letterSpacing: '0.08em' }}>{interlude.character}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {lines.map((l, i) => (
            <p key={i} style={{
              fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: 'rgba(232,224,208,0.7)',
              opacity: i < visible ? 1 : 0, transform: i < visible ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.6s,transform 0.6s',
            }}>{l.text}</p>
          ))}
        </div>
        {showReactions && reactions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, animation: 'fadeIn 0.5s ease' }}>
            {reactions.map((r, i) => (
              <button key={i} onClick={react} style={{
                textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 5, cursor: 'pointer', fontFamily: 'system-ui,sans-serif', fontSize: 13, color: 'rgba(232,224,208,0.5)',
              }}>"{r.text}"</button>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  )
}
