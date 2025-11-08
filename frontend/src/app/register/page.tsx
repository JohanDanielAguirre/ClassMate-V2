'use client'

import { useState } from 'react'
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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    university: '',
    role: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de registro
    console.log('Register:', formData)
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
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
            >
              Registrarse
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

