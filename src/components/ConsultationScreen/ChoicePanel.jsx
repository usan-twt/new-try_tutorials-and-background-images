const TAG_COLORS = {
  '증상': 'var(--tag-medical)',
  '생활': 'var(--tag-life)',
  '공감': 'var(--tag-emotional)',
}

export default function ChoicePanel({
  currentTurn,
  currentChoices,
  waitingForChoice,
  showSeniorGuide,
  onSelect,
  onSelectDirection,
}) {
  if (!currentTurn || !waitingForChoice) return null

  // Phase 1: 단일 선택지 + 선배 가이드
  if (currentTurn.choice) {
    const { seniorGuide, choice } = currentTurn
    return (
      <div className="choice-panel">
        {showSeniorGuide && seniorGuide?.timing === 'before' && (
          <div className="choice-panel__senior-guide">
            <span className="choice-panel__senior-label">선배</span>
            <p className="choice-panel__senior-text">{seniorGuide.text}</p>
          </div>
        )}
        <button className="choice-panel__button" onClick={onSelect}>
          <span className="choice-panel__button-text">"{choice.text}"</span>
        </button>
      </div>
    )
  }

  // Phase 2+: 방향 선택지
  if (!currentChoices) return null

  return (
    <div className="choice-panel">
      <div className="choice-panel__direction-list">
        {currentChoices.map((choice, i) => (
          <button
            key={`${choice.intent}-${i}`}
            className="choice-panel__direction-button"
            onClick={() => onSelectDirection(choice)}
          >
            <span
              className="choice-panel__tag"
              style={{ color: TAG_COLORS[choice.tag] || 'var(--text-secondary)' }}
            >
              {choice.tag}
            </span>
            <span className="choice-panel__direction-label">{choice.label}</span>
            <span className="choice-panel__direction-text">"{choice.text}"</span>
          </button>
        ))}
      </div>
    </div>
  )
}
