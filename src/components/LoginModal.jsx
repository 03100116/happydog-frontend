import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ mode: initMode, onClose, onSwitch }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState(initMode)
  const [form, setForm] = useState({ username: '', email: '', password: '', nickname: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  const validate = () => {
    if (isRegister) {
      if (!form.nickname.trim()) return '请输入昵称'
      if (!form.email.trim()) return '请输入邮箱'
      if (!form.email.includes('@')) return '请输入有效的邮箱地址'
    }
    if (!form.username.trim()) return '请输入用户名'
    if (!form.password) return '请输入密码'
    if (form.password.length < 8) return '密码长度不能少于 8 位'
    return ''
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      let res
      if (isRegister) {
        res = await register(form)
      } else {
        res = await login({ username: form.username, password: form.password })
      }
      if (res.code === 0) {
        onClose()
      } else {
        setError(res.message)
      }
    } catch (e) {
      setError(e?.message || '网络错误，请检查连接')
    }
    setLoading(false)
  }

  const switchMode = (m) => { setMode(m); setError('') }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="login-box">
        <h3>{isRegister ? '加入 HappyDog' : '登录 HappyDog'}</h3>
        {isRegister && (
          <>
            <div className="login-field">
              <label>昵称</label>
              <input value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} placeholder="你的昵称" />
            </div>
            <div className="login-field">
              <label>邮箱</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
          </>
        )}
        <div className="login-field">
          <label>用户名</label>
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="用户名或邮箱" />
        </div>
        <div className="login-field">
          <label>密码</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="密码（至少8位）" />
        </div>
        {error && <div style={{ color: 'var(--red)', fontSize: 11, marginBottom: 8 }}>{error}</div>}
        <button className="login-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? '...' : isRegister ? '注册' : '登录'}
        </button>
        <div className="login-switch">
          {isRegister ? (
            <>已有账号？<a onClick={() => switchMode('login')}>去登录</a></>
          ) : (
            <>还没有账号？<a onClick={() => switchMode('register')}>免费加入</a></>
          )}
        </div>
      </div>
    </div>
  )
}
