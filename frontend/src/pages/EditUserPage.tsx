import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import { getUserRequest, updateUserRequest } from '@/api/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type User } from '@/types'

interface EditUserForm {
  name: string
  email: string
  phone: string
  address: string
  role: User['role']
  password: string
}

const initialForm: EditUserForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  role: 'user',
  password: '',
}

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = useState<EditUserForm>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const userId = Number(id)
    if (!userId) {
      setError('ID de usuario inválido')
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        setLoading(true)
        const user = await getUserRequest(userId)
        setForm({
          name: user.name,
          email: user.email,
          phone: user.phone ?? '',
          address: user.address ?? '',
          role: user.role,
          password: '',
        })
      } catch {
        setError('No se pudo cargar el usuario')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleChange = (field: keyof EditUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = Number(id)
    if (!userId) {
      setError('ID de usuario inválido')
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload: Partial<User & { password: string }> = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        address: form.address || null,
        role: form.role,
      }

      if (form.password.trim()) {
        payload.password = form.password.trim()
      }

      await updateUserRequest(userId, payload)
      navigate('/users')
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message || 'No se pudo guardar el usuario'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Usuario</CardTitle>
          <CardDescription>Actualiza los datos y guarda los cambios.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Cargando usuario...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña (opcional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-rose-500 bg-rose-100 p-2 font-mono">{error}</p>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
