import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { exchangeCodeForSession } from '@/server-functions/auth'

export const Route = createFileRoute('/callback/')({
  validateSearch: z.object({
    code: z.string().optional(),
    error: z.string().optional(),
  }),
  async beforeLoad({ search }) {
    if (search.error) {
      throw redirect({ to: '/login' })
    }

    if (!search.code) {
      throw redirect({ to: '/login' })
    }

    const { user } = await exchangeCodeForSession({ data: { code: search.code } })

    if (user) {
      throw redirect({ to: '/dashboard' })
    }

    throw redirect({ to: '/login' })
  },
  component: () => <div>Redirigiendo...</div>,
})