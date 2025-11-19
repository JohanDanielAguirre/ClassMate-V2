"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import iconImage from "@/assets/Icon.png"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const monitorNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/monitor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Monitorias Personalizadas",
    href: "/monitor/monitorias-personalizadas",
    icon: BookOpen,
  },
  {
    title: "Monitorias Grupales",
    href: "/monitor/monitorias-grupales",
    icon: Users,
  },
]

const estudianteNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/estudiante/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Monitorias",
    href: "/estudiante/monitorias",
    icon: BookOpen,
  },
  {
    title: "Monitorias Confirmadas",
    href: "/estudiante/monitorias-confirmadas",
    icon: Users,
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const navItems = user?.role === "Estudiante" ? estudianteNavItems : monitorNavItems

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-card shadow-md hover:bg-accent"
      >
        {isCollapsed ? (
          <Menu className="h-4 w-4" />
        ) : (
          <X className="h-4 w-4" />
        )}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b px-4">
        {isCollapsed ? (
          <div className="relative h-10 w-10">
            <Image
              src={iconImage}
              alt="ClassMate Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="relative h-12 w-32">
            <Image
              src="/images/Vertical.png"
              alt="ClassMate Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
              Navegación
            </p>
          )}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        {/* User Card */}
        <div
          className={cn(
            "mb-4 rounded-lg border bg-card/50 p-3",
            isCollapsed && "flex justify-center"
          )}
        >
          {isCollapsed ? (
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user?.name || "Usuario"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.role || "Monitor"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Settings and Logout */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Ajustes de cuenta" : undefined}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Ajustes de cuenta</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-destructive hover:text-destructive",
              isCollapsed && "justify-center px-0"
            )}
            onClick={handleLogout}
            title={isCollapsed ? "Log out" : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Log out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
