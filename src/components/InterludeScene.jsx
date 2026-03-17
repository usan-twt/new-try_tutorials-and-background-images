import { useState, useEffect, useCallback } from 'react'
import './InterludeScene.css'

export default function InterludeScene({ interlude, onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showReactions, setShowReactions] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)

  const lines = interlude?.lines || []
  const reactions = interlude?.reactions || null

  useEffect(() => {
    setVisibleLines(0)
    setShowReactions(false)
    setFadingOut(false)

    let currentLine = 0
    const timers = []

    const showNext = () => {
      currentLine++
      setVisibleLines(currentLine)

      if (currentLine < lines.length) {
        // pause가 있으면 1.5초 대기, 아니면 0.8초
        const delay = lines[currentLine - 1]?.pause ? 1500 : 800
        timers.push(setTimeout(showNext, delay))
      } else {
        // 모든 줄 표시 후
        if (reactions) {
          timers.push(setTimeout(() => setShowReactions(true), 1000))
        } else {
          // 반응 선택지 없으면 3초 후 자동 종료
          timers.push(setTimeout(() => {
            setFadingOut(true)
            timers.push(setTimeout(onComplete, 1000))
          }, 3000))
        }
      }
    }

    timers.push(setTimeout(showNext, 600))

    return () => timers.forEach(clearTimeout)
  }, [interlude])

  const handleReaction = useCallback(() => {
    setFadingOut(true)
    setTimeout(onComplete, 1000)
  }, [onComplete])

  return (
    <div className={`interlude ${fadingOut ? 'interlude--fading' : ''}`}>
      <div className="interlude__content">
        <span className="interlude__character-label">{interlude.character}</span>

        <div className="interlude__lines">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`interlude__line ${i < visibleLines ? 'visible' : ''}`}
            >
              {line.text}
            </p>
          ))}
        </div>

        {showReactions && reactions && (
          <div className="interlude__reactions">
            {reactions.map((reaction, i) => (
              <button
                key={i}
                className="interlude__reaction-btn"
                onClick={handleReaction}
              >
                "{reaction.text}"
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
