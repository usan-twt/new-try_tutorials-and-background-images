import { useState, useEffect, useCallback, useRef } from 'react'
import './TitleScreen.css'

const AMBIENCE_TEXTS = [
  '먼 곳에서 발자국 소리가 들린다',
  '복도 끝에서 짧은 인사가 들려온다',
  '자판기가 낮게 웅웅거린다',
  '어딘가에서 문이 닫히는 소리',
  '먼 곳에서 전화벨이 울린다',
  '누군가 차트를 넘기는 소리',
]

const FADE_IN = 'fade-in'
const IDLE = 'idle'
const FADE_OUT = 'fade-out'

export default function TitleScreen({ onStart, hasSaveData }) {
  const [phase, setPhase] = useState(FADE_IN)
  const [titleVisible, setTitleVisible] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [ambienceText, setAmbienceText] = useState('')
  const [ambienceVisible, setAmbienceVisible] = useState(false)
  const ambienceInterval = useRef(null)
  const ambienceTimeout = useRef(null)

  // 진입 시퀀스
  useEffect(() => {
    // 1.5초 후 페이드인 완료
    const fadeTimer = setTimeout(() => setPhase(IDLE), 1500)
    // 2초 후 타이틀 등장
    const titleTimer = setTimeout(() => setTitleVisible(true), 2000)
    // 5초 후 힌트 등장
    const hintTimer = setTimeout(() => setHintVisible(true), 5000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(titleTimer)
      clearTimeout(hintTimer)
    }
  }, [])

  // 앰비언스 텍스트 순환
  useEffect(() => {
    let lastIndex = -1

    const showAmbience = () => {
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * AMBIENCE_TEXTS.length)
      } while (nextIndex === lastIndex)
      lastIndex = nextIndex

      setAmbienceText(AMBIENCE_TEXTS[nextIndex])
      setAmbienceVisible(true)

      // 3초 표시 후 페이드아웃
      ambienceTimeout.current = setTimeout(() => {
        setAmbienceVisible(false)
      }, 3000)
    }

    // 3초 후 첫 앰비언스 시작
    const startDelay = setTimeout(() => {
      showAmbience()
      // 이후 10~20초 간격
      ambienceInterval.current = setInterval(() => {
        showAmbience()
      }, 12000 + Math.random() * 8000)
    }, 3000)

    return () => {
      clearTimeout(startDelay)
      clearInterval(ambienceInterval.current)
      clearTimeout(ambienceTimeout.current)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (phase === FADE_OUT) return
    setPhase(FADE_OUT)
    setTimeout(() => {
      onStart()
    }, 1000)
  }, [phase, onStart])

  return (
    <div
      className={`title-screen title-screen--${phase}`}
      onClick={handleClick}
    >
      {/* 창문 빛 효과 */}
      <div className="title-screen__light" />
      <div className="title-screen__light title-screen__light--secondary" />

      {/* 메인 콘텐츠 — 하단 무게중심 */}
      <div className="title-screen__content">
        <h1 className={`title-screen__title ${titleVisible ? 'visible' : ''}`}>
          INTERN
        </h1>
        <p className={`title-screen__subtitle ${titleVisible ? 'visible' : ''}`}>
          1년차 전공의의 하루
        </p>
      </div>

      {/* 앰비언스 텍스트 */}
      <p className={`title-screen__ambience ${ambienceVisible ? 'visible' : ''}`}>
        {ambienceText}
      </p>

      {/* 시작 힌트 */}
      <p className={`title-screen__hint ${hintVisible && phase === IDLE ? 'visible' : ''}`}>
        {hasSaveData ? '아무 곳을 눌러 이어하기' : '아무 곳을 눌러 시작하기'}
      </p>
    </div>
  )
}
