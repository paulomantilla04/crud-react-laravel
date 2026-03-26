export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 font-mono">403</h1>
        <p className="text-gray-500 mt-2 font-mono">No tienes permisos para ver esta página</p>
      </div>
    </div>
  )
}