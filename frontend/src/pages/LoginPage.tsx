import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useAuth } from '@/context/useAuth'
import { loginRequest } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { motion, type Variants } from 'motion/react'

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible:  {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function LoginPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginRequest({ email, password })
      login(data.user, data.token)
      navigate('/users')
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message || 'Error al iniciar sesión'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-[#FFFFFF]"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <motion.div variants={fadeUp}>
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            </motion.div>
            <motion.div variants={fadeUp}>
              <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={fadeUp} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              {error && (
                <motion.p
                  className="text-sm text-rose-500 text-center bg-rose-100 p-2 font-mono"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={fadeUp}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Entrar'}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}