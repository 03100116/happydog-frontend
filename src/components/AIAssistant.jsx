import { useState, useRef, useEffect } from 'react'

const VOICES = [
  { value: 'xiaomo', label: '🎙 小莫 · 温暖女声' },
  { value: 'laole', label: '🎙 老乐 · 磁性男声' },
  { value: 'xiaoyue', label: '🎙 小粤 · 粤语女声' },
  { value: 'djmax', label: '🎙 DJ Max · 活力男声' },
  { value: 'xiaotian', label: '🎙 小甜 · 甜美女声' },
]

const AI_REPLIES = [
  '五声音阶就是 do re mi sol la（宫商角徵羽），中国传统音乐最基础的音阶。',
  '推荐适合说唱的 beat：trap 风格试 808 bass + hi-hats；老学校 boom bap 用 sampled drums + jazz piano chop。',
  '粤语歌讲究"协音"——歌词声调要和旋律走向一致。粤语 9 个声调比普通话复杂很多。',
  '分析歌词结构看：押韵模式（AABB/ABAB）、句式长短节奏、情绪曲线。好的歌词像讲故事。',
]

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: '你好！我是HappyDog🎼音乐助手 🎧🎵\n\n可以问我任何音乐问题。\n\n试试：\n• 什么是五声音阶？\n• 帮我推荐适合说唱的beat\n• 分析这段歌词的韵律' }
  ])
  const [input, setInput] = useState('')
  const [voice, setVoice] = useState('xiaomo')
  const [speed, setSpeed] = useState('1x')
  const msgsRef = useRef(null)
  const replyIdx = useRef(0)

  const speeds = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x']

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages])

  const send = () => {
    const v = input.trim()
    if (!v) return
    setMessages(prev => [...prev, { role: 'usr', text: v }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: AI_REPLIES[replyIdx.current++ % AI_REPLIES.length] }])
    }, 600)
  }

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed)
    setSpeed(speeds[(idx + 1) % speeds.length])
  }

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen(!open)}>
        <span className="ai-pulse" />
        🤖
      </button>
      {open && (
        <div className="ai-panel">
          <div className="ai-hd">
            <div className="ai-tt">🤖 HappyDog🎼助手</div>
            <button className="ai-cls" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="ai-voice-bar">
            <span className="ai-voice-label">音色</span>
            <select className="ai-voice-sel" value={voice} onChange={e => setVoice(e.target.value)}>
              {VOICES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
            <button className="ai-speed" onClick={cycleSpeed}>{speed}</button>
          </div>
          <div className="ai-msgs" ref={msgsRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.text.split('\n').map((line, j) => <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>)}
              </div>
            ))}
          </div>
          <div className="ai-bar">
            <input
              className="ai-in"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="问任何音乐问题..."
            />
            <button className="ai-mic">🎤</button>
            <button className="ai-send-btn" onClick={send}>➤</button>
          </div>
        </div>
      )}
    </>
  )
}
