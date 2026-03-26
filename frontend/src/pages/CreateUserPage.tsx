import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { createUserRequest } from '@/api/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type User } from '@/types'

interface CreateUserForm {
  name: string
  email: string
  password: string
  phone: string
  address: string
  role: User['role']
}

const initialForm: CreateUserForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  role: 'user',
}

export default function CreateUserPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<CreateUserForm>(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof CreateUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')

      await createUserRequest({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || null,
        address: form.address || null,
        role: form.role,
      })

      navigate('/users')
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message || 'No se pudo crear el usuario'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Crear Usuario</CardTitle>
          <CardDescription>Completa los datos para registrar un nuevo usuario.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 font-mono">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 font-mono">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 font-mono">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2 font-mono">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2 font-mono">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            <div className="space-y-2 font-mono">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-rose-500 bg-rose-100 p-2 font-mono">{error}</p>
            )}

            <div className="flex gap-2 *:font-mono">
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Creando...' : 'Crear usuario'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
