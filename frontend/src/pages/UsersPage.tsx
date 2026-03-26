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

export default function UsersPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

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
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      await deleteUserRequest(id)
      setUsers(users.filter(u => u.id !== id))
    } catch {
      alert('Error al eliminar el usuario')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm font-mono">Bienvenido, {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/users/create')}>
            + Nuevo Usuario
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="text-center text-gray-500 py-8">Cargando...</p>
          )}

          {error && (
            <p className="text-center text-red-500 py-8">{error}</p>
          )}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
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
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/users/${u.id}/edit`)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(u.id)}
                        >
                          Eliminar
                        </Button>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
