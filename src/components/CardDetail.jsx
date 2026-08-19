import { useState, useEffect } from 'react'
import { STYLE_COLORS, apiGetCardDetail, apiGetComments, apiLike, apiUnlike, apiFavorite, apiUnfavorite, apiPostComment, apiShare } from '../api'

export default function CardDetail({ cardId, onClose, onRemix }) {
  const [card, setCard] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(false)
  const [faved, setFaved] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCard()
  }, [cardId])

  const loadCard = async () => {
    setLoading(true)
    const res = await apiGetCardDetail(cardId)
    if (res.code === 0) setCard(res.data)
    const cRes = await apiGetComments(cardId)
    if (cRes.code === 0) setComments(cRes.data.list)
    setLoading(false)
  }

  const toggleLike = async () => {
    if (liked) { await apiUnlike(cardId) } else { await apiLike(cardId) }
    setLiked(!liked)
  }

  const toggleFav = async () => {
    if (faved) { await apiUnfavorite(cardId) } else { await apiFavorite(cardId) }
    setFaved(!faved)
  }

  const handleShare = async () => {
    const res = await apiShare(cardId)
    if (res.code === 0) alert('分享链接: ' + res.data.share_url)
  }

  const handleComment = async () => {
    if (!commentInput.trim()) return
    const res = await apiPostComment(cardId, commentInput)
    if (res.code === 0) {
      setComments(prev => [...prev, res.data])
      setCommentInput('')
    }
  }

  if (loading || !card) return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card-detail"><div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>加载中...</div></div>
    </div>
  )

  const color = card.cover_color || STYLE_COLORS[card.style] || '#e8446a'
  const waveBars = Array.from({ length: 60 }, (_, i) => ({
    height: Math.random() * 32 + 6,
    played: i < 24,
  }))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card-detail">
        <div className="cd-head">
          <div className="cd-cover" style={{ background: `linear-gradient(135deg,${color}40,${color}15)` }}>
            {card.emoji || '🎵'}
          </div>
          <div className="cd-info">
            <div className="cd-title">{card.title}</div>
            {card.creator && (
              <div className="cd-creator">
                <div className="cd-creator-av" style={{ background: (card.creator.avatar_color || '#888') + '25' }}>
                  {card.creator.nickname?.[0]}
                </div>
                <span>{card.creator.nickname}</span>
              </div>
            )}
            <div className="cd-tags">
              <span className="cd-tag" style={{ background: (STYLE_COLORS[card.style] || '#888') + '15', color: STYLE_COLORS[card.style] || '#888' }}>{card.style}</span>
              <span className="cd-tag" style={{ background: 'var(--s1)', color: 'var(--text2)' }}>{card.language}</span>
              {card.region && <span className="cd-tag" style={{ background: 'var(--s1)', color: 'var(--text2)' }}>📍 {card.region}</span>}
            </div>
          </div>
        </div>

        <div className="cd-stats">
          <div className="cd-stat"><div className="cd-stat-num">{card.play_count || 0}</div><div className="cd-stat-label">播放</div></div>
          <div className="cd-stat"><div className="cd-stat-num">{card.like_count || 0}</div><div className="cd-stat-label">点赞</div></div>
          <div className="cd-stat"><div className="cd-stat-num">{card.favorite_count || 0}</div><div className="cd-stat-label">收藏</div></div>
          <div className="cd-stat"><div className="cd-stat-num">{card.comment_count || comments.length}</div><div className="cd-stat-label">评论</div></div>
        </div>

        <div className="cd-wave">
          {waveBars.map((b, i) => (
            <div key={i} className={`wave-bar ${b.played ? 'played' : 'unplayed'}`} style={{ height: b.height }} />
          ))}
        </div>

        <div className="cd-actions">
          <button className="cd-act primary">▶ 播放</button>
          <button className={`cd-act${liked ? ' active' : ''}`} onClick={toggleLike}>❤️ {liked ? '已赞' : '点赞'}</button>
          <button className={`cd-act${faved ? ' active' : ''}`} onClick={toggleFav}>⭐ {faved ? '已藏' : '收藏'}</button>
          <button className="cd-act" onClick={() => setShowLyrics(!showLyrics)}>📋 歌词</button>
          <button className="cd-act" onClick={() => { onRemix?.(card); onClose() }}>🔀 Remix</button>
          <button className="cd-act" onClick={handleShare}>🔗 分享</button>
        </div>

        {showLyrics && card.lyrics && <div className="cd-lyrics">{card.lyrics}</div>}

        <div style={{ maxHeight: 150, overflowY: 'auto' }}>
          {comments.map(c => (
            <div key={c.id} className="cd-comment" style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--gb)' }}>
              <div className="cd-creator-av" style={{ background: (c.user.avatar_color || '#888') + '25', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {c.user.nickname[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{c.user.nickname}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{c.content}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>{c.created_at?.split('T')[0]}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="cd-comment-input" style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <input
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gb)', background: 'var(--s2)', color: 'var(--text)', fontSize: 11, outline: 'none', fontFamily: 'inherit' }}
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
            placeholder="写评论..."
          />
          <button onClick={handleComment} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,var(--orange),var(--red))', color: '#fff', fontSize: 11, fontWeight: 600 }}>发送</button>
        </div>
      </div>
    </div>
  )
}
