import { useState, useEffect } from 'react'
import './DayEndScreen.css'

export default function DayEndScreen({ dayEndData, onNext }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [unaskedVisible, setUnaskedVisible] = useState(false)
  const [nextVisible, setNextVisible] = useState(false)

  const patients = dayEndData?.patients || []
  const unasked = dayEndData?.unasked || []

  useEffect(() => {
    setVisibleCount(0)
    setHeaderVisible(false)
    setUnaskedVisible(false)
    setNextVisible(false)

    const timers = []

    // 헤더
    timers.push(setTimeout(() => setHeaderVisible(true), 600))

    // 환자 정보 순차 페이드인
    patients.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 1600 + i * 500))
    })

    const afterPatients = 1600 + patients.length * 500

    // Phase 2+: unasked 힌트
    if (unasked.length > 0) {
      timers.push(setTimeout(() => setUnaskedVisible(true), afterPatients + 1000))
    }

    // "다음 날" 버튼
    const nextDelay = unasked.length > 0
      ? afterPatients + 1000 + 1500
      : afterPatients + 1500
    timers.push(setTimeout(() => setNextVisible(true), nextDelay))

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

        {unasked.length > 0 && (
          <div className={`day-end__unasked ${unaskedVisible ? 'visible' : ''}`}>
            {unasked.map((item, i) => (
              <p key={i} className="day-end__unasked-hint">
                {item.hint}
              </p>
            ))}
          </div>
        )}
      </div>

      <button
        className={`day-end__next ${nextVisible ? 'visible' : ''}`}
        onClick={onNext}
      >
        다음 날 →
      </button>
    </div>
  )
}
