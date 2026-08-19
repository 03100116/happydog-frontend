import { useState, useEffect } from 'react'
import { STYLES, STYLE_COLORS, apiGetCards, apiGetStats } from '../api'
import CardDetail from '../components/CardDetail'

export default function Square() {
  const [cards, setCards] = useState([])
  const [styleFilter, setStyleFilter] = useState('')
  const [sort, setSort] = useState('newest')
  const [stats, setStats] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    loadCards()
    loadStats()
  }, [styleFilter, sort])

  const loadCards = async () => {
    const res = await apiGetCards({ style: styleFilter, sort })
    if (res.code === 0) setCards(res.data.list)
  }

  const loadStats = async () => {
    const res = await apiGetStats()
    if (res.code === 0) setStats(res.data)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-wrap">
        <div className="page-header">
          <h2>卡片广场</h2>
          <div className="mh-right">
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
        </div>

        {stats && (
          <div className="stats-bar">
            <div className="stat-item"><div className="stat-num">{stats.total_songs.toLocaleString()}</div><div className="stat-label">总作品</div></div>
            <div className="stat-item"><div className="stat-num">{stats.today_songs}</div><div className="stat-label">今日新增</div></div>
            <div className="stat-item"><div className="stat-num">{stats.total_plays.toLocaleString()}</div><div className="stat-label">总播放</div></div>
          </div>
        )}

        <div className="card-grid">
          {cards.map(card => (
            <div key={card.id} className="card" onClick={() => setSelectedCard(card.id)}>
              <div className="card-cover" style={{ background: `linear-gradient(135deg,${card.cover_color}25,${card.cover_color}08)` }}>
                {card.emoji}
              </div>
              <div className="card-body">
                <div className="card-title">{card.title}</div>
                <div className="card-creator">
                  <div className="card-creator-av" style={{ background: (card.creator?.avatar_color || '#888') + '25' }}>
                    {card.creator?.nickname?.[0]}
                  </div>
                  <span className="card-creator-name">{card.creator?.nickname}</span>
                </div>
                <div className="card-meta">
                  <span className="card-tag" style={{ background: (STYLE_COLORS[card.style] || '#888') + '15', color: STYLE_COLORS[card.style] || '#888' }}>{card.style}</span>
                  <span>▶ {card.play_count}</span>
                  <span>❤ {card.like_count}</span>
                  <span>💬 {card.comment_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="load-more">↓ 下拉加载更多</div>
      </div>

      {selectedCard && <CardDetail cardId={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  )
}
