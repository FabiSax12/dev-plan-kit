import { LayoutDashboard, FolderKanban, Lightbulb, Sparkles, Settings, LogOut, Menu, X, User, PanelLeftClose, PanelLeftOpen, Map } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Route } from "@/routes/_app/route"
import { supabase } from "@/lib/supabase.client"
import { useSidebar } from "./SidebarContext"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/roadmaps", label: "Roadmaps", icon: Map },
  { href: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
]

export function Sidebar() {
  const { user } = Route.useRouteContext()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { collapsed, toggle } = useSidebar()
  const navigate = Route.useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    }

    navigate({ to: '/login' });
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-200 md:translate-x-0",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn(
            "flex h-16 items-center gap-2 border-b border-border",
            collapsed ? "justify-center px-2" : "px-6"
          )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <FolderKanban className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-semibold">DevPlanKit</span>}
          </div>

          {/* User section */}
          <div className={cn(
            "flex items-center gap-3 border-b border-border py-4",
            collapsed ? "justify-center px-2" : "px-6"
          )}>
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn("flex-1 space-y-1 py-4", collapsed ? "px-2" : "px-3")}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors truncate",
                  collapsed ? "justify-center px-2" : "px-3"
                )}
                activeProps={{
                  className: "bg-primary text-primary-foreground"
                }}
                inactiveProps={{
                  className: "text-muted-foreground hover:bg-muted hover:text-foreground"
                }}
                activeOptions={{ exact: false }}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className={cn("border-t border-border space-y-1", collapsed ? "p-2" : "p-3")}>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                collapsed ? "justify-center px-2" : "px-3"
              )}
              title={collapsed ? "Settings" : undefined}
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!collapsed && "Settings"}
            </Link>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                collapsed ? "justify-center px-2" : "px-3"
              )}
              onClick={handleLogout}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && "Logout"}
            </button>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                collapsed ? "justify-center px-2" : "px-3"
              )}
              onClick={toggle}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4 shrink-0" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4 shrink-0" />
                  Collapse
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
