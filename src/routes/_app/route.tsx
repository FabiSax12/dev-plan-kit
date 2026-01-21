import { Sidebar } from '@/components/Sidebar'
import { SidebarProvider, useSidebar } from '@/components/SidebarContext'
import { cn } from '@/lib/utils'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: async ({ context }) => {
    const user = context.user;

    if (!user) {
      throw redirect({ to: '/login' });
    }
  },
})

function AppLayout() {
  return (
    <SidebarProvider>
      <AppLayoutContent />
    </SidebarProvider>
  )
}

function AppLayoutContent() {
  const { collapsed } = useSidebar()

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className={cn(
        "py-6 pr-6 transition-all duration-300",
        collapsed ? "md:pl-24" : "md:pl-72"
      )}>
        <Outlet />
      </main>
    </div>
  )
}
