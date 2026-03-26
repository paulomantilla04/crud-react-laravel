import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { createUserRequest } from '@/api/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type User } from '@/types'
import { motion, type Variants } from 'motion/react'

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

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
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
    <motion.div
      className="p-8 max-w-3xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <motion.div variants={fadeUp}>
              <CardTitle className="text-2xl font-bold">Crear Usuario</CardTitle>
            </motion.div>
            <motion.div variants={fadeUp}>
              <CardDescription>Completa los datos para registrar un nuevo usuario.</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form onSubmit={handleSubmit} className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">

              <motion.div variants={fadeUp} className="space-y-2 font-mono">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-2 font-mono">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-2 font-mono">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  minLength={8}
                />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-2 font-mono">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-2 font-mono">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-2 font-mono">
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
              </motion.div>

              {error && (
                <motion.p
                  className="text-sm text-rose-500 bg-rose-100 p-2 font-mono"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={fadeUp} className="flex gap-2 *:font-mono">
                <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Creando...' : 'Crear usuario'}
                </Button>
              </motion.div>

            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}