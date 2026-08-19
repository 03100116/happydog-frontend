import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { apiLogin, apiRegister, apiGetMe, apiLogout } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to restore user from localStorage on first render
    try {
      const saved = localStorage.getItem('happydog_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('happydog_token') || null)
  const [initialized, setInitialized] = useState(false)

  // On mount, if we have a token, verify it with the backend
  useEffect(() => {
    if (!token) {
      setInitialized(true)
      return
    }
    apiGetMe().then(res => {
      if (res.code === 0 && res.data) {
        setUser(res.data)
        localStorage.setItem('happydog_user', JSON.stringify(res.data))
      } else {
        // Token invalid or expired
        apiLogout()
        setUser(null)
        setToken(null)
        localStorage.removeItem('happydog_user')
      }
      setInitialized(true)
    }).catch(() => {
      // Network error — keep local state, don't force logout
      setInitialized(true)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async ({ username, password }) => {
    const res = await apiLogin({ username, password })
    if (res.code === 0) {
      setUser(res.data.user)
      setToken(res.data.access_token)
      localStorage.setItem('happydog_user', JSON.stringify(res.data.user))
    }
    return res
  }, [])

  const register = useCallback(async ({ username, email, password, nickname }) => {
    const res = await apiRegister({ username, email, password, nickname })
    if (res.code === 0) {
      setUser(res.data.user)
      setToken(res.data.access_token)
      localStorage.setItem('happydog_user', JSON.stringify(res.data.user))
    }
    return res
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
    setToken(null)
    localStorage.removeItem('happydog_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoggedIn: !!user, initialized }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
