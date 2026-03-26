import { useState, type ReactNode } from 'react'
import { type AuthUser } from '@/types'
import { AuthContext } from './auth-context'


function getInitialToken(): string | null {
  return localStorage.getItem('token')
}

function getInitialUser(): AuthUser | null {
  const saved = localStorage.getItem('user')
  if (!saved) return null

  try {
    return JSON.parse(saved) as AuthUser
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser)
  const [token, setToken] = useState<string | null>(getInitialToken)

  const login = (user: AuthUser, token: string) => {
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}
