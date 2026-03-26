import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import { logoutRequest } from '@/api/auth'
import { getUsersRequest, deleteUserRequest } from '@/api/users'
import { type User } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RiPencilFill, RiUserAddFill, RiLogoutBoxFill } from '@remixicon/react'
import { DialogDelete } from '@/components/dialog-delete';
import { motion, type Variants } from 'motion/react';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible:  {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

const fadeRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}


export default function UsersPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsersRequest()
      setUsers(data)
    } catch {
      setError('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutRequest()
    } finally {
      logout()
      navigate('/login')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteUserRequest(id)
      setUsers(users.filter(u => u.id !== id))
    } catch {
      alert('Error al eliminar el usuario')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      <motion.div
        className="flex items-center justify-between mb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.h1 variants={fadeRight} className="text-2xl font-bold font-mono">
            Gestión de Usuarios
          </motion.h1>
          <motion.p variants={fadeLeft} className="text-gray-500 text-sm font-mono">
            Bienvenido, {user?.name}
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="flex gap-2">
          <Button onClick={() => navigate('/users/create')}>
            <RiUserAddFill className="size-4" /> Nuevo Usuario
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <RiLogoutBoxFill className="size-4" /> Cerrar Sesión
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <motion.div variants={fadeUp}>
              <CardTitle>Usuarios registrados</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            {loading && (
              <p className="text-center text-gray-500 py-8">Cargando...</p>
            )}
            {error && (
              <p className="text-center text-red-500 py-8">{error}</p>
            )}
            {!loading && !error && (
              <motion.div variants={fadeUp}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.id}</TableCell>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone ?? '—'}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2 py-1 font-mono ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => navigate(`/users/${u.id}/edit`)}
                            >
                              <RiPencilFill className="size-4" />
                            </Button>
                            <DialogDelete onDelete={() => handleDelete(u.id)} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                          No hay usuarios registrados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

    </div>
  )
}
