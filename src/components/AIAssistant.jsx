import { useState, useRef, useEffect } from 'react'
import { showToast } from '../utils'

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

function TypingDots() {
  return (
    <div className="ai-typing">
      <span />
      <span />
      <span />
    </div>
  )
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: '你好！我是 HappyDog 音乐助手 🎧🎵\n\n可以问我任何音乐问题。\n\n试试：\n• 什么是五声音阶？\n• 帮我推荐适合说唱的 beat\n• 分析这段歌词的韵律' }
  ])
  const [input, setInput] = useState('')
  const [voice, setVoice] = useState('xiaomo')
  const [speed, setSpeed] = useState('1x')
  const [typing, setTyping] = useState(false)
  const msgsRef = useRef(null)

  const speeds = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x']

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, typing])

  const pickReply = () => AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)]

  const send = () => {
    const v = input.trim()
    if (!v) return
    setMessages(prev => [...prev, { role: 'usr', text: v }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text: pickReply() }])
    }, 900)
  }

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed)
    setSpeed(speeds[(idx + 1) % speeds.length])
  }

  const handleMic = () => {
    showToast('语音输入暂未开放，敬请期待', 'info')
  }

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen(!open)} aria-label="AI 助手">
        <span className="ai-pulse" />
        🤖
      </button>
      {open && (
        <div className="ai-panel">
          <div className="ai-hd">
            <div className="ai-tt">🤖 HappyDog 助手</div>
            <button className="ai-cls" onClick={() => setOpen(false)} aria-label="关闭">✕</button>
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
              <div key={i} className={`ai-msg ${m.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="ai-msg bot">
                <TypingDots />
              </div>
            )}
          </div>
          <div className="ai-bar">
            <input
              className="ai-in"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="问任何音乐问题..."
            />
            <button className="ai-mic" onClick={handleMic} aria-label="语音输入">🎤</button>
            <button className="ai-send-btn" onClick={send} aria-label="发送">➤</button>
          </div>
        </div>
      )}
    </>
  )
}
