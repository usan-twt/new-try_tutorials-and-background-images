import { useState } from 'react'

export default function NotebookPanel({ chart }) {
  const [open, setOpen] = useState(false)
  const [memo, setMemo] = useState('')

  return (
    <>
      <button onClick={() => setOpen(p => !p)} style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 100, width: 40, height: 40, borderRadius: '50%',
        border: `1px solid ${open ? 'rgba(176,160,112,0.3)' : 'rgba(255,255,255,0.08)'}`,
        background: 'rgba(42,37,32,0.9)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: open ? 'scale(0.95)' : 'scale(1)', transition: 'border-color 0.3s,transform 0.2s',
      }}>📓</button>

      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99, width: 280, height: '100%',
        background: '#F5F0E0', transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', boxShadow: '4px 0 20px rgba(0,0,0,0.3)', overflowY: 'auto',
      }}>
        <div style={{ padding: '60px 24px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: 10, color: 'rgba(58,53,48,0.4)', letterSpacing: '0.1em', marginBottom: 8 }}>CHART</p>
            <p style={{ fontFamily: "'D2Coding',ui-monospace,monospace", fontSize: 12, lineHeight: 1.8, color: '#3A3530', whiteSpace: 'pre-wrap' }}>{chart}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: 10, color: 'rgba(58,53,48,0.4)', letterSpacing: '0.1em', marginBottom: 8 }}>MEMO</p>
            <textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="여기에 메모..." rows={4} style={{
              width: '100%', fontFamily: "'D2Coding',ui-monospace,monospace", fontSize: 12, lineHeight: 1.7, color: '#3A3530',
              background: 'transparent', border: 'none', borderBottom: '1px solid rgba(58,53,48,0.1)', outline: 'none', resize: 'none', padding: '8px 0',
            }} />
          </div>
        </div>
      </div>
    </>
  )
}
