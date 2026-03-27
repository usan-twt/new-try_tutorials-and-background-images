import { useState, useEffect } from 'react'
import { NEWS_EVENTS } from '../data/newsEvents'
import { FONTS, fadeStyle } from '../styles/theme'

const serif = FONTS.serif
const sans = FONTS.sans

export default function NewsScreen({ event, onComplete }) {
  const news = NEWS_EVENTS[event] || NEWS_EVENTS.food_poisoning
  const [stage, setStage] = useState(0)
  // stage: 0=초기, 1=ticker+채널, 2=헤드라인, 3=본문, 4=하단버튼

  useEffect(() => {
    setStage(0)
    const t = []
    t.push(setTimeout(() => setStage(1), 400))
    t.push(setTimeout(() => setStage(2), 1400))
    t.push(setTimeout(() => setStage(3), 2600))
    t.push(setTimeout(() => setStage(4), 4200))
    return () => t.forEach(clearTimeout)
  }, [event])

  const fade = (show) => fadeStyle(show)

  return (
    <div style={{
      width: '100%', height: '100%', background: '#111010',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* 속보 ticker */}
      <div style={{
        flex: '0 0 auto', background: '#1A1210', borderBottom: '1px solid rgba(180,100,60,0.25)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 14,
        ...fade(stage >= 1),
      }}>
        <span style={{
          fontFamily: sans, fontSize: 10, fontWeight: 700,
          background: 'rgba(200,80,60,0.8)', color: '#fff',
          padding: '2px 7px', borderRadius: 2, letterSpacing: '0.05em', whiteSpace: 'nowrap',
        }}>속보</span>
        <span style={{
          fontFamily: sans, fontSize: 12, color: 'rgba(220,200,180,0.75)',
          letterSpacing: '0.04em', lineHeight: 1.4,
        }}>{news.ticker}</span>
        <span style={{
          marginLeft: 'auto', fontFamily: sans, fontSize: 10,
          color: 'rgba(220,200,180,0.35)', letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>{news.channel}</span>
      </div>

      {/* 메인 영역 */}
      <div style={{
        flex: '1 1 auto', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px',
      }}>

        {/* 헤드라인 */}
        <div style={{ maxWidth: 480, width: '100%', ...fade(stage >= 2) }}>
          <h1 style={{
            fontFamily: serif, fontSize: 20, fontWeight: 400,
            color: '#E8E0D0', letterSpacing: '0.06em', lineHeight: 1.65,
            margin: '0 0 32px', textAlign: 'center',
          }}>{news.headline}</h1>
        </div>

        {/* 본문 */}
        <div style={{
          maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', gap: 14,
          ...fade(stage >= 3),
        }}>
          {news.body.map((line, i) => (
            <p key={i} style={{
              fontFamily: serif, fontSize: 13, fontWeight: 300,
              color: 'rgba(220,210,190,0.65)', lineHeight: 1.85,
              letterSpacing: '0.02em', margin: 0, textAlign: 'justify',
            }}>{line}</p>
          ))}
        </div>

        {/* 날짜 */}
        <p style={{
          fontFamily: sans, fontSize: 11, color: 'rgba(220,200,180,0.3)',
          letterSpacing: '0.06em', marginTop: 28,
          ...fade(stage >= 3),
        }}>{news.date}</p>
      </div>

      {/* 하단 진행 버튼 */}
      <div style={{
        flex: '0 0 auto', padding: '16px 32px 32px',
        display: 'flex', justifyContent: 'center',
        ...fade(stage >= 4),
      }}>
        <button onClick={onComplete} style={{
          background: 'none', border: '1px solid rgba(220,200,180,0.12)',
          borderRadius: 4, padding: '10px 28px', cursor: 'pointer',
          fontFamily: sans, fontSize: 12,
          color: 'rgba(220,200,180,0.45)', letterSpacing: '0.08em',
          transition: 'border-color 0.3s, color 0.3s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'rgba(220,200,180,0.3)'; e.target.style.color = 'rgba(220,200,180,0.75)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'rgba(220,200,180,0.12)'; e.target.style.color = 'rgba(220,200,180,0.45)' }}
        >출근하기 →</button>
      </div>

      {/* 화면 좌측 상단 장식선 */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
        background: 'linear-gradient(to bottom, transparent, rgba(180,100,60,0.3) 30%, rgba(180,100,60,0.3) 70%, transparent)',
        opacity: stage >= 1 ? 1 : 0, transition: 'opacity 0.8s ease',
      }} />
    </div>
  )
}
