import { useState, useEffect, useCallback, useRef } from 'react'

const LINES = [
  { speaker: '선배', text: '(다가오며) 오늘부터 우리 과에서 근무하는 거지?' },
  { speaker: '나', text: '네, 오늘 첫 출근입니다. 잘 부탁드려요.' },
  { speaker: '선배', text: '이름이 뭐였더라?', namePrompt: true },
  // index 3~6: namePrompt 이후 대사 (onNameSubmit에서 동적 삽입)
]

const AFTER_NAME = (name) => [
  { speaker: '선배', text: `좋아, ${name}. 넌 오늘부터 외래 진료를 보게 될 거야.` },
  { speaker: '선배', text: '환자가 들어오면 이름 확인하고, 어디가 아픈지 듣고, 필요한 걸 물어보면 돼.' },
  { speaker: '선배', text: '어렵게 생각하지 마. 오늘은 내가 옆에서 하나씩 알려줄 테니까.' },
  { speaker: '선배', text: '일단 병원 구경부터 시키자. 따라와.', last: true },
]

export default function CorridorScene({ onComplete, onNameSet }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [showInput, setShowInput] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [fading, setFading] = useState(false)
  const inputRef = useRef(null)
  const timersRef = useRef([])

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
  const addTimer = (fn, ms) => { timersRef.current.push(setTimeout(fn, ms)) }

  // 초기 대사 순차 표시
  useEffect(() => {
    clearTimers()
    let delay = 600
    for (let i = 0; i < LINES.length; i++) {
      const line = LINES[i]
      addTimer(() => {
        setVisibleLines(prev => [...prev, line])
        if (line.namePrompt) {
          addTimer(() => setShowInput(true), 600)
        }
      }, delay)
      delay += line.namePrompt ? 800 : 1000
      if (line.namePrompt) break // namePrompt 이후는 이름 입력 후 진행
    }
    return clearTimers
  }, [])

  useEffect(() => { if (showInput) inputRef.current?.focus() }, [showInput])

  const handleNameSubmit = useCallback((e) => {
    e.preventDefault()
    const name = nameValue.trim()
    if (!name) return

    onNameSet(name)
    setShowInput(false)

    // 이름 입력 줄을 나의 대사로 교체
    setVisibleLines(prev => {
      const next = prev.filter(l => !l.namePrompt)
      return [...next, { speaker: '나', text: `${name}입니다.` }]
    })

    // 이후 대사 순차 표시
    const afterLines = AFTER_NAME(name)
    let delay = 800
    afterLines.forEach((line) => {
      addTimer(() => {
        setVisibleLines(prev => [...prev, line])
        if (line.last) {
          addTimer(() => { setFading(true); addTimer(onComplete, 1200) }, 2000)
        }
      }, delay)
      delay += 1200
    })
  }, [nameValue, onNameSet, onComplete])

  return (
    <div style={{
      width: '100%', height: '100%', background: '#1A1815',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 1s', opacity: fading ? 0 : 1,
    }}>
      <div style={{ maxWidth: 460, padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 장소 표시 */}
        <span style={{
          fontFamily: 'system-ui,sans-serif', fontSize: 11,
          color: 'rgba(232,224,208,0.3)', letterSpacing: '0.08em',
        }}>복도</span>

        {/* 대사 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {visibleLines.map((line, i) => {
            const isSenior = line.speaker === '선배'
            const isMe = line.speaker === '나'
            return (
              <div key={i} style={{
                textAlign: isMe ? 'right' : 'left',
                animation: 'fadeUp 0.5s ease forwards',
              }}>
                <span style={{
                  display: 'block', fontFamily: 'system-ui,sans-serif', fontSize: 10,
                  color: isSenior ? '#B0A070' : 'rgba(232,224,208,0.4)',
                  letterSpacing: '0.05em', marginBottom: 4,
                }}>{line.speaker}</span>
                <p style={{
                  fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 14, fontWeight: 300,
                  lineHeight: 1.8,
                  color: isSenior ? 'rgba(176,160,112,0.8)' : 'rgba(232,224,208,0.7)',
                }}>{line.text}</p>
              </div>
            )
          })}
        </div>

        {/* 이름 입력 */}
        {showInput && (
          <form onSubmit={handleNameSubmit} style={{
            display: 'flex', gap: 10, alignItems: 'center',
            animation: 'fadeUp 0.4s ease forwards', marginTop: 4,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              maxLength={8}
              placeholder="이름을 입력하세요"
              style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 15,
                color: '#E8E0D0', outline: 'none',
                letterSpacing: '0.1em',
              }}
            />
            <button type="submit" style={{
              padding: '10px 18px',
              background: 'rgba(176,160,112,0.15)',
              border: '1px solid rgba(176,160,112,0.3)',
              borderRadius: 6, cursor: 'pointer',
              fontFamily: 'system-ui,sans-serif', fontSize: 13,
              color: '#B0A070',
            }}>확인</button>
          </form>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
