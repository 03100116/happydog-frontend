import { useState, useEffect, useRef } from 'react'

const STAGES = [
  { pct: 0, icon: '⏳', text: 'PENDING · 排队中...', spin: true },
  { pct: 30, icon: '📝', text: 'RUNNING · 生成歌词中... (30%)', spin: false },
  { pct: 60, icon: '🎹', text: 'RUNNING · AI 编曲中... (60%)', spin: false },
  { pct: 85, icon: '🎤', text: 'RUNNING · 合成人声... (85%)', spin: false },
  { pct: 100, icon: '✅', text: 'SUCCESS · 生成完成！', spin: false },
]

export default function TaskProgress({ visible, params, onClose, onComplete }) {
  const [stage, setStage] = useState(0)
  const [cancelled, setCancelled] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!visible) { setStage(0); setCancelled(false); return }
    let s = 0
    const advance = () => {
      if (cancelled) return
      s++
      if (s < STAGES.length) {
        setStage(s)
        if (s < STAGES.length - 1) timerRef.current = setTimeout(advance, 1500)
      }
    }
    timerRef.current = setTimeout(advance, 1500)
    return () => clearTimeout(timerRef.current)
  }, [visible, cancelled])

  if (!visible) return null

  const cur = cancelled ? { pct: 0, icon: '🚫', text: 'CANCELLED · 已取消', spin: false } : STAGES[stage]
  const done = stage === STAGES.length - 1 && !cancelled

  return (
    <div className="modal-overlay">
      <div className="task-box">
        <div className={`task-icon${cur.spin ? ' spinning' : ''}`}>{cur.icon}</div>
        <div className="task-title">正在生成歌曲...</div>
        <div className="task-sub">{params?.style} · {params?.language} · {params?.duration}s · {params?.voice_type}</div>
        <div className="task-progress-bar">
          <div className="task-progress-fill" style={{ width: cur.pct + '%' }} />
        </div>
        <div className="task-progress-text">{cur.text}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {!done && !cancelled && <button className="ra" onClick={() => { setCancelled(true); clearTimeout(timerRef.current) }}>✕ 取消任务</button>}
          {done && <button className="ra" onClick={() => { onClose(); onComplete?.() }}>👀 查看结果</button>}
          {(done || cancelled) && <button className="ra" onClick={onClose}>关闭</button>}
        </div>
      </div>
    </div>
  )
}
