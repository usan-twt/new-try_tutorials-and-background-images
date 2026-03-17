export default function ChoicePanel({
  currentTurn,
  waitingForChoice,
  showSeniorGuide,
  onSelect,
}) {
  if (!currentTurn || !waitingForChoice) return null

  const { seniorGuide, choice } = currentTurn

  return (
    <div className="choice-panel">
      {/* 선배 가이드 (before 타이밍) */}
      {showSeniorGuide && seniorGuide?.timing === 'before' && (
        <div className="choice-panel__senior-guide">
          <span className="choice-panel__senior-label">선배</span>
          <p className="choice-panel__senior-text">{seniorGuide.text}</p>
        </div>
      )}

      {/* 선택지 (Phase 1: 1개) */}
      <button
        className="choice-panel__button"
        onClick={onSelect}
      >
        <span className="choice-panel__button-text">
          "{choice.text}"
        </span>
      </button>
    </div>
  )
}
