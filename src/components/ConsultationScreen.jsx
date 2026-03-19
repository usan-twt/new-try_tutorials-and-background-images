import { useState, useEffect, useRef } from 'react'

const EMOTION_MAP = {
  neutral:    { color: '#A8B0A0', scale: 1.0 },
  anxious:    { color: '#C4A870', scale: 0.95 },
  guarded:    { color: '#8A8A8A', scale: 0.9 },
  warming:    { color: '#B8A080', scale: 1.05 },
  opened:     { color: '#A0B8A0', scale: 1.1 },
  distressed: { color: '#B07070', scale: 0.88 },
}

const TAG_COLORS = { '증상': '#7A9A8A', '생활': '#A89A7A', '공감': '#9A8AAA' }

export default function ConsultationScreen({ game }) {
  const {
    ep, phase, messages, currentTurn, currentChoices, currentEmotion,
    waitingForChoice, showSeniorGuide, innerVoice,
    turnsRemaining, maxTurns, isOvertime, dayBudgetTotal,
    beginPlaying, send,
  } = game

  const [choiceDelayDone, setChoiceDelayDone] = useState(false)
  const endRef = useRef(null)
  const patient = ep.patient
  const emo = EMOTION_MAP[currentEmotion] || EMOTION_MAP.neutral

  // 오프닝 → 플레이 자동 전환
  useEffect(() => {
    if (phase === 'opening') {
      const t = setTimeout(beginPlaying, 1200)
      return () => clearTimeout(t)
    }
  }, [phase, beginPlaying])

  // Phase 1 before 가이드 → 선택지 2단계 연출 (가이드 먼저, 선택지는 지연 등장)
  useEffect(() => {
    if (!waitingForChoice || !currentTurn?.choice) return
    const hasBefore = showSeniorGuide && currentTurn.seniorGuide?.timing === 'before'
    const t = setTimeout(() => setChoiceDelayDone(true), hasBefore ? 900 : 0)
    return () => clearTimeout(t)
  }, [waitingForChoice, currentTurn, showSeniorGuide])

  // 턴 변경 시 딜레이 리셋 (messages.length가 바뀌면 새 턴)
  useEffect(() => { const t = setTimeout(() => setChoiceDelayDone(false), 0); return () => clearTimeout(t) }, [messages.length])

  // 선택지 표시 조건: Phase 1 before 가이드가 있으면 딜레이 후 표시, 아니면 바로 표시
  const isPhase1 = !!currentTurn?.choice
  const hasBefore = isPhase1 && showSeniorGuide && currentTurn?.seniorGuide?.timing === 'before'
  const showP1Choice = isPhase1 && waitingForChoice && (!hasBefore || choiceDelayDone)

  // 클로징 → done 자동 전환
  useEffect(() => {
    if (phase === 'closing') {
      const t = setTimeout(() => game.endConsultation(), 2000)
      return () => clearTimeout(t)
    }
  }, [phase])

  // done → dayEnd 빌드
  useEffect(() => {
    if (phase === 'done') {
      game.buildDayEnd(game.usedFamilies, {
        isOvertime: game.isOvertime,
        overtimeTurns: game.overtimeTurns,
        rapportUnlocked: game.rapportUnlocked,
      })
    }
  }, [phase])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  const visible = messages.slice(-4)
  const orbSize = 80 * emo.scale

  return (
    <div style={{ width: '100%', height: '100%', maxWidth: 640, margin: '0 auto', background: '#2A2520', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* 턴 인디케이터 */}
      {(maxTurns !== null || dayBudgetTotal !== null) && (
        <div style={{ flex: '0 0 auto', padding: '16px 28px 0', display: 'flex', justifyContent: 'center' }}>
          {isOvertime ? (
            <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: 11, fontStyle: 'italic', color: 'rgba(184,160,128,0.45)', letterSpacing: '0.03em' }}>
              추가 시간을 쓰고 있습니다
            </span>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: dayBudgetTotal ?? maxTurns }, (_, i) => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: i >= turnsRemaining ? 'rgba(232,224,208,0.06)'
                    : turnsRemaining <= 2 ? '#B8A080' : 'rgba(232,224,208,0.25)',
                  transition: 'background 0.5s',
                }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 환자 영역 */}
      <div style={{ flex: '0 0 auto', padding: '48px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: orbSize, height: orbSize, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 38%, ${emo.color}88, ${emo.color}40, transparent)`,
            transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
        <p style={{ fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 16, fontWeight: 400, color: '#E8E0D0', letterSpacing: '0.2em' }}>{patient.name}</p>
        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}>{patient.age}세 · {patient.chiefComplaint}</p>
      </div>

      {/* 대화 영역 */}
      <div style={{ flex: '1 1 auto', overflow: 'hidden', padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
          {visible.map((msg, i) => {
            const isFading = i === 0 && visible.length >= 4
            const isDoc = msg.speaker === 'doctor'
            const isSys = msg.speaker === 'system'
            const isSenior = msg.speaker === 'senior'
            const isNurse = msg.speaker === 'nurse'
            return (
              <div key={msg.id} style={{
                textAlign: isDoc ? 'right' : isSys ? 'center' : 'left',
                opacity: isFading ? 0.35 : 1,
                ...(isSenior ? { paddingLeft: 12, borderLeft: '1px solid rgba(176,160,112,0.2)' } : {}),
                ...(isNurse ? { paddingLeft: 12, borderLeft: '1px solid rgba(184,168,144,0.2)' } : {}),
                animation: 'fadeUp 0.4s ease forwards',
              }}>
                {isSenior && <span style={{ display: 'block', fontFamily: 'system-ui,sans-serif', fontSize: 10, color: '#B0A070', letterSpacing: '0.05em', marginBottom: 3 }}>선배</span>}
                {isNurse && <span style={{ display: 'block', fontFamily: 'system-ui,sans-serif', fontSize: 10, color: '#B8A890', letterSpacing: '0.05em', marginBottom: 3 }}>간호사</span>}
                <p style={{
                  fontFamily: isSys || isDoc || isSenior || isNurse ? 'system-ui,sans-serif' : "'Noto Serif KR',Georgia,serif",
                  fontSize: isSys ? 11 : isSenior || isNurse ? 12 : 13,
                  fontStyle: isSys || isSenior || isNurse ? 'italic' : 'normal',
                  lineHeight: 1.8,
                  color: isDoc ? 'rgba(255,255,255,0.55)' : isSys ? 'rgba(255,255,255,0.2)' : isSenior ? 'rgba(176,160,112,0.7)' : isNurse ? 'rgba(184,168,144,0.75)' : '#E8E0D0',
                }}>{msg.text}</p>
              </div>
            )
          })}
          <div ref={endRef} />
        </div>
      </div>

      {/* 내면 독백 */}
      {innerVoice && (
        <div style={{ flex: '0 0 auto', padding: '8px 28px' }}>
          <p style={{
            fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 12, fontStyle: 'italic',
            lineHeight: 1.7, color: '#B0A070', background: 'rgba(55,50,35,0.6)', padding: '10px 16px', borderRadius: 4,
          }}>{innerVoice}</p>
        </div>
      )}

      {/* 선택지 */}
      {currentTurn && waitingForChoice && (
        <div style={{ flex: '0 0 auto', padding: '16px 28px 40px', display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.3s ease' }}>

          {/* Phase 1: 선배 가이드 카드 + 단일 버튼 */}
          {currentTurn.choice && <>
            {showSeniorGuide && currentTurn.seniorGuide?.timing === 'before' && (
              <div style={{
                padding: '12px 16px', borderRadius: 8,
                background: 'rgba(176,160,112,0.08)',
                border: '1px solid rgba(176,160,112,0.15)',
                animation: 'fadeUp 0.4s ease forwards',
              }}>
                <span style={{
                  display: 'block', fontFamily: 'system-ui,sans-serif', fontSize: 10, fontWeight: 500,
                  color: '#B0A070', letterSpacing: '0.06em', marginBottom: 6,
                }}>선배</span>
                <p style={{
                  fontFamily: "'Noto Serif KR',Georgia,serif", fontSize: 13, fontStyle: 'italic',
                  lineHeight: 1.7, color: 'rgba(176,160,112,0.85)',
                }}>{currentTurn.seniorGuide.text}</p>
              </div>
            )}
            {showP1Choice && (
              <button onClick={() => send()} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '14px 18px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 6, cursor: 'pointer', fontFamily: 'system-ui,sans-serif', fontSize: 14, lineHeight: 1.6, color: '#E8E0D0',
                animation: 'fadeUp 0.3s ease forwards',
              }}>
                "{currentTurn.choice.text}"
              </button>
            )}
          </>}

          {/* Phase 2+: 방향 선택지 */}
          {currentChoices && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentChoices.map((c, i) => (
                <button key={`${c.intent}-${i}`} onClick={() => send(c)} style={{
                  display: 'flex', flexDirection: 'column', gap: 4, width: '100%', textAlign: 'left',
                  padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 6, cursor: 'pointer',
                }}>
                  <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', color: TAG_COLORS[c.tag] || 'rgba(255,255,255,0.4)' }}>{c.tag}</span>
                  <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{c.label}</span>
                  <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: 14, color: '#E8E0D0', lineHeight: 1.6 }}>"{c.text}"</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  )
}
