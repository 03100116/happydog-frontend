// Mock API layer aligned with Mozart Phase 1 API spec
// In production, replace with real fetch calls to https://api.mozart.example.com/api/v1

// ═══ ENUMS ═══
export const STYLES = ['民谣','流行','说唱','R&B','古风','摇滚','电子','爵士','Lo-fi']
export const LANGUAGES = ['中文','粤语','英语','日语','韩语']
export const VOICE_TYPES = ['女声','男声','合唱','纯音乐']
export const DURATIONS = [30, 60, 90, 180]
export const SORT_OPTIONS = [
  { value: 'newest', label: '最新发布' },
  { value: 'hot', label: '最热' },
  { value: 'editor_pick', label: '编辑推荐' },
]

export const STYLE_COLORS = {
  '民谣':'#22c55e','流行':'#3b82f6','说唱':'#ff6b35','R&B':'#8b5cf6',
  '古风':'#e8446a','摇滚':'#ef4444','电子':'#2dd4bf','爵士':'#f0a030','Lo-fi':'#a78bfa'
}

export const STATUS_MAP = {
  0: { label: '草稿', color: '#f0a030', bg: 'rgba(240,160,48,.1)' },
  1: { label: '已发布', color: '#22c55e', bg: 'rgba(34,197,94,.1)' },
  2: { label: '生成中', color: '#3b82f6', bg: 'rgba(59,130,246,.1)' },
  3: { label: '失败', color: '#ef4444', bg: 'rgba(239,68,68,.1)' },
  4: { label: '已删除', color: '#666', bg: 'rgba(100,100,100,.1)' },
}

export const SOURCE_MAP = { text: '文生', image: '图生', locate: '定位', remix: 'Remix' }

// ═══ HELPERS ═══
const delay = (ms) => new Promise(r => setTimeout(r, ms))
const uid = () => Math.random().toString(36).slice(2, 10)

// Standard response wrapper
const ok = (data) => ({ code: 0, message: 'ok', data, request_id: uid() })
const err = (code, message) => ({ code, message, data: null, request_id: uid() })

// ═══ MOCK DATA ═══
let currentUser = null
let token = null

