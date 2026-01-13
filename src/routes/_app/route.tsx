import { Sidebar } from '@/components/Sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: async ({context}) => {
    const user = context.user;

    if (!user) {
      throw redirect({to: '/login'});
    }
  },
})

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:pl-72 pt-6 pr-6">
        <Outlet />
      </main>
    </div>
  )
}
