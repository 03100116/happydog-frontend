import { useState, useEffect } from 'react'
import { STYLES, STYLE_COLORS, apiGetCards, apiGetRooms, apiGetComments, apiPostComment, apiLike, apiUnlike, publishedCards } from '../api'
import { generateWaveform, showToast } from '../utils'
import CreateCommunityFlow from '../components/CreateCommunityFlow'

const SUB_TABS = [
  { key: 'square', label: '社群广场' },
  { key: 'mine', label: '我的社群' },
]

export default function Community() {
  const [subTab, setSubTab] = useState('square')

  // Square state
  const [cards, setCards] = useState([])
  const [styleFilter, setStyleFilter] = useState('')
  const [sort, setSort] = useState('newest')

  // Rooms state
  const [rooms, setRooms] = useState([])

  // Create flow
  const [showCreate, setShowCreate] = useState(false)

  // Card popup
  const [popupCard, setPopupCard] = useState(null)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFaved, setIsFaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // Search
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    if (subTab === 'square') {
      apiGetCards({ style: styleFilter, sort }).then(res => {
        if (res.code === 0) {
          const merged = [...publishedCards, ...res.data.list]
          setCards(merged)
        }
      })
    } else {
      apiGetRooms().then(res => { if (res.code === 0) setRooms(res.data) })
    }
  }, [subTab, styleFilter, sort])

  const openPopup = async (card) => {
    setPopupCard(card)
    setIsLiked(false)
    setIsFaved(false)
    setLikeCount(card.like_count || 0)
    setCommentInput('')
    const res = await apiGetComments(card.id)
    if (res.code === 0) setComments(res.data.list)
  }

  const closePopup = () => {
    setPopupCard(null)
    setComments([])
    setCommentInput('')
  }

  const handleLike = async () => {
    if (isLiked) {
      const res = await apiUnlike(popupCard.id)
      if (res.code === 0) { setIsLiked(false); setLikeCount(res.data.like_count) }
    } else {
      const res = await apiLike(popupCard.id)
      if (res.code === 0) { setIsLiked(true); setLikeCount(res.data.like_count) }
    }
  }

  const handleComment = async () => {
    if (!commentInput.trim()) return
    const res = await apiPostComment(popupCard.id, commentInput.trim())
    if (res.code === 0) {
      setComments([...comments, res.data])
      setCommentInput('')
      showToast('评论成功', 'success')
    }
  }

  const statusColor = (p) => p === 100 ? '#22c55e' : p > 50 ? '#f0a030' : '#3b82f6'
  const avColors = ['#e8446a', '#ff6b35', '#8b5cf6', '#2dd4bf']

  const filteredCards = searchInput
    ? cards.filter(c => c.title.includes(searchInput) || c.style.includes(searchInput) || (c.creator?.nickname || '').includes(searchInput))
    : cards

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2>社群</h2>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>用钉钉组队写歌，AI 帮你们把素材变成完整歌曲</p>
          </div>
          <button className="gbtn" onClick={() => setShowCreate(true)}>＋ 创建空间</button>
        </div>

        {/* Sub tabs + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {SUB_TABS.map(t => (
            <button key={t.key}
              className={`comm-tab${subTab === t.key ? ' active' : ''}`}
              onClick={() => setSubTab(t.key)}>
              {t.label}
            </button>
          ))}
          {subTab === 'square' && (
            <>
              <div style={{ flex: 1 }} />
              <input
                className="comm-search"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="搜索歌曲、风格、创作者..."
              />
            </>
          )}
        </div>

        {/* ── Square Tab ── */}
        {subTab === 'square' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">最新发布</option>
                <option value="hot">最热</option>
                <option value="editor_pick">编辑推荐</option>
              </select>
              <div className="mfs">
                <button className={`mfc${styleFilter === '' ? ' active' : ''}`} onClick={() => setStyleFilter('')}>全部</button>
                {STYLES.map(s => (
                  <button key={s} className={`mfc${styleFilter === s ? ' active' : ''}`} onClick={() => setStyleFilter(s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Big card grid */}
            <div className="big-card-grid">
              {filteredCards.map(card => (
                <div key={card.id} className="big-card" onClick={() => openPopup(card)}>
                  <div className="big-card-cover" style={{ background: `linear-gradient(135deg, ${(STYLE_COLORS[card.style] || '#8ed8c8')}60, ${(STYLE_COLORS[card.style] || '#8ed8c8')}20)` }}>
                    <div className="big-card-emoji">{card.emoji}</div>
                    <div className="big-card-play">▶</div>
                    <div className="big-card-info-overlay">
                      <div className="big-card-title-overlay">{card.title}</div>
                      <div className="big-card-tags-overlay">
                        <span className="big-card-tag-o">{card.style}</span>
                        {card.language && <span className="big-card-tag-o">{card.language}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="big-card-body">
                    <div className="big-card-creator">
                      <div className="big-card-av" style={{ background: (card.creator?.avatar_color || '#888') + '25' }}>
                        {card.creator?.nickname?.[0]}
                      </div>
                      <span className="big-card-creator-name">{card.creator?.nickname}</span>
                      {card.region && <span className="big-card-region">{card.region}</span>}
                    </div>
                    <div className="big-card-wave">
                      {generateWaveform(40, card.id).map((h, i) => (
                        <div key={i} className="big-card-wave-bar" style={{ height: h, background: i < 16 ? 'var(--teal)' : 'rgba(0,0,0,.04)' }} />
                      ))}
                    </div>
                    <div className="big-card-stats">
                      <span>▶ {card.play_count}</span>
                      <span>❤ {card.like_count}</span>
                      <span>💬 {card.comment_count}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCards.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)', fontSize: 12, gridColumn: '1 / -1' }}>
                  {searchInput ? '没有找到匹配的内容' : '暂无内容'}
                </div>
              )}
            </div>

            <div className="load-more">↓ 下拉加载更多</div>
          </>
        )}

        {/* ── My Communities Tab ── */}
        {subTab === 'mine' && (
          <>
            <div className="comm-header" style={{ marginBottom: 20 }}>
              <h3>🐕 我的空间</h3>
              <p>加入空间和好友一起协作创作，AI 实时合成每个人的素材</p>
            </div>
            <div className="room-grid">
              {rooms.map((r, i) => {
                const sc = statusColor(r.progress)
                return (
                  <div key={i} className="room-card" style={{ cursor: 'pointer' }} onClick={() => showToast(`进入空间「${r.name}」`, 'success')}>
                    <div className="room-head">
                      <div className="room-cv" style={{ background: r.color + '20' }}>{r.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div className="room-name">{r.name}</div>
                        <div className="room-desc">{r.style} · {r.status}</div>
                      </div>
                      <span className="room-status" style={{ background: sc + '15', color: sc, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 5 }}>{r.status}</span>
                    </div>
                    <div className="room-bar">
                      <div className="room-fill" style={{ width: r.progress + '%', background: sc }} />
                    </div>
                    <div className="room-foot">
                      <div className="room-avs">
                        {r.members.map((m, j) => (
                          <div key={j} className="room-av" style={{ background: avColors[j % 4] + '20' }}>{m}</div>
                        ))}
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>{r.progress}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Card detail popup with comments & interactions */}
      {popupCard && (
        <div className="card-popup-overlay" onClick={e => e.target === e.currentTarget && closePopup()}>
          <div className="card-popup" style={{ maxWidth: 520 }}>
            <button className="card-popup-close" onClick={closePopup}>✕</button>
            <div className="card-popup-cover" style={{ background: `linear-gradient(135deg, ${(STYLE_COLORS[popupCard.style] || '#8ed8c8')}60, ${(STYLE_COLORS[popupCard.style] || '#8ed8c8')}20)` }}>
              <div className="card-popup-emoji">{popupCard.emoji || '🎵'}</div>
              <div className="card-popup-title-overlay">{popupCard.title}</div>
            </div>
            <div className="card-popup-body">
              {/* Tags & meta */}
              <div className="card-popup-tags">
                <span className="card-popup-tag" style={{ background: (STYLE_COLORS[popupCard.style] || '#888') + '15', color: STYLE_COLORS[popupCard.style] || '#888' }}>{popupCard.style}</span>
                {popupCard.language && <span className="card-popup-tag">{popupCard.language}</span>}
                {popupCard.region && <span className="card-popup-tag">📍 {popupCard.region}</span>}
              </div>
              <div className="card-popup-meta">
                {popupCard.creator?.nickname && `${popupCard.creator.nickname} · `}
                ▶ {popupCard.play_count || 0}  ❤ {likeCount}  💬 {comments.length}
              </div>

              {/* Waveform */}
              <div className="card-popup-wave">
                {generateWaveform(50, popupCard.id).map((h, i) => (
                  <div key={i} className="card-popup-wave-bar" style={{ height: h, background: i < 20 ? 'var(--teal)' : 'rgba(0,0,0,.06)' }} />
                ))}
              </div>

              {/* Lyrics */}
              {popupCard.lyrics && (
                <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.6, marginTop: 8, maxHeight: 80, overflowY: 'auto', padding: '8px 10px', background: 'var(--s1)', borderRadius: 8 }}>{popupCard.lyrics}</div>
              )}

              {/* Action buttons */}
              <div className="card-popup-actions">
                <button className="gbtn" style={{ fontSize: 11, padding: '6px 14px' }}>▶ 播放</button>
                <button className={`ct${isLiked ? ' active' : ''}`} style={{ fontSize: 11, padding: '6px 14px', ...(isLiked ? { color: 'var(--red)', borderColor: 'var(--red)' } : {}) }} onClick={handleLike}>{isLiked ? '❤' : '🤍'} {likeCount}</button>
                <button className={`ct${isFaved ? ' active' : ''}`} style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setIsFaved(!isFaved); showToast(isFaved ? '已取消收藏' : '已收藏', 'success') }}>{isFaved ? '⭐' : '☆'} 收藏</button>
                <button className="ct" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { showToast('链接已复制', 'success') }}>🔗 分享</button>
              </div>

              {/* Comments section */}
              <div style={{ marginTop: 16, borderTop: '1px solid var(--gb)', paddingTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>💬 评论 ({comments.length})</div>
                <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 10 }}>
                  {comments.length === 0 && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', padding: '12px 0' }}>暂无评论，来说点什么吧</div>
                  )}
                  {comments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: (c.user?.avatar_color || '#888') + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                        {c.user?.nickname?.[0] || '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{c.user?.nickname || '匿名'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginTop: 2 }}>{c.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Comment input */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gb)', background: 'rgba(255,255,255,.5)', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder="写评论..."
                    onKeyDown={e => e.key === 'Enter' && handleComment()}
                  />
                  <button className="gbtn" style={{ fontSize: 11, padding: '6px 14px' }} onClick={handleComment} disabled={!commentInput.trim()}>发送</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create community flow */}
      {showCreate && <CreateCommunityFlow onClose={() => setShowCreate(false)} />}
    </div>
  )
}