const mockCards = [
  { id:'s_001', title:'Midnight Rain', style:'R&B', language:'英语', region:'上海', cover_color:'#8b5cf6', emoji:'🌧️', creator:{id:'u1',nickname:'Luna',avatar_color:'#8b5cf6'}, play_count:328, like_count:45, comment_count:8, lyrics:'Rain falls down on midnight streets...', created_at:'2026-08-19T10:00:00Z' },
  { id:'s_002', title:'火锅英雄', style:'说唱', language:'中文', region:'成都', cover_color:'#ff6b35', emoji:'🌶️', creator:{id:'u2',nickname:'MC川',avatar_color:'#ff6b35'}, play_count:892, like_count:128, comment_count:23, lyrics:'火锅煮沸了整个城市的味道...', created_at:'2026-08-19T09:30:00Z' },
  { id:'s_003', title:'Neon Dreams', style:'电子', language:'英语', region:'深圳', cover_color:'#2dd4bf', emoji:'🌃', creator:{id:'u3',nickname:'Synth',avatar_color:'#2dd4bf'}, play_count:456, like_count:67, comment_count:12, lyrics:'Neon lights paint the sky...', created_at:'2026-08-19T08:00:00Z' },
  { id:'s_004', title:'弄堂记忆', style:'古风', language:'中文', region:'上海', cover_color:'#e8446a', emoji:'🏮', creator:{id:'u4',nickname:'清音',avatar_color:'#e8446a'}, play_count:672, like_count:98, comment_count:18, lyrics:'青石板路上的脚步声...', created_at:'2026-08-18T15:00:00Z' },
  { id:'s_005', title:'Sunset Drive', style:'Lo-fi', language:'英语', region:'杭州', cover_color:'#f0a030', emoji:'🌅', creator:{id:'u5',nickname:'Chill',avatar_color:'#f0a030'}, play_count:234, like_count:38, comment_count:5, lyrics:'', created_at:'2026-08-18T12:00:00Z' },
  { id:'s_006', title:'巴适得板', style:'说唱', language:'中文', region:'重庆', cover_color:'#e8446a', emoji:'☕', creator:{id:'u6',nickname:'蜀说',avatar_color:'#e8446a'}, play_count:1024, like_count:186, comment_count:34, lyrics:'巴适得板，安逸得很...', created_at:'2026-08-18T10:00:00Z' },
  { id:'s_007', title:'Ocean Breeze', style:'民谣', language:'英语', region:'厦门', cover_color:'#3b82f6', emoji:'🌊', creator:{id:'u7',nickname:'Wave',avatar_color:'#3b82f6'}, play_count:189, like_count:29, comment_count:3, lyrics:'', created_at:'2026-08-17T20:00:00Z' },
  { id:'s_008', title:'厝边头尾', style:'流行', language:'粤语', region:'广州', cover_color:'#06b6d4', emoji:'🏠', creator:{id:'u8',nickname:'南风',avatar_color:'#06b6d4'}, play_count:567, like_count:82, comment_count:15, lyrics:'厝边头尾都知...', created_at:'2026-08-17T16:00:00Z' },
  { id:'s_009', title:'Starlight', style:'R&B', language:'英语', region:'北京', cover_color:'#a78bfa', emoji:'✨', creator:{id:'u9',nickname:'Nova',avatar_color:'#a78bfa'}, play_count:345, like_count:52, comment_count:9, lyrics:'', created_at:'2026-08-17T12:00:00Z' },
  { id:'s_010', title:'岳麓山下', style:'民谣', language:'中文', region:'长沙', cover_color:'#22c55e', emoji:'🍂', creator:{id:'u10',nickname:'湘音',avatar_color:'#22c55e'}, play_count:412, like_count:61, comment_count:11, lyrics:'岳麓山下的枫叶红了...', created_at:'2026-08-17T09:00:00Z' },
  { id:'s_011', title:'City Lights', style:'电子', language:'英语', region:'深圳', cover_color:'#f59e0b', emoji:'🏙️', creator:{id:'u11',nickname:'Pulse',avatar_color:'#f59e0b'}, play_count:278, like_count:41, comment_count:6, lyrics:'', created_at:'2026-08-16T18:00:00Z' },
  { id:'s_012', title:'冰城故事', style:'流行', language:'中文', region:'哈尔滨', cover_color:'#a78bfa', emoji:'❄️', creator:{id:'u12',nickname:'北音',avatar_color:'#a78bfa'}, play_count:156, like_count:22, comment_count:4, lyrics:'冰雪覆盖的城市里...', created_at:'2026-08-16T14:00:00Z' },
]

const mockMySongs = [
  { id:'s_m01', title:'异乡人·民谣版', style:'民谣', language:'中文', voice_type:'女声', duration:90, source:'text', status:1, is_public:true, play_count:42, like_count:8, cover_url:'', audio_url:'', description:'一首关于异乡打拼的民谣', lyrics:'异乡的月光照着窗台...', created_at:'2026-08-19T12:00:00Z' },
  { id:'s_m02', title:'夏夜的海边', style:'流行', language:'中文', voice_type:'女声', duration:60, source:'text', status:0, is_public:false, play_count:0, like_count:0, cover_url:'', audio_url:'', description:'', lyrics:'', created_at:'2026-08-19T10:00:00Z' },
  { id:'s_m03', title:'赛博朋克之夜', style:'电子', language:'英语', voice_type:'纯音乐', duration:180, source:'image', status:2, is_public:false, play_count:0, like_count:0, cover_url:'', audio_url:'', description:'', lyrics:'', created_at:'2026-08-18T20:00:00Z' },
  { id:'s_m04', title:'成都成都', style:'说唱', language:'中文', voice_type:'男声', duration:90, source:'locate', status:3, is_public:false, play_count:0, like_count:0, cover_url:'', audio_url:'', description:'', lyrics:'', created_at:'2026-08-18T15:00:00Z' },
]

const mockComments = [
  { id:'c1', user:{id:'u20',nickname:'听众A',avatar_color:'#e8446a'}, content:'太好听了！', created_at:'2026-08-19T12:30:00Z' },
  { id:'c2', user:{id:'u21',nickname:'Beat Maker',avatar_color:'#8b5cf6'}, content:'这个beat很强', created_at:'2026-08-19T13:00:00Z' },
  { id:'c3', user:{id:'u22',nickname:'路过的风',avatar_color:'#22c55e'}, content:'循环播放中...', created_at:'2026-08-19T14:00:00Z' },
]

