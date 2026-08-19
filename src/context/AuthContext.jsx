import { createContext, useContext, useState, useCallback } from 'react'
import { apiLogin, apiRegister, apiGetMe, apiLogout } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const login = useCallback(async ({ username, password }) => {
    const res = await apiLogin({ username, password })
    if (res.code === 0) {
      setUser(res.data.user)
      setToken(res.data.access_token)
    }
    return res
  }, [])

  const register = useCallback(async ({ username, email, password, nickname }) => {
    const res = await apiRegister({ username, email, password, nickname })
    if (res.code === 0) {
      setUser(res.data.user)
      setToken(res.data.access_token)
    }
    return res
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
