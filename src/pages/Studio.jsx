import { useState, useEffect, useRef } from 'react'
import { STYLES, VOICE_TYPES, apiGenerate, apiLocate, apiPublishToSquare } from '../api'

const MODELS = [
  { key: 'fun-music', label: 'Fun-Music', desc: '全能音乐生成' },
  { key: 'ace-step', label: 'ACE-Step', desc: '高质量编曲' },
  { key: 'musicgen', label: 'MusicGen', desc: '快速生成' },
]

const EMOTIONS = [
  { icon: '😊', label: '开心' }, { icon: '😢', label: '悲伤' },
  { icon: '😡', label: '愤怒' }, { icon: '😌', label: '平静' },
  { icon: '🥰', label: '甜蜜' }, { icon: '😎', label: '自信' },
  { icon: '🌧️', label: '忧郁' }, { icon: '🔥', label: '燃' },
  { icon: '💔', label: '心碎' }, { icon: '🎉', label: '庆祝' },
  { icon: '🌙', label: '孤独' }, { icon: '🌈', label: '希望' },
]

export default function Studio() {
  const [model, setModel] = useState('fun-music')
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [description, setDescription] = useState('')
  const [locationEnabled, setLocEnabled] = useState(false)
  const [locationData, setLocationData] = useState(null)
  const [liveEnabled, setLiveEnabled] = useState(false)
  const [showAdv, setShowAdv] = useState(false)
  const [style, setStyle] = useState('民谣')
  const [voiceType, setVoiceType] = useState('女声')
  const [showEmotions, setShowEmotions] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const modelRef = useRef(null)
  const emotionRef = useRef(null)
  const fileRef = useRef(null)
  const resultRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modelRef.current && !modelRef.current.contains(e.target)) setShowModelMenu(false)
      if (emotionRef.current && !emotionRef.current.contains(e.target)) setShowEmotions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLocation = async () => {
    if (locationEnabled) { setLocEnabled(false); setLocationData(null); return }
    const granted = window.confirm('HappyDog🎼 想要访问你的位置信息，是否允许？')
    if (granted) {
      setLocEnabled(true)
      const res = await apiLocate({})
      if (res.code === 0) setLocationData(res.data)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleCreate = async () => {
    setGenerating(true)
    await apiGenerate({ description, style, voice_type: voiceType })
    setTimeout(() => {
      setGenerating(false)
      setShowResult(true)
    }, 4000)
  }

  const handlePublish = async () => {
    await apiPublishToSquare({
      title: `${selectedEmotion || '🎵'} ${style}之日`,
      style,
      language: '中文',
      region: locationData?.city || '',
      cover_color: '#3b82f6',
      emoji: selectedEmotion || '🎵',
    })
  }

  const currentModel = MODELS.find(m => m.key === model)

  const randomColor = () => {
    const colors = ['#8ed8c8','#f8c8b4','#c4b5fd','#a5d0f5','#f0c040','#e8707a','#6bc980']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const songTitle = `${selectedEmotion || '🎵'} ${style}之日`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="hero">
        <div className="hero-bg" />

        <h1>Make a song about my day!<span className="cur" /></h1>
        <p className="hero-sub">上传图片，写下心情，AI 帮你生成专属音乐卡片</p>

        <div className="cb">
          {/* a) Image Upload */}
          <div className="img-upload-area" onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleImageUpload} />
            {imagePreview ? (
              <div className="img-preview-wrap">
                <img src={imagePreview} className="img-preview" alt="uploaded" />
                <button className="img-remove" onClick={(e) => { e.stopPropagation(); setImagePreview(null) }}>✕</button>
                {liveEnabled && <div className="img-live-badge">LIVE</div>}
              </div>
            ) : (
              <div className="img-placeholder">
                <div className="img-placeholder-icon">📷</div>
                <div className="img-placeholder-text">点击拍照或选择图片</div>
              </div>
            )}
          </div>

          {/* b) img-hint */}
          <div className="img-hint">拍下此刻的风景，AI 会为它谱一首曲</div>

          {/* c) Live toggle row */}
          <div className="cb-row">
            <div className="toggle-wrap">
              <span className="toggle-label">Live</span>
              <button className={`toggle-sw${liveEnabled ? ' on' : ''}`} onClick={() => setLiveEnabled(!liveEnabled)}>
                <div className="toggle-knob" />
              </button>
            </div>
          </div>

          {/* d) Text input */}
          <textarea className="cb-in" value={description} onChange={e => setDescription(e.target.value)}
            placeholder="写下你此刻的心情、故事、或者任何想法..." />

          {/* e) Bottom action row */}
          <div className="cb-a">
            <button className={`ct loc-btn${locationEnabled ? ' active' : ''}`} onClick={handleLocation}>
              📍 {locationEnabled ? (locationData?.city || '已定位') : '定位'}
            </button>

            {/* Emotion dice */}
            <div className="emotion-wrap" ref={emotionRef}>
              <button className="dice" title="选择情绪" onClick={() => setShowEmotions(!showEmotions)}>
                {selectedEmotion ? (
                  <span>{selectedEmotion} 今日心情</span>
                ) : (
                  <span>＋ 今日心情</span>
                )}
              </button>
              {showEmotions && (
                <div className="emotion-popup">
                  <div className="emotion-title">选择情绪</div>
                  <div className="emotion-grid">
                    {EMOTIONS.map(em => (
                      <button key={em.label}
                        className={`emotion-item${selectedEmotion === em.icon ? ' active' : ''}`}
                        onClick={() => { setSelectedEmotion(em.icon); setShowEmotions(false) }}>
                        <span className="em-icon">{em.icon}</span>
                        <span className="em-label">{em.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className={`ct${showAdv ? ' active' : ''}`} onClick={() => setShowAdv(!showAdv)}>⚙ 风格</button>

            <div className="model-dropdown-wrap" ref={modelRef}>
              <button className="ct model-trigger" onClick={() => setShowModelMenu(!showModelMenu)}>
                🤖 {currentModel?.label} <span style={{ fontSize: 8, marginLeft: 2 }}>▾</span>
              </button>
              {showModelMenu && (
                <div className="model-menu">
                  {MODELS.map(m => (
                    <button key={m.key} className={`model-menu-item${model === m.key ? ' active' : ''}`}
                      onClick={() => { setModel(m.key); setShowModelMenu(false) }}>
                      <div className="mmi-label">{m.label}</div>
                      <div className="mmi-desc">{m.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="cb-sp" />

            <button className="cbtn" onClick={handleCreate}>🎵 创作</button>
          </div>

          {/* f) Advanced panel - only style and voice type */}
          {showAdv && (
            <div className="adv show">
              <div className="ag">
                <label>风格</label>
                <select className="as" value={style} onChange={e => setStyle(e.target.value)}>
                  {STYLES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="ag">
                <label>人声</label>
                <select className="as" value={voiceType} onChange={e => setVoiceType(e.target.value)}>
                  {VOICE_TYPES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* g) Dog loading animation */}
        {generating && (
          <div className="modal-overlay" onClick={() => setGenerating(false)}>
            <div className="video-loading-modal" onClick={e => e.stopPropagation()}>
              <button className="video-loading-close" onClick={() => setGenerating(false)}>✕</button>
              <video src="/demo.mp4" autoPlay loop muted playsInline />
              <div className="video-loading-info">
                <h4>正在为你创作...</h4>
                <p>Every dog has its day 🐕</p>
              </div>
            </div>
          </div>
        )}

        {/* h) Result card - floating overlay */}
        {showResult && (
          <div className="result-overlay" onClick={() => setShowResult(false)}>
            <div className="music-result-card large" ref={resultRef} onClick={e => e.stopPropagation()}>
              <button className="result-close" onClick={() => setShowResult(false)}>✕</button>
              <div className="mrc-cover" style={!imagePreview ? { background: randomColor() } : undefined}>
                {imagePreview ? (
                  <img src={imagePreview} className={`mrc-cover-img${liveEnabled ? ' live-photo' : ''}`} alt="cover" />
                ) : null}
                <div className="mrc-cover-overlay" />
                {liveEnabled && (
                  <div className="mrc-live-badge">
                    <div className="mrc-live-dot" />
                    LIVE
                  </div>
                )}
                <div className="mrc-info-overlay">
                  <div className="mrc-title">{songTitle}</div>
                  <div className="mrc-subtitle">
                    {locationEnabled && <span>📍 {locationData?.city}</span>}
                    {selectedEmotion && <span>{selectedEmotion}</span>}
                    <span>{style}</span>
                  </div>
                </div>
              </div>
              <div className="mrc-body">
                <div className="mrc-meta-row">
                  <div className="mrc-weather">
                    <span>⛅ 24°C</span>
                    <span className="mrc-weather-sub">微风 · 晴</span>
                  </div>
                  <button className="mrc-heart">♡</button>
                </div>
                <div className="mrc-wave">
                  {Array.from({ length: 60 }, (_, i) => (
                    <div key={i} className="mrc-wave-bar" style={{ height: Math.random() * 24 + 4, background: i < 24 ? 'var(--red)' : 'rgba(255,255,255,.06)' }} />
                  ))}
                </div>
                <div className="mrc-time">
                  <span>0:24</span><span>1:30</span>
                </div>
                <div className="mrc-tags">
                  <span className="mrc-tag">{style}</span>
                  <span className="mrc-tag">{voiceType}</span>
                </div>
                <div className="mrc-actions">
                  <button className="mrc-act-btn primary">▶ 播放</button>
                  <button className="mrc-act-btn">⬇ 下载</button>
                  <button className="mrc-act-btn">📋 歌词</button>
                  <button className="mrc-act-btn">🔀 Remix</button>
                  <button className="mrc-act-btn publish" onClick={async () => { await handlePublish(); setShowResult(false); }}>📢 发布到广场</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
