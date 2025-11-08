"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { mockEstudiante } from "@/data/mockData"

export default function EstudianteLayout({
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
      login(mockEstudiante)
    }
  }, [isAuthenticated, login])

  return <DashboardLayout>{children}</DashboardLayout>
}

