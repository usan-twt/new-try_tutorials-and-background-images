import { useState, useEffect } from 'react'
import './DayEndScreen.css'

export default function DayEndScreen({ dayEndData, onNext }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [nextVisible, setNextVisible] = useState(false)

  const patients = dayEndData?.patients || []

  useEffect(() => {
    setVisibleCount(0)
    setHeaderVisible(false)
    setNextVisible(false)

    // 헤더 먼저
    const headerTimer = setTimeout(() => setHeaderVisible(true), 600)

    // 환자 정보 하나씩 페이드인
    const patientTimers = patients.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), 1600 + i * 500)
    )

    // "다음 날" 버튼 — 마지막 환자 표시 후 1.5초
    const nextTimer = setTimeout(
      () => setNextVisible(true),
      1600 + patients.length * 500 + 1500
    )

    return () => {
      clearTimeout(headerTimer)
      patientTimers.forEach(clearTimeout)
      clearTimeout(nextTimer)
    }
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
