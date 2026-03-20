import { useState, useEffect } from 'react'

const serif = "'Noto Serif KR',Georgia,serif"
const sans = 'system-ui,sans-serif'
const fadeStyle = (show) => ({
  opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(4px)',
  transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)',
})

export default function DayEndScreen({ data, onNext }) {
  const { patients = [], unasked = [], lastScene = [], overtime = [], isFinalEpisode } = data
  const [count, setCount] = useState(0)
  const [stages, setStages] = useState({ header: false, scene: false, overtime: false, final: false, next: false })

  useEffect(() => {
    setCount(0); setStages({ header: false, scene: false, overtime: false, final: false, next: false })
    const t = []
    let c = 600
    t.push(setTimeout(() => setStages(s => ({ ...s, header: true })), c))
    c = 1600
    patients.forEach((_, i) => t.push(setTimeout(() => setCount(i + 1), c + i * 500)))
    c += patients.length * 500
    if (lastScene.length) { c += 1000; t.push(setTimeout(() => setStages(s => ({ ...s, scene: true })), c)) }
    if (overtime.length) { c += 800; t.push(setTimeout(() => setStages(s => ({ ...s, overtime: true })), c)) }
    if (isFinalEpisode) { c += 1200; t.push(setTimeout(() => setStages(s => ({ ...s, final: true })), c)) }
    c += 1500; t.push(setTimeout(() => setStages(s => ({ ...s, next: true })), c))
    return () => t.forEach(clearTimeout)
  }, [data])

  return (
    <div style={{ width: '100%', height: '100%', background: '#1A1815', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, maxWidth: 400, padding: '0 28px' }}>
        <h2 style={{ fontFamily: serif, fontSize: 15, fontWeight: 300, color: 'rgba(232,224,208,0.4)', letterSpacing: '0.12em', ...fadeStyle(stages.header) }}>오늘 만난 사람들</h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          {patients.map((p, i) => {
            const patientUnasked = unasked.filter(u => u.patientName === p.name)
            return (
              <div key={p.name} style={{ textAlign: 'center', ...fadeStyle(i < count) }}>
                <p style={{ fontFamily: serif, fontSize: 16, fontWeight: 400, color: '#E8E0D0', letterSpacing: '0.15em', marginBottom: 6 }}>{p.name}</p>
                <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}>{p.age}세 · {p.chiefComplaint}</p>
                {patientUnasked.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                    {patientUnasked.map((u, j) => (
                      <p key={j} style={{ fontFamily: serif, fontSize: 12, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.7, color: 'rgba(232,224,208,0.25)' }}>{u.hint}</p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {lastScene.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, ...fadeStyle(stages.scene) }}>
            {lastScene.map((s, i) => <p key={i} style={{ fontFamily: serif, fontSize: 13, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.7, color: 'rgba(232,224,208,0.4)', textAlign: 'center' }}>{s.description}</p>)}
          </div>
        )}

        {overtime.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, ...fadeStyle(stages.overtime) }}>
            {overtime.map((o, i) => <p key={i} style={{ fontFamily: sans, fontSize: 11, lineHeight: 1.6, color: 'rgba(232,224,208,0.2)', textAlign: 'center' }}>{o.note}</p>)}
          </div>
        )}

        {isFinalEpisode && <p style={{ fontFamily: serif, fontSize: 14, fontWeight: 300, color: 'rgba(232,224,208,0.35)', letterSpacing: '0.08em', textAlign: 'center', ...fadeStyle(stages.final) }}>다음 주에 다시 옵니다.</p>}
      </div>

      <button onClick={onNext} style={{
        position: 'absolute', bottom: '8vh', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: sans, fontSize: 13, color: 'rgba(232,224,208,0.25)', letterSpacing: '0.06em', padding: '12px 24px',
        opacity: stages.next ? 1 : 0, transition: 'opacity 1s',
      }}>{isFinalEpisode ? '...' : '다음 날 →'}</button>
    </div>
  )
}
