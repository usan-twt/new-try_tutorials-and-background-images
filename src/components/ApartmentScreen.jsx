import { useState, useEffect, useRef } from 'react'
import {
  entryTexts, windowTexts, BG_COLORS,
  INTERACTION_POINTS, getBankEntries, APARTMENT_TIERS,
} from '../data/apartmentData'

const serif = "'Noto Serif KR',Georgia,serif"
const sans = 'system-ui,sans-serif'

// ── 통장 오버레이 ──
function PhoneOverlay({ tier, economy, onClose }) {
  const { balance, salary, rent, items } = getBankEntries(tier, economy)
  const isNegative = balance < 0
  const fmt = (n) => n.toLocaleString('ko-KR')

  const today = new Date()
  const dateStr = (offset = 0) => {
    const d = new Date(today)
    d.setDate(d.getDate() - offset)
    return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 280, background: '#111', borderRadius: 16,
          padding: '28px 24px', fontFamily: sans,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* 은행명 */}
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: 20 }}>
          신한은행
        </p>

        {/* 잔액 */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 20, marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>잔액</p>
          <p style={{
            fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em',
            color: isNegative ? '#C47070' : '#E8E0D0',
          }}>
            {isNegative ? '-' : ''}{fmt(Math.abs(balance))}원
          </p>
        </div>

        {/* 최근 내역 */}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 12, letterSpacing: '0.06em' }}>
          최근 내역
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{dateStr(1)}&nbsp;&nbsp;급여</span>
            <span style={{ fontSize: 12, color: '#A0B8A0' }}>+{fmt(salary)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{dateStr(2)}&nbsp;&nbsp;월세</span>
            <span style={{ fontSize: 12, color: '#E8E0D0' }}>-{fmt(rent)}</span>
          </div>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{dateStr(3 + i)}&nbsp;&nbsp;{item.label}</span>
              <span style={{ fontSize: 12, color: '#E8E0D0' }}>-{fmt(item.amount)}</span>
            </div>
          ))}
        </div>

        {/* 닫기 */}
        <button
          onClick={onClose}
          style={{
            marginTop: 24, width: '100%', padding: '10px 0',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8, cursor: 'pointer', fontFamily: sans, fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  )
}

// ── 자취방 화면 ──
export default function ApartmentScreen({ tier, economy, onNext }) {
  const [visible, setVisible] = useState(false)
  const [showEntry, setShowEntry] = useState(false)
  const [showInteractions, setShowInteractions] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [windowText, setWindowText] = useState(null)
  const windowTextTimer = useRef(null)

  const tierLabel = APARTMENT_TIERS[tier]?.label ?? ''
  const bg = BG_COLORS[tier] ?? '#2A2520'
  const points = INTERACTION_POINTS[tier]

  // 입장 텍스트: 랜덤 1개
  const entryText = useRef(
    entryTexts[tier][Math.floor(Math.random() * entryTexts[tier].length)]
  ).current

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80)
    const t2 = setTimeout(() => setShowEntry(true), 1000)
    const t3 = setTimeout(() => setShowInteractions(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleWindowTap = () => {
    clearTimeout(windowTextTimer.current)
    const pool = windowTexts[tier]
    const text = pool[Math.floor(Math.random() * pool.length)]
    setWindowText(text)
    windowTextTimer.current = setTimeout(() => setWindowText(null), 3000)
  }

  const fade = (show) => ({
    opacity: show ? 1 : 0,
    transition: 'opacity 1s cubic-bezier(0.4,0,0.2,1)',
  })

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: bg, ...fade(visible),
    }}>

      {/* 등급 라벨 (플레이스홀더용 — 이미지 교체 후 제거) */}
      <div style={{
        position: 'absolute', top: 20, right: 20,
        fontFamily: sans, fontSize: 10, color: 'rgba(255,255,255,0.1)',
        letterSpacing: '0.08em',
      }}>
        {tierLabel}
      </div>

      {/* 창문 탭 영역 */}
      {showInteractions && (
        <button
          onClick={handleWindowTap}
          style={{
            position: 'absolute',
            top: points.window.top, left: points.window.left,
            width: points.window.width, height: points.window.height,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: 4, cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        />
      )}

      {/* 핸드폰 탭 영역 */}
      {showInteractions && (
        <button
          onClick={() => setShowPhone(true)}
          style={{
            position: 'absolute',
            top: points.phone.top, left: points.phone.left,
            width: points.phone.width, height: points.phone.height,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: 4, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.3s',
          }}
        >
          <span style={{ fontSize: 18, opacity: 0.4 }}>📱</span>
        </button>
      )}

      {/* 입장 텍스트 */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none',
        ...fade(showEntry && !showInteractions),
      }}>
        <p style={{
          fontFamily: serif, fontSize: 15, fontWeight: 300,
          color: 'rgba(232,224,208,0.5)', letterSpacing: '0.08em',
        }}>
          {entryText}
        </p>
      </div>

      {/* 창밖 텍스트 (하단 페이드인/아웃) */}
      <div style={{
        position: 'absolute', bottom: '18vh', left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
        opacity: windowText ? 1 : 0,
        transition: 'opacity 0.8s',
      }}>
        <p style={{
          fontFamily: serif, fontSize: 14, fontWeight: 300,
          color: 'rgba(232,224,208,0.6)', letterSpacing: '0.05em',
        }}>
          {windowText}
        </p>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        style={{
          position: 'absolute', bottom: '8vh', right: 28,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: sans, fontSize: 13,
          color: 'rgba(232,224,208,0.25)', letterSpacing: '0.06em',
          padding: '12px 24px',
          opacity: showInteractions ? 1 : 0,
          transition: 'opacity 1.2s',
        }}
      >
        다음 날 →
      </button>

      {/* 통장 오버레이 */}
      {showPhone && (
        <PhoneOverlay tier={tier} economy={economy} onClose={() => setShowPhone(false)} />
      )}
    </div>
  )
}
