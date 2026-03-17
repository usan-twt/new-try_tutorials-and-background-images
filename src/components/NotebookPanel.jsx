import { useState } from 'react'
import './NotebookPanel.css'

export default function NotebookPanel({ chart }) {
  const [open, setOpen] = useState(false)
  const [memo, setMemo] = useState('')

  return (
    <>
      <button
        className={`notebook-toggle ${open ? 'notebook-toggle--active' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label="수첩 열기"
      >
        📓
      </button>

      <div className={`notebook-panel ${open ? 'notebook-panel--open' : ''}`}>
        <div className="notebook-panel__inner">
          <div className="notebook-panel__section">
            <p className="notebook-panel__label">차트</p>
            <p className="notebook-panel__chart">{chart}</p>
          </div>

          <div className="notebook-panel__section">
            <p className="notebook-panel__label">메모</p>
            <textarea
              className="notebook-panel__memo"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="여기에 메모..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </>
  )
}