const mockRooms = [
  { name:'Midnight Groove', style:'R&B', progress:75, members:['🎤','🎸','🎧'], status:'编曲中', color:'#8b5cf6', emoji:'🌙' },
  { name:'火锅英雄', style:'说唱', progress:40, members:['🎤','🎸'], status:'作词中', color:'#ff6b35', emoji:'🌶️' },
  { name:'弄堂记忆', style:'古风', progress:100, members:['🎤','🎸','🎧','🎹'], status:'已完成', color:'#e8446a', emoji:'🏮' },
  { name:'Neon Dreams', style:'电子', progress:20, members:['🎤'], status:'招募中', color:'#2dd4bf', emoji:'🌃' },
  { name:'岳麓山下', style:'民谣', progress:60, members:['🎤','🎸','🎹'], status:'录音中', color:'#22c55e', emoji:'🍂' },
]

// Published cards (populated by apiPublishToSquare)
export let publishedCards = []

// ═══ API FUNCTIONS ═══

// Auth
export async function apiRegister({ username, email, password, nickname }) {
  await delay(500)
  const user = { id: 'u_' + uid(), username, nickname: nickname || username, avatar_url: '', bio: '' }
  currentUser = user
  token = 'mock_token_' + uid()
  return ok({ user, access_token: token, refresh_token: 'mock_refresh_' + uid(), expires_in: 7200 })
}

export async function apiLogin({ username, password }) {
  await delay(500)
  const user = { id: 'u_' + uid(), username, nickname: username, avatar_url: '', bio: '' }
  currentUser = user
  token = 'mock_token_' + uid()
  return ok({ user, access_token: token, refresh_token: 'mock_refresh_' + uid(), expires_in: 7200 })
}

export async function apiGetMe() {
  if (!currentUser) return err(1005, '未登录')
  return ok({ ...currentUser, email: 'user@example.com', follower_count: 10, following_count: 5, song_count: mockMySongs.length })
}

// Styles
export async function apiGetStyles() {
  return ok({ styles: STYLES, languages: LANGUAGES, voice_types: VOICE_TYPES, durations: DURATIONS })
}

// Studio - Generate
export async function apiGenerate({ description, style, language, voice_type, duration }) {
  await delay(300)
  const taskId = 't_' + uid()
  const songId = 's_' + uid()
  return ok({ task_id: taskId, task_type: 'music', status: 'PENDING', song_id: songId, created_at: new Date().toISOString() })
}

// Studio - Lyrics
export async function apiLyrics({ prompt, style, language }) {
  await delay(300)
  return ok({ task_id: 't_' + uid(), task_type: 'lyrics', status: 'PENDING' })
}

// Studio - Image analyze
export async function apiImageAnalyze({ image_url }) {
  await delay(300)
  return ok({ task_id: 't_' + uid(), task_type: 'image_analyze', status: 'PENDING' })
}

// Studio - Image music
export async function apiImageMusic({ image_url, description, mode, style, language, voice_type, duration }) {
  await delay(300)
  return ok({ task_id: 't_' + uid(), task_type: 'image_music', status: 'PENDING', song_id: 's_' + uid() })
}

// Studio - Locate
export async function apiLocate({ lat, lon }) {
  await delay(400)
  return ok({ city: '成都', region: '西南地区', country: '中国', recommended_styles: ['说唱', '民谣'], recommended_language: '中文' })
}

// Studio - Locate generate
export async function apiLocateGenerate({ city, style, description, language, voice_type, duration }) {
  await delay(300)
  return ok({ task_id: 't_' + uid(), task_type: 'locate_music', status: 'PENDING', song_id: 's_' + uid() })
}

// Task status (simulated progression)
export async function apiGetTask(taskId) {
  // Returns progressively changing status
  return ok({
    task_id: taskId,
    task_type: 'music',
    status: 'RUNNING',
    progress: 50,
    input: {},
    output: null,
    created_at: new Date().toISOString(),
    started_at: new Date().toISOString(),
    finished_at: null,
  })
}

