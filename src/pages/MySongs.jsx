import { useState, useEffect } from 'react'
import { STATUS_MAP, SOURCE_MAP, STYLE_COLORS, apiGetMySongs, apiPublish } from '../api'
import { generateWaveform, showToast } from '../utils'

const TABS = [
  { value: 'all', label: '全部' },
  { value: '0', label: '草稿' },
  { value: '2', label: '生成中' },
  { value: '1', label: '已发布' },
  { value: '3', label: '失败' },
]

export default function MySongs() {
  const [songs, setSongs] = useState([])
  const [filter, setFilter] = useState('all')
  const [popupSong, setPopupSong] = useState(null)

  useEffect(() => {
    loadSongs()
  }, [filter])

  const loadSongs = async () => {
    const params = filter === 'all' ? {} : { status: Number(filter) }
    const res = await apiGetMySongs(params)
    if (res.code === 0) setSongs(res.data.list)
  }

  const handlePublish = async (id) => {
    const res = await apiPublish(id)
    if (res.code === 0) {
      showToast('发布成功', 'success')
      loadSongs()
    } else {
      showToast('发布失败', 'error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-wrap">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>我的创作</h2>
        <div className="my-tabs">
          {TABS.map(t => (
            <button key={t.value} className={`my-tab${filter === t.value ? ' active' : ''}`} onClick={() => setFilter(t.value)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="big-card-grid">
          {songs.map(song => {
            const st = STATUS_MAP[song.status]
            const styleColor = STYLE_COLORS[song.style] || '#8ed8c8'
            return (
              <div key={song.id} className="big-card" style={{ cursor: 'pointer' }} onClick={() => setPopupSong(song)}>
                <div className="big-card-cover" style={{ background: `linear-gradient(135deg, ${styleColor}60, ${styleColor}20)` }}>
                  <div className="big-card-emoji">🎵</div>
                  <div className="big-card-play">▶</div>
                  <div className="big-card-info-overlay">
                    <div className="big-card-title-overlay">{song.title}</div>
                    <div className="big-card-tags-overlay">
                      <span className="big-card-tag-o">{song.style}</span>
                      {song.voice_type && <span className="big-card-tag-o">{song.voice_type}</span>}
                    </div>
                  </div>
                </div>
                <div className="big-card-body">
                  <div className="big-card-creator">
                    <div className="big-card-av" style={{ background: styleColor + '25' }}>
                      🎵
                    </div>
                    <span className="big-card-creator-name">{song.style} · {song.voice_type}</span>
                    {song.duration && <span className="big-card-region">{song.duration}s</span>}
                  </div>
                  <div className="big-card-wave">
                    {generateWaveform(40, song.id).map((h, i) => (
                      <div key={i} className="big-card-wave-bar" style={{ height: h, background: i < 16 ? 'var(--teal)' : 'rgba(0,0,0,.04)' }} />
                    ))}
                  </div>
                  <div className="big-card-stats">
                    <span className="my-card-status" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    {song.status === 0 && <button className="ra" onClick={() => handlePublish(song.id)}>📢 发布</button>}
                    {song.status === 1 && <button className="ra">🔀 Remix</button>}
                    <button className="ra">⋯</button>
                  </div>
                </div>
              </div>
            )
          })}
          {songs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)', fontSize: 12, gridColumn: '1 / -1' }}>暂无作品</div>
          )}
        </div>
      </div>

      {/* Card popup */}
      {popupSong && (
        <div className="card-popup-overlay" onClick={e => e.target === e.currentTarget && setPopupSong(null)}>
          <div className="card-popup">
            <button className="card-popup-close" onClick={() => setPopupSong(null)}>✕</button>
            <div className="card-popup-cover" style={{ background: `linear-gradient(135deg, ${(STYLE_COLORS[popupSong.style] || '#8ed8c8')}60, ${(STYLE_COLORS[popupSong.style] || '#8ed8c8')}20)` }}>
              <div className="card-popup-emoji">🎵</div>
              <div className="card-popup-title-overlay">{popupSong.title}</div>
            </div>
            <div className="card-popup-body">
              <div className="card-popup-tags">
                <span className="card-popup-tag" style={{ background: (STYLE_COLORS[popupSong.style] || '#888') + '15', color: STYLE_COLORS[popupSong.style] || '#888' }}>{popupSong.style}</span>
                {popupSong.voice_type && <span className="card-popup-tag">{popupSong.voice_type}</span>}
                {popupSong.language && <span className="card-popup-tag">{popupSong.language}</span>}
              </div>
              <div className="card-popup-meta">
                {popupSong.duration && `${popupSong}s · `}
                ▶ {popupSong.play_count || 0}  ❤ {popupSong.like_count || 0}
              </div>
              <div className="card-popup-wave">
                {generateWaveform(50, popupSong.id).map((h, i) => (
                  <div key={i} className="card-popup-wave-bar" style={{ height: h, background: i < 20 ? 'var(--teal)' : 'rgba(0,0,0,.06)' }} />
                ))}
              </div>
              <div className="card-popup-actions">
                <button className="gbtn" style={{ fontSize: 11, padding: '6px 14px' }}>▶ 播放</button>
                <button className="ct" style={{ fontSize: 11, padding: '6px 14px' }}>🔀 Remix</button>
                <button className="ct" style={{ fontSize: 11, padding: '6px 14px' }}>📋 歌词</button>
                {popupSong.status === 0 && <button className="gbtn" style={{ fontSize: 11, padding: '6px 14px' }} onClick={async () => { await handlePublish(popupSong.id); setPopupSong(null) }}>📢 发布</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
