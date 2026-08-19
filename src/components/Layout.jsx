import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AIAssistant from './AIAssistant'
import LoginModal from './LoginModal'
import ProfileModal from './ProfileModal'

const NAV_ITEMS = [
  { to: '/', icon: '🎵', label: '创作' },
  { to: '/community', icon: '👥', label: '社群' },
  { to: '/my', icon: '📁', label: '我的' },
  { to: '/podcast', icon: '🎙️', label: 'AI播客' },
]

export default function Layout({ children }) {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [loginMode, setLoginMode] = useState('login')
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="shell">
      {/* Floating dog decorations */}
      <div className="dog-deco">🐕</div>
      <div className="dog-deco">🐾</div>
      <div className="dog-deco">🦴</div>
      <div className="dog-deco">🐶</div>
      <div className="dog-deco">🎵</div>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <span style={{ fontSize: 20 }}>🐕</span>
          <span className="nav-logo-text">HappyDog🎼</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="nav-r">
          <button className="nav-plus-btn" onClick={() => navigate('/pricing')} title="定价方案">Plus</button>
          {!isLoggedIn ? (
            <button className="nav-btn primary" onClick={() => { setLoginMode('register'); setShowLogin(true) }}>免费加入</button>
          ) : (
            <div
              className="nav-av"
              title={user?.nickname || user?.username}
              onClick={() => setShowProfile(true)}
            >
              {(user?.nickname || user?.username || '?')[0]}
            </div>
          )}
        </div>
      </nav>

      {/* RAIL */}
      <div className="rail">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `rb${isActive ? ' active' : ''}`}>
            <span className="rb-icon">{item.icon}</span>
            <span className="rb-label">{item.label}</span>
          </NavLink>
        ))}
        <div className="rail-spacer" />
      </div>

      {/* CANVAS */}
      <div className="cv">
        {children}
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Login Modal */}
      {showLogin && <LoginModal mode={loginMode} onClose={() => setShowLogin(false)} onSwitch={(m) => setLoginMode(m)} />}

      {/* Profile Modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  )
}
