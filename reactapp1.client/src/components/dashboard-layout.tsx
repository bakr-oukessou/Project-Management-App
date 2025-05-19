"use client"

import { ReactNode, useState } from "react"
import { Link } from "react-router-dom"
import { usePathname } from "next/navigation"
import { Button } from "../components/ui/button"
import { LayoutDashboard, FolderKanban, Users, Settings, LogOut, Menu, X, User } from "lucide-react"

type UserRole = "director" | "manager" | "developer"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  userRole: UserRole
}

export default function DashboardLayout({ children, title, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getNavItems = () => {
    switch (userRole) {
      case "director":
        return [
          {
            title: "Dashboard",
            href: "/director/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: "Projects",
            href: "/director/projects/index",
            icon: <FolderKanban className="h-5 w-5" />,
          },
          {
            title: "Team",
            href: "/director/team/",
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: "Settings",
            href: "/director/settings",
            icon: <Settings className="h-5 w-5" />,
          },
        ]
      case "manager":
        return [
          {
            title: "Dashboard",
            href: "/manager/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: "Projects",
            href: "/manager/projects",
            icon: <FolderKanban className="h-5 w-5" />,
          },
          {
            title: "Team",
            href: "/manager/team",
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: "Settings",
            href: "/manager/settings",
            icon: <Settings className="h-5 w-5" />,
          },
        ]
      case "developer":
        return [
          {
            title: "Dashboard",
            href: "/developer/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: "Projects",
            href: "/developer/projects/view",
            icon: <FolderKanban className="h-5 w-5" />,
          },
          {
            title: "Tasks",
            href: "/developer/tasks/view",
            icon: <FolderKanban className="h-5 w-5" />,
          },
          {
            title: "Profile",
            href: "/developer/profile",
            icon: <User className="h-5 w-5" />,
          },
          {
            title: "Settings",
            href: "/developer/settings",
            icon: <Settings className="h-5 w-5" />,
          },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <Link to="/" className="font-semibold">
            Project Management System
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center border-b px-6 md:h-[64px]">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="text-lg font-bold">{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Panel</span>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-3 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close Sidebar</span>
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="grid gap-1 px-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                    pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  )
}
