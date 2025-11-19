'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'

export default function RegisterPage() {
  const [formData, setFormData] = useState<{email:string; name:string; password:string; university:string; role: '' | UserRole}>({
    email: '',
    name: '',
    password: '',
    university: '',
    role: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!formData.role) {
      setError('Selecciona un rol')
      return
    }
    setLoading(true)

    try {
      const response = await api.register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        university: formData.university,
        role: formData.role,
      })
      
      // Guardar token
      localStorage.setItem('token', response.access_token)
      
      // Obtener perfil del usuario
      try {
        const profile = await api.getProfile()
        const role: UserRole = profile.role === 'Monitor' ? 'Monitor' : 'Estudiante'
        const user = {
          id: profile._id || profile.id,
          email: profile.email,
          name: profile.name,
          role,
          university: profile.university || '',
          avatar: profile.avatar,
        }
        login(user)
        router.push(role === 'Monitor' ? '/monitor/dashboard' : '/estudiante/dashboard')
      } catch (profileError) {
        // Si no se puede obtener el perfil, usar datos del formulario como fallback
        console.warn('No se pudo obtener el perfil:', profileError)
        const fallbackRole: UserRole = formData.role === 'Monitor' ? 'Monitor' : 'Estudiante'
        const user = {
          id: 'temp',
            email: formData.email,
            name: formData.name,
            role: fallbackRole,
            university: formData.university,
        }
        login(user)
        router.push(fallbackRole === 'Monitor' ? '/monitor/dashboard' : '/estudiante/dashboard')
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Correo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
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
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university" className="text-foreground">
                Universidad
              </Label>
              <Select
                value={formData.university}
                onValueChange={(value) => handleChange('university', value)}
                required
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Selecciona una universidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICESI">ICESI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground">
                Rol
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                required
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estudiante">Estudiante</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
