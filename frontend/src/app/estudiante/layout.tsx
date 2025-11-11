"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function EstudianteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Esperar a que termine de cargar antes de verificar autenticación
    if (!isLoading) {
      if (!isAuthenticated) {
        // Si no está autenticado, redirigir a login
        router.push("/login")
      } else if (user?.role !== "Estudiante") {
        // Si está autenticado pero no es Estudiante, redirigir a su dashboard correspondiente
        if (user?.role === "Monitor") {
          router.push("/monitor/dashboard")
        } else {
          router.push("/login")
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return null // o un componente de loading
  }

  // Si no es Estudiante, no renderizar (ya se está redirigiendo)
  if (user?.role !== "Estudiante") {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

