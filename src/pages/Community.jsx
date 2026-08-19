import { useState, useEffect } from 'react'
import { STYLES, STYLE_COLORS, apiGetCards, apiGetRooms, publishedCards } from '../api'
import CardDetail from '../components/CardDetail'
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
  const [selectedCard, setSelectedCard] = useState(null)

  // Rooms state
  const [rooms, setRooms] = useState([])

  // Create flow
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    if (subTab === 'square') {
      apiGetCards({ style: styleFilter, sort }).then(res => {
        if (res.code === 0) {
          // Merge published cards from Studio into the square feed
          const merged = [...publishedCards, ...res.data.list]
          setCards(merged)
        }
      })
    } else {
      apiGetRooms().then(res => { if (res.code === 0) setRooms(res.data) })
    }
  }, [subTab, styleFilter, sort])

  const statusColor = (p) => p === 100 ? '#22c55e' : p > 50 ? '#f0a030' : '#3b82f6'
  const avColors = ['#e8446a', '#ff6b35', '#8b5cf6', '#2dd4bf']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2>社群</h2>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>用钉钉组队写歌，AI 帮你们把素材变成完整歌曲</p>
          </div>
          <button className="gbtn" onClick={() => setShowCreate(true)}>＋ 创建新社群</button>
        </div>

        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {SUB_TABS.map(t => (
            <button key={t.key}
              className={`comm-tab${subTab === t.key ? ' active' : ''}`}
              onClick={() => setSubTab(t.key)}>
              {t.label}
            </button>
          ))}
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
              {cards.map(card => (
                <div key={card.id} className="big-card" onClick={() => setSelectedCard(card.id)}>
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
                      {Array.from({length: 40}, (_, i) => (
                        <div key={i} className="big-card-wave-bar" style={{ height: Math.random()*16+3, background: i < 16 ? 'var(--teal)' : 'rgba(0,0,0,.04)' }} />
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
            </div>

            <div className="load-more">↓ 下拉加载更多</div>
          </>
        )}

        {/* ── My Communities Tab ── */}
        {subTab === 'mine' && (
          <div className="room-grid">
            {rooms.map((r, i) => {
              const sc = statusColor(r.progress)
              return (
                <div key={i} className="room-card">
                  <div className="room-head">
                    <div className="room-cv" style={{ background: r.color + '20' }}>{r.emoji}</div>
                    <div>
                      <div className="room-name">{r.name}</div>
                      <div className="room-desc">{r.style}</div>
                    </div>
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
                    <span className="room-status" style={{ background: sc + '15', color: sc }}>{r.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Card detail modal */}
      {selectedCard && <CardDetail cardId={selectedCard} onClose={() => setSelectedCard(null)} />}

      {/* Create community flow */}
      {showCreate && <CreateCommunityFlow onClose={() => setShowCreate(false)} />}
    </div>
  )
}
