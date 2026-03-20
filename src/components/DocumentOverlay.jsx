// 제도 채널: 공식 문서 오버레이
export default function DocumentOverlay({ document: doc, onDismiss }) {
  if (!doc) return null
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(10,9,8,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#f0ebe0', width: 320, borderRadius: 2,
          padding: '28px 28px 22px', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          fontFamily: 'system-ui,sans-serif',
        }}
      >
        {/* 병원 로고 영역 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 16, paddingBottom: 12,
          borderBottom: '1px solid #c8c0b0',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#2a4a6a', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0,
          }}>+</div>
          <div>
            <div style={{ fontSize: 10, color: '#6a6050', letterSpacing: 1 }}>내부 문서</div>
            <div style={{ fontSize: 9, color: '#9a9080' }}>{doc.date}</div>
          </div>
        </div>

        {/* 제목 */}
        <div style={{ fontSize: 13, fontWeight: 600, color: '#2a2018', marginBottom: 14, letterSpacing: 0.5 }}>
          {doc.title}
        </div>

        {/* 본문 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {doc.body.map((line, i) => (
            <p key={i} style={{
              fontSize: 12, color: '#3a3028', lineHeight: 1.7, margin: 0,
            }}>{line}</p>
          ))}
        </div>

        {/* 발신 */}
        <div style={{
          fontSize: 10, color: '#8a7a60', textAlign: 'right',
          paddingTop: 12, borderTop: '1px solid #d8d0c0',
        }}>
          {doc.sender}
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={onDismiss}
          style={{
            display: 'block', width: '100%', marginTop: 16,
            padding: '8px 0', background: '#2a4a6a', color: '#fff',
            border: 'none', borderRadius: 2, fontSize: 12,
            cursor: 'pointer', letterSpacing: 1,
          }}
        >
          확인
        </button>
      </div>
    </div>
  )
}
