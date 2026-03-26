import api from './axios'
import { type AuthResponse, type LoginCredentials } from '@/types'

export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/login', credentials)
  return response.data
}

export async function logoutRequest(): Promise<void> {
  await api.post('/logout')
}