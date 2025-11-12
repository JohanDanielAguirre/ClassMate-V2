"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MonitoriaPersonalizada } from "@/types"
import { Plus, MoreVertical, Edit, Trash2, BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api, ApiError } from "@/lib/api"

function MonitoriaCard({
  monitoria,
  onEdit,
  onDelete,
}: {
  monitoria: MonitoriaPersonalizada
  onEdit: (monitoria: MonitoriaPersonalizada) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{monitoria.curso}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(monitoria)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(monitoria.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Precio por hora</p>
            <p className="text-lg font-semibold">
              ${monitoria.precioPorHora.toLocaleString("es-CO")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Descripción</p>
            <p className="text-sm">{monitoria.descripcion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MonitoriaModal({
  monitoria,
  isOpen,
  onClose,
  onSave,
}: {
  monitoria: MonitoriaPersonalizada | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<MonitoriaPersonalizada, "id" | "monitorId">) => void
}) {
  const [formData, setFormData] = useState({
    curso: "",
    precioPorHora: "",
    descripcion: "",
  })

  const isEdit = !!monitoria

  React.useEffect(() => {
    if (monitoria) {
      setFormData({
        curso: monitoria.curso,
        precioPorHora: monitoria.precioPorHora.toString(),
        descripcion: monitoria.descripcion,
      })
    } else {
      setFormData({
        curso: "",
        precioPorHora: "",
        descripcion: "",
      })
    }
  }, [monitoria, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      curso: formData.curso,
      precioPorHora: parseFloat(formData.precioPorHora),
      descripcion: formData.descripcion,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Monitoría Personalizada" : "Añadir Monitoría Personalizada"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos de la monitoría personalizada"
              : "Completa los datos para ofrecer una nueva monitoría personalizada"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="curso">Curso de oferta</Label>
              <Input
                id="curso"
                value={formData.curso}
                onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                placeholder="Ej: APO 1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio por hora</Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="1000"
                value={formData.precioPorHora}
                onChange={(e) =>
                  setFormData({ ...formData, precioPorHora: e.target.value })
                }
                placeholder="Ej: 25000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Describe la monitoría que ofreces..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function MonitoriasPersonalizadasPage() {
  const { user } = useAuth()
  const [monitorias, setMonitorias] = useState<MonitoriaPersonalizada[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMonitoria, setSelectedMonitoria] =
    useState<MonitoriaPersonalizada | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para mapear datos del backend al formato del frontend
  const mapMonitoriaFromBackend = (data: any): MonitoriaPersonalizada => {
    return {
      id: data._id || data.id,
      curso: data.curso,
      precioPorHora: data.precioPorHora,
      descripcion: data.descripcion,
      monitorId: data.monitorId,
    }
  }

  // Cargar monitorías al montar
  useEffect(() => {
    if (user?.id) {
      loadMonitorias()
    }
  }, [user?.id])

  const loadMonitorias = async () => {
    if (!user?.id) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMonitoriasPersonalizadas(user.id)
      const mapped = data.map(mapMonitoriaFromBackend)
      setMonitorias(mapped)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al cargar monitorías')
      console.error('Error loading monitorías:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedMonitoria(null)
    setIsModalOpen(true)
  }

  const handleEdit = (monitoria: MonitoriaPersonalizada) => {
    setSelectedMonitoria(monitoria)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta monitoría?")) {
      return
    }

    try {
      await api.deleteMonitoriaPersonalizada(id)
      // Recargar la lista
      await loadMonitorias()
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || 'Error al eliminar monitoría')
      console.error('Error deleting monitoría:', err)
    }
  }

  const handleSave = async (data: Omit<MonitoriaPersonalizada, "id" | "monitorId">) => {
    try {
      if (selectedMonitoria) {
        // Editar
        await api.updateMonitoriaPersonalizada(selectedMonitoria.id, data)
      } else {
        // Crear nueva
        await api.createMonitoriaPersonalizada(data)
      }
      // Recargar la lista
      await loadMonitorias()
      setIsModalOpen(false)
      setSelectedMonitoria(null)
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || 'Error al guardar monitoría')
      console.error('Error saving monitoría:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando monitorías...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitorías Personalizadas</h1>
          <p className="text-muted-foreground">
            Gestiona las monitorías personalizadas que ofreces
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Monitoría
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {monitorias.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No hay monitorías personalizadas</p>
            <p className="text-sm text-muted-foreground">
              Comienza añadiendo tu primera monitoría personalizada
            </p>
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Monitoría
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {monitorias.map((monitoria) => (
            <MonitoriaCard
              key={monitoria.id}
              monitoria={monitoria}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <MonitoriaModal
        monitoria={selectedMonitoria}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedMonitoria(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}

