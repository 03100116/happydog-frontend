import { useState, useRef } from 'react'
import { showToast } from '../utils'

const ACCEPT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

export default function Podcast() {
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [ready, setReady] = useState(false)
  const fileRef = useRef(null)

  const handleUploadClick = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ACCEPT_TYPES.includes(file.type)) {
      showToast('仅支持 PDF、Word 或 TXT 文件', 'warning')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('文件大小不能超过 20MB', 'warning')
      return
    }
    setFileName(file.name)
    setUploaded(true)
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setReady(true)
    }, 3000)
  }

  return (
    <div className="hero">
      <div className="hero-bg" />
      <h1>AI 播客</h1>
      <p className="hero-sub">上传文档，AI 自动生成播客音频</p>

      {/* Upload Area */}
      <div className="cb" style={{ maxWidth: 520 }}>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className="img-upload-area" onClick={handleUploadClick}>
          {!uploaded ? (
            <div className="img-placeholder">
              <div className="img-placeholder-icon">📄</div>
              <div className="img-placeholder-text">点击上传文档（PDF / Word / TXT）</div>
            </div>
          ) : (
            <div className="img-placeholder" style={{ background: 'rgba(94,198,176,.08)' }}>
              <div className="img-placeholder-icon">✅</div>
              <div className="img-placeholder-text">文档已上传：{fileName}</div>
            </div>
          )}
        </div>
        <p className="img-hint">支持 PDF、Word、TXT 格式，最大 20MB</p>

        {generating && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="dog-anim">🎙️</div>
            <div className="dog-loading-title">AI 正在生成播客...</div>
            <div className="dog-loading-sub">分析文档内容，合成自然对话语音</div>
            <div className="dog-bar" style={{ margin: '14px auto 0' }}>
              <div className="dog-bar-fill" />
            </div>
          </div>
        )}
      </div>

      {/* Podcast Result Card */}
      {ready && (
        <div className="podcast-card">
          <video src="/demo.mp4" controls style={{ width: '100%', display: 'block', background: '#000' }} />
          <div className="podcast-card-body">
            <h4>AI 生成的播客</h4>
            <p>基于你上传的文档，AI 为你生成了这段播客音频</p>
            <div className="podcast-card-tags">
              <span className="mrc-tag">🎙️ 播客</span>
              <span className="mrc-tag">AI 生成</span>
              <span className="mrc-tag">文档转语音</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
