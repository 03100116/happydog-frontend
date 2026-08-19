import { useState, useEffect } from 'react'
import { STYLES } from '../api'

const STEPS = [
  { title: '社群名称', placeholder: '给你的社群起个名字...' },
  { title: '音乐风格', placeholder: null },
  { title: '社群简介', placeholder: '描述一下你的社群方向...' },
]

export default function CreateCommunityFlow({ onClose }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [style, setStyle] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const canNext = () => {
    if (step === 0) return name.trim().length > 0
    if (step === 1) return style.length > 0
    if (step === 2) return desc.trim().length > 0
    return false
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      // Start "creating"
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setShowVideo(true)
      }, 3000)
    }
  }

  // Loading screen with progress simulation
  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="ccf-box" onClick={e => e.stopPropagation()}>
          <div className="ccf-loading">
            <div className="ccf-spinner" />
            <div className="ccf-loading-title">正在创建社群...</div>
            <div className="ccf-loading-sub">AI 正在为你搭建社群空间</div>
            <div className="ccf-loading-bar">
              <div className="ccf-loading-fill" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Video result screen
  if (showVideo) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="ccf-box ccf-video-box" onClick={e => e.stopPropagation()}>
          <div className="ccf-hd">
            <div className="ccf-tt">🎉 社群创建成功</div>
            <button className="ccf-close" onClick={onClose}>✕</button>
          </div>
          <div className="ccf-video-wrap">
            <video
              className="ccf-video"
              controls
              autoPlay
              poster=""
              src="https://www.w3schools.com/html/mov_bbb.mp4"
            >
              您的浏览器不支持视频播放
            </video>
          </div>
          <div className="ccf-video-info">
            <div className="ccf-video-name">🎵 {name}</div>
            <div className="ccf-video-meta">{style} · 已创建</div>
          </div>
          <div className="ccf-video-actions">
            <button className="gbtn" onClick={onClose}>进入社群</button>
            <button className="ct" onClick={onClose}>邀请好友</button>
          </div>
        </div>
      </div>
    )
  }

  // Step form
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ccf-box" onClick={e => e.stopPropagation()}>
        <div className="ccf-hd">
          <div className="ccf-tt">创建新社群</div>
          <button className="ccf-close" onClick={onClose}>✕</button>
        </div>

        {/* Step indicator */}
        <div className="ccf-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`ccf-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
              <div className="ccf-step-dot">{i < step ? '✓' : i + 1}</div>
              <div className="ccf-step-label">{s.title}</div>
            </div>
          ))}
          <div className="ccf-step-line">
            <div className="ccf-step-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Step content */}
        <div className="ccf-body">
          {step === 0 && (
            <div className="ccf-field">
              <label>社群名称</label>
              <input className="ccf-input" value={name} onChange={e => setName(e.target.value)}
                placeholder="给你的社群起个名字..." autoFocus
                onKeyDown={e => e.key === 'Enter' && canNext() && handleNext()} />
            </div>
          )}

          {step === 1 && (
            <div className="ccf-field">
              <label>选择音乐风格</label>
              <div className="ccf-style-grid">
                {STYLES.map(s => (
                  <button key={s} className={`ccf-style-chip${style === s ? ' active' : ''}`}
                    onClick={() => setStyle(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="ccf-field">
              <label>社群简介</label>
              <textarea className="ccf-textarea" value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="描述一下你的社群方向..." autoFocus />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ccf-actions">
          {step > 0 && <button className="ct" onClick={() => setStep(step - 1)}>← 上一步</button>}
          <div style={{ flex: 1 }} />
          <button className={`cbtn${!canNext() ? ' disabled' : ''}`} disabled={!canNext()} onClick={handleNext}>
            {step === STEPS.length - 1 ? '🚀 创建社群' : '下一步 →'}
          </button>
        </div>
      </div>
    </div>
  )
}
