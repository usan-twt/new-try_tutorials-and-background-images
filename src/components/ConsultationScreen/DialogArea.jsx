import { useRef, useEffect } from 'react'

export default function DialogArea({ messages }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // 최근 4개 메시지만 표시 (이전 메시지는 흐려짐)
  const visibleMessages = messages.slice(-4)
  const fadeStart = messages.length > 4 ? 0 : -1

  return (
    <div className="dialog-area">
      <div className="dialog-area__messages">
        {visibleMessages.map((msg, i) => {
          const isFading = i === 0 && visibleMessages.length >= 4
          const className = [
            'dialog-area__message',
            `dialog-area__message--${msg.speaker}`,
            isFading ? 'dialog-area__message--fading' : '',
          ].filter(Boolean).join(' ')

          return (
            <div key={msg.id} className={className}>
              {msg.speaker === 'senior' && (
                <span className="dialog-area__speaker-label">선배</span>
              )}
              <p className="dialog-area__text">{msg.text}</p>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
    </div>
  )
}
