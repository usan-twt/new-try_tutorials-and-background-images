import { useState, useEffect, useCallback, useRef } from 'react'
import { FONTS } from '../styles/theme'

const serif = FONTS.serif
const sans = FONTS.sans

const AMBIENCE = [
  '먼 곳에서 발자국 소리가 들린다', '복도 끝에서 짧은 인사가 들려온다',
  '자판기가 낮게 웅웅거린다', '어딘가에서 문이 닫히는 소리',
  '먼 곳에서 전화벨이 울린다', '누군가 차트를 넘기는 소리',
]

export default function TitleScreen({ onStart }) {
  const [ready, setReady] = useState(false)
  const [title, setTitle] = useState(false)
  const [hint, setHint] = useState(false)
  const [ambText, setAmbText] = useState('')
  const [ambShow, setAmbShow] = useState(false)
  const [out, setOut] = useState(false)
  const ambInterval = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 1500)
    const t2 = setTimeout(() => setTitle(true), 2000)
    const t3 = setTimeout(() => setHint(true), 5000)
    let lastIdx = -1
    const show = () => {
      let n; do { n = Math.floor(Math.random() * AMBIENCE.length) } while (n === lastIdx)
      lastIdx = n; setAmbText(AMBIENCE[n]); setAmbShow(true)
      setTimeout(() => setAmbShow(false), 3000)
    }
    const t4 = setTimeout(() => { show(); ambInterval.current = setInterval(show, 14000) }, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearInterval(ambInterval.current) }
  }, [])

  const click = useCallback(() => {
    if (out) return; setOut(true); setTimeout(onStart, 1000)
  }, [out, onStart])

  const base = { width: '100%', height: '100%', position: 'relative', background: '#1A1815', cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column', userSelect: 'none' }

  return (
    <div style={{ ...base, opacity: out ? 0 : ready ? 1 : 0, transition: `opacity ${out ? 1 : 1.5}s cubic-bezier(0.4,0,0.2,1)` }} onClick={click}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/title-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(26,24,21,0.85) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '10vh' }}>
        <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: 20, letterSpacing: '0.35em', color: '#E8E0D0', textShadow: '0 1px 4px rgba(0,0,0,0.5)', opacity: title ? 1 : 0, transform: title ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.8s,transform 0.8s' }}>INTERN</h1>
        <p style={{ fontFamily: sans, fontSize: 10, color: '#C8C0B0', letterSpacing: '0.08em', marginTop: 8, textShadow: '0 1px 3px rgba(0,0,0,0.5)', opacity: title ? 1 : 0, transform: title ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.8s 0.3s,transform 0.8s 0.3s' }}>1년차 전공의의 하루</p>
      </div>
      <p style={{ position: 'absolute', bottom: '6vh', left: 0, right: 0, textAlign: 'center', fontFamily: serif, fontSize: 10, fontWeight: 300, color: '#C8C0B0', textShadow: '0 1px 3px rgba(0,0,0,0.5)', opacity: ambShow ? 1 : 0, transition: 'opacity 1.2s', pointerEvents: 'none', zIndex: 1 }}>{ambText}</p>
      <p style={{ position: 'absolute', bottom: '2.5vh', left: 0, right: 0, textAlign: 'center', fontFamily: sans, fontSize: 10, color: '#A8A098', textShadow: '0 1px 3px rgba(0,0,0,0.5)', opacity: hint && !out ? 0.5 : 0, transition: 'opacity 1.5s', pointerEvents: 'none', zIndex: 1 }}>아무 곳을 눌러 시작하기</p>
    </div>
  )
}
