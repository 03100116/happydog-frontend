// ═══ Real API layer — connected to backend at http://112.124.55.50:8001 ═══
// All mock data removed. Every function makes real HTTP calls.
// To switch back to mock, replace this file with the original api/index.js

// In dev: Vite proxy forwards /api → http://112.124.55.50:8001/api
// In prod: set VITE_API_BASE env var or default to direct URL
const BASE = (import.meta.env?.VITE_API_BASE || '') + '/api/v1'

// ═══ ENUMS (keep for UI) ═══
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

// ═══ TOKEN HELPERS ═══
let _token = localStorage.getItem('happydog_token') || null

function getToken() { return _token }

function setToken(t) {
  _token = t
  if (t) localStorage.setItem('happydog_token', t)
  else localStorage.removeItem('happydog_token')
}

export function apiLogout() {
  setToken(null)
}

function authHeaders() {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// ═══ FETCH WRAPPER ═══
async function request(method, path, { body, query, headers = {} } = {}) {
  let url = BASE + path
  if (query) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') params.set(k, v)
    }
    const qs = params.toString()
    if (qs) url += '?' + qs
  }
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...headers },
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  // Try to parse JSON regardless of HTTP status
  let json
  try {
    json = await res.json()
  } catch {
    // Backend returned non-JSON (e.g. 500 HTML page)
    if (!res.ok) {
      return { code: res.status, message: `服务器错误 (${res.status})`, data: null, request_id: '' }
    }
    return { code: 1, message: '响应格式错误', data: null, request_id: '' }
  }
  // If HTTP status is not OK but we got JSON, ensure code reflects it
  if (!res.ok && json.code === undefined) {
    json.code = res.status
    json.message = json.message || json.detail || `服务器错误 (${res.status})`
  }
  return json
}

// ═══ PUBLISHED CARDS (local only — tracks what user published this session) ═══
export let publishedCards = []

// ═══ AUTH ═══
export async function apiRegister({ username, email, password, nickname }) {
  const res = await request('POST', '/auth/register', { body: { username, email, password, nickname } })
  if (res.code === 0 && res.data?.access_token) setToken(res.data.access_token)
  return res
}

export async function apiLogin({ username, password }) {
  const res = await request('POST', '/auth/login', { body: { username, password } })
  if (res.code === 0 && res.data?.access_token) setToken(res.data.access_token)
  return res
}

export async function apiGetMe() {
  return request('GET', '/auth/me')
}

// ═══ STYLES ═══
export async function apiGetStyles() {
  // Backend doesn't have a styles endpoint; return static enums
  return { code: 0, message: 'ok', data: { styles: STYLES, languages: LANGUAGES, voice_types: VOICE_TYPES, durations: DURATIONS } }
}

// ═══ STUDIO — Generate ═══
export async function apiGenerate({ description, style, language, voice_type, duration, lyrics }) {
  return request('POST', '/studio/generate', {
    body: { description, style: style || '流行', language: language || '中文', voice_type: voice_type || '女声', duration: duration || 90, lyrics }
  })
}

// ═══ STUDIO — Lyrics ═══
export async function apiLyrics({ prompt, style, language }) {
  return request('POST', '/studio/lyrics', { body: { prompt, style, language } })
}

// ═══ STUDIO — Image analyze ═══
export async function apiImageAnalyze({ image_url }) {
  return request('POST', '/studio/image/analyze', { body: { image_url } })
}

// ═══ STUDIO — Image music ═══
export async function apiImageMusic({ image_url, description, mode, style, language, voice_type, duration }) {
  return request('POST', '/studio/image/music', { body: { image_url, description, mode, style, language, voice_type, duration } })
}

// ═══ STUDIO — Locate ═══
export async function apiLocate({ lat, lon }) {
  return request('POST', '/studio/locate', { body: { lat, lon } })
}

// ═══ STUDIO — Locate generate ═══
export async function apiLocateGenerate({ city, style, description, language, voice_type, duration }) {
  return request('POST', '/studio/locate/generate', { body: { city, style, description, language, voice_type, duration } })
}

// ═══ TASK STATUS ═══
export async function apiGetTask(taskId) {
  return request('GET', `/tasks/${taskId}`)
}