// Studio - My songs
export async function apiGetMySongs({ status, source, page = 1, page_size = 20 } = {}) {
  let list = [...mockMySongs]
  if (status !== undefined && status !== null && status !== 'all') list = list.filter(s => s.status === Number(status))
  if (source) list = list.filter(s => s.source === source)
  return ok({ total: list.length, page, page_size, list })
}

// Studio - Publish
export async function apiPublish(songId) {
  await delay(300)
  const song = mockMySongs.find(s => s.id === songId)
  if (song) { song.status = 1; song.is_public = true }
  return ok({ id: songId, is_public: true, status: 1 })
}

// Studio - Remix
export async function apiRemix(songId, { description, style, duration } = {}) {
  await delay(300)
  return ok({ task_id: 't_' + uid(), task_type: 'music', status: 'PENDING', song_id: 's_' + uid(), remix_from: songId })
}

// Square
export async function apiGetCards({ style, language, sort = 'newest', cursor, page_size = 20 } = {}) {
  let list = [...mockCards]
  if (style) list = list.filter(c => c.style === style)
  if (language) list = list.filter(c => c.language === language)
  if (sort === 'hot') list.sort((a, b) => b.play_count - a.play_count)
  return ok({ next_cursor: null, has_more: false, list })
}

export async function apiGetCardDetail(id) {
  const card = mockCards.find(c => c.id === id) || mockMySongs.find(s => s.id === id)
  if (!card) return err(3001, '歌曲不存在')
  return ok({ ...card, favorite_count: Math.floor((card.like_count || 0) / 3), share_count: 5, is_liked: false, is_favorited: false })
}

export async function apiGetComments(cardId, { page = 1 } = {}) {
  return ok({ total: mockComments.length, page, page_size: 20, list: mockComments })
}

export async function apiPostComment(cardId, content) {
  await delay(200)
  const c = { id: 'c_' + uid(), user: currentUser || { id: 'u_anon', nickname: '匿名', avatar_color: '#888' }, content, created_at: new Date().toISOString() }
  mockComments.push(c)
  return ok(c)
}

export async function apiLike(cardId) { await delay(200); return ok({ liked: true, like_count: 33 }) }
export async function apiUnlike(cardId) { await delay(200); return ok({ liked: false, like_count: 32 }) }
export async function apiFavorite(cardId) { await delay(200); return ok({ favorited: true, favorite_count: 11 }) }
export async function apiUnfavorite(cardId) { await delay(200); return ok({ favorited: false, favorite_count: 10 }) }
export async function apiPlay(cardId) { await delay(100); return ok({ play_count: 129 }) }
export async function apiShare(cardId) { return ok({ share_url: `https://happydog.example.com/s/${cardId}`, share_code: uid().slice(0, 6) }) }

// Publish to square (community feed)
export async function apiPublishToSquare(songData) {
  await delay(200)
  const card = {
    id: 'pub_' + uid(),
    title: songData.title || 'Untitled',
    style: songData.style || '流行',
    language: songData.language || '中文',
    region: songData.region || '',
    cover_color: songData.cover_color || '#3b82f6',
    emoji: songData.emoji || '🎵',
    creator: currentUser || { id: 'u_anon', nickname: '匿名', avatar_color: '#888' },
    play_count: 0,
    like_count: 0,
    comment_count: 0,
    lyrics: songData.lyrics || '',
    created_at: new Date().toISOString(),
    ...songData,
  }
  publishedCards.push(card)
  mockCards.unshift(card)
  return ok(card)
}

// Square stats
export async function apiGetStats() {
  return ok({ total_songs: 1280, today_songs: 32, total_plays: 56000, style_stats: STYLES.map(s => ({ style: s, count: Math.floor(Math.random() * 200 + 50) })), hot_songs: [] })
}

// Search
export async function apiSearch({ q, type = 'all', page = 1 } = {}) {
  const songs = mockCards.filter(c => c.title.includes(q) || c.style.includes(q) || c.creator.nickname.includes(q))
  return ok({ songs: { total: songs.length, list: songs }, users: { total: 0, list: [] } })
}

// Community rooms (mock, not in API spec yet)
export async function apiGetRooms() {
  return ok(mockRooms)
}
