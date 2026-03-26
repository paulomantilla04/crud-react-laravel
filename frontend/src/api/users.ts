import api from './axios'
import { type User } from '@/types'

export async function getUsersRequest(): Promise<User[]> {
  const response = await api.get<User[]>('/users')
  return response.data
}

export async function getUserRequest(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}`)
  return response.data
}

export async function createUserRequest(data: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<User> {
  const response = await api.post<User>('/users', data)
  return response.data
}

export async function updateUserRequest(id: number, data: Partial<User & { password: string }>): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, data)
  return response.data
}

export async function deleteUserRequest(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}