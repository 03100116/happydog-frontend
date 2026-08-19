import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../utils'

const MBTI_OPTIONS = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ']
const ZODIAC_OPTIONS = ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼']
const GENDER_OPTIONS = ['男','女','其他']

const STORAGE_KEY = 'happydog_profile'

const DEFAULTS = {
  nickname: '',
  mbti: '',
  zodiac: '',
  gender: '',
  birthday: '',
  bio: '',
  avatar: '',
}

export default function ProfileModal({ onClose }) {
  const { logout } = useAuth()
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
    } catch {
      return DEFAULTS
    }
  })
  const [saved, setSaved] = useState(false)

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    setSaved(true)
    showToast('资料已保存', 'success')
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="profile-box">
        <div className="profile-hd">
          <div className="profile-tt">编辑资料</div>
          <button className="profile-close" onClick={onClose}>✕</button>
        </div>

        {/* Avatar */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-preview" onClick={() => document.getElementById('avatar-input')?.click()}>
            {form.avatar ? (
              <img src={form.avatar} alt="avatar" className="profile-avatar-img" />
            ) : (
              <span className="profile-avatar-placeholder">📷</span>
            )}
            <div className="profile-avatar-overlay">更换</div>
          </div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (ev) => update('avatar', ev.target.result)
                reader.readAsDataURL(file)
              }
            }}
          />
          <div className="profile-avatar-hint">点击更换头像</div>
        </div>

        {/* 昵称 */}
        <div className="profile-field">
          <label>昵称</label>
          <input
            value={form.nickname}
            onChange={e => update('nickname', e.target.value)}
            placeholder="你的昵称"
          />
        </div>

        {/* MBTI + 星座 */}
        <div className="profile-row">
          <div className="profile-field">
            <label>MBTI</label>
            <select value={form.mbti} onChange={e => update('mbti', e.target.value)}>
              <option value="">请选择</option>
              {MBTI_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="profile-field">
            <label>星座</label>
            <select value={form.zodiac} onChange={e => update('zodiac', e.target.value)}>
              <option value="">请选择</option>
              {ZODIAC_OPTIONS.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>

        {/* 性别 + 生日 */}
        <div className="profile-row">
          <div className="profile-field">
            <label>性别</label>
            <select value={form.gender} onChange={e => update('gender', e.target.value)}>
              <option value="">请选择</option>
              {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="profile-field">
            <label>生日</label>
            <input
              type="date"
              value={form.birthday}
              onChange={e => update('birthday', e.target.value)}
            />
          </div>
        </div>

        {/* 简介 */}
        <div className="profile-field">
          <label>简介</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={e => update('bio', e.target.value)}
            placeholder="介绍一下自己..."
          />
        </div>

        <button className="profile-save" onClick={handleSave}>
          {saved ? '已保存 ✓' : '保存'}
        </button>

        <button onClick={() => { logout(); onClose(); showToast('已退出登录', 'success') }} style={{
          width: '100%', padding: 10, marginTop: 10, borderRadius: 'var(--r)',
          border: '1px solid var(--gb)', background: 'transparent',
          color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          transition: 'all .15s'
        }}>退出登录</button>
      </div>
    </div>
  )
}
