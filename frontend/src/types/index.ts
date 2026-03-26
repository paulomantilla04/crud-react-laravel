export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}