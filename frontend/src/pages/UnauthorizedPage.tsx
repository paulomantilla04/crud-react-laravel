import { motion } from 'motion/react'

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
          },
        }}
      >
        <motion.h1
          className="text-4xl font-bold text-red-500 font-mono"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
          }}
        >
          403
        </motion.h1>
        <motion.p
          className="text-gray-500 mt-2 font-mono"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          }}
        >
          No tienes permisos para ver esta página
        </motion.p>
      </motion.div>
    </div>
  )
}