export async function apiCancelTask(taskId) {
  return request('POST', `/tasks/${taskId}/cancel`)
}

// ═══ MY SONGS ═══
export async function apiGetMySongs({ status, source, page = 1, page_size = 20 } = {}) {
  return request('GET', '/studio/songs', { query: { status, source, page, page_size } })
}

// ═══ PUBLISH ═══
export async function apiPublish(songId) {
  return request('POST', `/studio/songs/${songId}/publish`)
}

// ═══ REMIX ═══
export async function apiRemix(songId, { description, style, duration } = {}) {
  return request('POST', `/studio/songs/${songId}/remix`, { body: { description, style, duration } })
}

// ═══ SQUARE — Cards ═══
export async function apiGetCards({ style, language, region, sort = 'newest', cursor, page_size = 20 } = {}) {
  return request('GET', '/square/cards', { query: { style, language, region, sort, cursor, page_size } })
}

export async function apiGetCardDetail(id) {
  return request('GET', `/square/cards/${id}`)
}

// ═══ SQUARE — Comments ═══
export async function apiGetComments(cardId, { page = 1, page_size = 20 } = {}) {
  return request('GET', `/square/cards/${cardId}/comments`, { query: { page, page_size } })
}

export async function apiPostComment(cardId, content) {
  return request('POST', `/square/cards/${cardId}/comments`, { body: { content } })
}

export async function apiDeleteComment(commentId) {
  return request('DELETE', `/square/comments/${commentId}`)
}

// ═══ SQUARE — Like / Unlike ═══
export async function apiLike(cardId) {
  return request('POST', `/square/cards/${cardId}/like`)
}

export async function apiUnlike(cardId) {
  return request('DELETE', `/square/cards/${cardId}/like`)
}

// ═══ SQUARE — Favorite / Unfavorite ═══
export async function apiFavorite(cardId) {
  return request('POST', `/square/cards/${cardId}/favorite`)
}

export async function apiUnfavorite(cardId) {
  return request('DELETE', `/square/cards/${cardId}/favorite`)
}

// ═══ SQUARE — Play / Share ═══
export async function apiPlay(cardId) {
  return request('POST', `/square/cards/${cardId}/play`)
}

export async function apiShare(cardId) {
  return request('POST', `/square/cards/${cardId}/share`)
}

// ═══ Publish to square (local bridge) ═══
export async function apiPublishToSquare(songData) {
  // This is a local helper — publishing is done via apiPublish(songId)
  // We keep this for Studio.jsx compatibility
  const card = {
    id: songData.id || 'pub_' + Math.random().toString(36).slice(2, 10),
    title: songData.title || 'Untitled',
    style: songData.style || '流行',
    language: songData.language || '中文',
    region: songData.region || '',
    cover_url: songData.cover_url || '',
    emoji: songData.emoji || '🎵',
    creator: songData.creator || { id: 'u_anon', nickname: '匿名', avatar_color: '#888' },
    play_count: 0,
    like_count: 0,
    comment_count: 0,
    lyrics: songData.lyrics || '',
    created_at: new Date().toISOString(),
  }
  publishedCards.push(card)
  return { code: 0, message: 'ok', data: card, request_id: '' }
}

// ═══ SQUARE — Stats ═══
export async function apiGetStats() {
  return request('GET', '/square/stats')
}

// ═══ SEARCH (server-side not available, filter client-side) ═══
export async function apiSearch({ q, type = 'all', page = 1 } = {}) {
  // No dedicated search endpoint; get all cards and filter
  const res = await apiGetCards({ page_size: 100 })
  if (res.code !== 0) return res
  const songs = res.data.list.filter(c =>
    c.title?.includes(q) || c.style?.includes(q) || c.creator?.nickname?.includes(q)
  )
  return { code: 0, message: 'ok', data: { songs: { total: songs.length, list: songs }, users: { total: 0, list: [] } } }
}

// ═══ COMMUNITY ROOMS (no backend endpoint yet, return empty) ═══
export async function apiGetRooms() {
  return { code: 0, message: 'ok', data: [] }
}
