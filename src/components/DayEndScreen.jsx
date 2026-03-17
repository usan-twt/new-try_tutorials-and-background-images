import { useState, useEffect } from 'react'
import './DayEndScreen.css'

export default function DayEndScreen({ dayEndData, onNext }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [lastSceneVisible, setLastSceneVisible] = useState(false)
  const [unaskedVisible, setUnaskedVisible] = useState(false)
  const [overtimeVisible, setOvertimeVisible] = useState(false)
  const [finalVisible, setFinalVisible] = useState(false)
  const [nextVisible, setNextVisible] = useState(false)

  const patients = dayEndData?.patients || []
  const unasked = dayEndData?.unasked || []
  const lastScene = dayEndData?.lastScene || []
  const overtime = dayEndData?.overtime || []
  const isFinalEpisode = dayEndData?.isFinalEpisode || false

  useEffect(() => {
    setVisibleCount(0)
    setHeaderVisible(false)
    setLastSceneVisible(false)
    setUnaskedVisible(false)
    setOvertimeVisible(false)
    setFinalVisible(false)
    setNextVisible(false)

    const timers = []
    let cursor = 0

    // 헤더
    cursor = 600
    timers.push(setTimeout(() => setHeaderVisible(true), cursor))

    // 환자 순차 표시
    cursor = 1600
    patients.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), cursor + i * 500))
    })
    cursor += patients.length * 500

    // lastScene (Phase 3)
    if (lastScene.length > 0) {
      cursor += 1000
      timers.push(setTimeout(() => setLastSceneVisible(true), cursor))
      cursor += 800
    }

    // unasked (Phase 2+)
    if (unasked.length > 0) {
      cursor += 1000
      timers.push(setTimeout(() => setUnaskedVisible(true), cursor))
      cursor += 800
    }

    // overtime (Phase 3)
    if (overtime.length > 0) {
      cursor += 800
      timers.push(setTimeout(() => setOvertimeVisible(true), cursor))
      cursor += 800
    }

    // 마지막 에피소드 메시지
    if (isFinalEpisode) {
      cursor += 1200
      timers.push(setTimeout(() => setFinalVisible(true), cursor))
      cursor += 1000
    }

    // "다음 날" 버튼
    cursor += 1500
    timers.push(setTimeout(() => setNextVisible(true), cursor))

    return () => timers.forEach(clearTimeout)
  }, [dayEndData])

  return (
    <div className="day-end">
      <div className="day-end__content">
        <h2 className={`day-end__header ${headerVisible ? 'visible' : ''}`}>
          오늘 만난 사람들
        </h2>

        <div className="day-end__patients">
          {patients.map((patient, i) => (
            <div
              key={patient.name}
              className={`day-end__patient ${i < visibleCount ? 'visible' : ''}`}
            >
              <p className="day-end__patient-name">{patient.name}</p>
              <p className="day-end__patient-info">
                {patient.age}세 · {patient.chiefComplaint}
              </p>
            </div>
          ))}
        </div>

        {lastScene.length > 0 && (
          <div className={`day-end__last-scene ${lastSceneVisible ? 'visible' : ''}`}>
            {lastScene.map((item, i) => (
              <p key={i} className="day-end__last-scene-text">
                {item.description}
              </p>
            ))}
          </div>
        )}

        {unasked.length > 0 && (
          <div className={`day-end__unasked ${unaskedVisible ? 'visible' : ''}`}>
            {unasked.map((item, i) => (
              <p key={i} className="day-end__unasked-hint">
                {item.hint}
              </p>
            ))}
          </div>
        )}

        {overtime.length > 0 && (
          <div className={`day-end__overtime ${overtimeVisible ? 'visible' : ''}`}>
            {overtime.map((item, i) => (
              <p key={i} className="day-end__overtime-note">
                {item.note}
              </p>
            ))}
          </div>
        )}

        {isFinalEpisode && (
          <p className={`day-end__final ${finalVisible ? 'visible' : ''}`}>
            다음 주에 다시 옵니다.
          </p>
        )}
      </div>

      <button
        className={`day-end__next ${nextVisible ? 'visible' : ''}`}
        onClick={onNext}
      >
        {isFinalEpisode ? '...' : '다음 날 →'}
      </button>
    </div>
  )
}
