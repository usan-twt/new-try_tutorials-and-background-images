export default function InnerVoice({ text }) {
  if (!text) return null

  return (
    <div className="inner-voice">
      <p className="inner-voice__text">{text}</p>
    </div>
  )
}
