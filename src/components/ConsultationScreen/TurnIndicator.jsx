export default function TurnIndicator({ maxTurns, turnsRemaining, isOvertime }) {
  if (maxTurns === null) return null

  if (isOvertime) {
    return (
      <div className="turn-indicator turn-indicator--overtime">
        <span className="turn-indicator__overtime-text">
          추가 시간을 쓰고 있습니다
        </span>
      </div>
    )
  }

  const dots = []
  for (let i = 0; i < maxTurns; i++) {
    const isSpent = i >= turnsRemaining
    const isWarning = !isSpent && turnsRemaining <= 2
    dots.push(
      <span
        key={i}
        className={[
          'turn-indicator__dot',
          isSpent ? 'turn-indicator__dot--spent' : '',
          isWarning ? 'turn-indicator__dot--warning' : '',
        ].filter(Boolean).join(' ')}
      />
    )
  }

  return (
    <div className="turn-indicator">
      <div className="turn-indicator__dots">{dots}</div>
    </div>
  )
}
