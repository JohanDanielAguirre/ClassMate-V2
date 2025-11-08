"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { mockUser } from "@/data/mockData"

export default function MonitorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, login, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Por ahora, auto-login con usuario mock si no hay usuario
    // En el futuro, esto verificará el token del backend
    if (!isAuthenticated) {
      login(mockUser)
    }
  }, [isAuthenticated, login])

  // Si no hay usuario después del efecto, redirigir a login
  // (esto se activará cuando se implemente la autenticación real)
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login")
  //   }
  // }, [isAuthenticated, router])

  return <DashboardLayout>{children}</DashboardLayout>
}

