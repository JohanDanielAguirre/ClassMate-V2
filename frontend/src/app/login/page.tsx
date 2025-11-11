'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await api.login({ email, password })
      
      // Guardar token
      localStorage.setItem('token', response.access_token)
      
      // Obtener perfil del usuario
      try {
        const profile = await api.getProfile()
        // Crear objeto User desde el perfil completo
        const user = {
          id: profile._id || profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          university: profile.university || '',
        }
        login(user)
        router.push(profile.role === 'Monitor' ? '/monitor/dashboard' : '/estudiante/dashboard')
      } catch (profileError) {
        // Si no se puede obtener el perfil, redirigir de todas formas
        console.warn('No se pudo obtener el perfil:', profileError)
        router.push('/')
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-md bg-card/80 border-border/50 shadow-xl">
        <CardHeader className="flex flex-col items-center pt-4 pb-4">
          <div className="relative w-48 h-48">
            <Image
              src="/images/Vertical.png"
              alt="ClassMate Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Correo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-border/50"
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Regístrate
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

