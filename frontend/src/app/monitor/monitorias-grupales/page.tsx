"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Badge } from "@/components/ui/badge"
import { mockMonitoriasGrupales } from "@/data/mockData"
import { MonitoriaGrupal } from "@/types"
import { Plus, MoreVertical, Edit, Trash2, Users, Calendar, Clock } from "lucide-react"

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]

function MonitoriaGrupalCard({
  monitoria,
  onEdit,
  onDelete,
}: {
  monitoria: MonitoriaGrupal
  onEdit: (monitoria: MonitoriaGrupal) => void
  onDelete: (id: string) => void
}) {
  const getRecurrenciaText = (recurrencia: MonitoriaGrupal["recurrencia"]) => {
    switch (recurrencia) {
      case "dos-a-la-semana":
        return "Dos veces por semana"
      case "una-a-la-semana":
        return "Una vez por semana"
      case "una-cada-dos-semanas":
        return "Una cada dos semanas"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
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
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recurrencia</p>
            <p className="text-sm">{getRecurrenciaText(monitoria.recurrencia)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Horarios</p>
            <div className="mt-1 space-y-1">
              {monitoria.diasYHorarios.map((dh, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {dh.dia} a las {dh.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Aforo máximo</p>
            <Badge variant="secondary">
              {monitoria.aforoMaximo === "ilimitado"
                ? "Ilimitado"
                : `${monitoria.aforoMaximo} estudiantes`}
            </Badge>
          </div>
          <div className="rounded-lg border bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Asistencia confirmada</p>
            <p className="text-lg font-semibold">12 estudiantes</p>
            <p className="text-xs text-muted-foreground">Interesados: 8</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MonitoriaGrupalModal({
  monitoria,
  isOpen,
  onClose,
  onSave,
}: {
  monitoria: MonitoriaGrupal | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<MonitoriaGrupal, "id" | "monitorId">) => void
}) {
  const [formData, setFormData] = useState({
    curso: "",
    recurrencia: "" as MonitoriaGrupal["recurrencia"] | "",
    diasYHorarios: [{ dia: "", hora: "" }],
    aforoMaximo: "ilimitado" as number | "ilimitado",
  })

  const isEdit = !!monitoria

  React.useEffect(() => {
    if (monitoria) {
      setFormData({
        curso: monitoria.curso,
        recurrencia: monitoria.recurrencia,
        diasYHorarios: monitoria.diasYHorarios,
        aforoMaximo: monitoria.aforoMaximo,
      })
    } else {
      setFormData({
        curso: "",
        recurrencia: "",
        diasYHorarios: [{ dia: "", hora: "" }],
        aforoMaximo: "ilimitado",
      })
    }
  }, [monitoria, isOpen])

  React.useEffect(() => {
    // Ajustar número de días según recurrencia
    if (formData.recurrencia === "dos-a-la-semana") {
      if (formData.diasYHorarios.length !== 2) {
        setFormData((prev) => ({
          ...prev,
          diasYHorarios:
            prev.diasYHorarios.length === 1
              ? [...prev.diasYHorarios, { dia: "", hora: "" }]
              : prev.diasYHorarios.slice(0, 2),
        }))
      }
    } else if (
      formData.recurrencia === "una-a-la-semana" ||
      formData.recurrencia === "una-cada-dos-semanas"
    ) {
      if (formData.diasYHorarios.length !== 1) {
        setFormData((prev) => ({
          ...prev,
          diasYHorarios: [prev.diasYHorarios[0] || { dia: "", hora: "" }],
        }))
      }
    }
  }, [formData.recurrencia])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.recurrencia) return

    const aforoMaximo =
      formData.aforoMaximo === "ilimitado"
        ? "ilimitado"
        : Number(formData.aforoMaximo)

    onSave({
      curso: formData.curso,
      recurrencia: formData.recurrencia,
      diasYHorarios: formData.diasYHorarios.filter(
        (dh) => dh.dia && dh.hora
      ),
      aforoMaximo,
    })
    onClose()
  }

  const updateDiaYHorario = (index: number, field: "dia" | "hora", value: string) => {
    setFormData((prev) => ({
      ...prev,
      diasYHorarios: prev.diasYHorarios.map((dh, idx) =>
        idx === index ? { ...dh, [field]: value } : dh
      ),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Monitoría Grupal" : "Añadir Monitoría Grupal"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos de la monitoría grupal"
              : "Completa los datos para crear una nueva monitoría grupal recurrente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                value={formData.curso}
                onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                placeholder="Ej: APO 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrencia">Recurrencia de sesiones</Label>
              <Select
                value={formData.recurrencia}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    recurrencia: value as MonitoriaGrupal["recurrencia"],
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la recurrencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dos-a-la-semana">Dos veces por semana</SelectItem>
                  <SelectItem value="una-a-la-semana">Una vez por semana</SelectItem>
                  <SelectItem value="una-cada-dos-semanas">
                    Una cada dos semanas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recurrencia && (
              <div className="space-y-3">
                <Label>Días y horarios</Label>
                {formData.diasYHorarios.map((dh, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor={`dia-${index}`}>Día</Label>
                      <Select
                        value={dh.dia}
                        onValueChange={(value) =>
                          updateDiaYHorario(index, "dia", value)
                        }
                        required
                      >
                        <SelectTrigger id={`dia-${index}`}>
                          <SelectValue placeholder="Selecciona el día" />
                        </SelectTrigger>
                        <SelectContent>
                          {diasSemana.map((dia) => (
                            <SelectItem key={dia} value={dia}>
                              {dia}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`hora-${index}`}>Hora</Label>
                      <Input
                        id={`hora-${index}`}
                        type="time"
                        value={dh.hora}
                        onChange={(e) =>
                          updateDiaYHorario(index, "hora", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="aforo">Aforo máximo</Label>
              <Select
                value={
                  formData.aforoMaximo === "ilimitado"
                    ? "ilimitado"
                    : formData.aforoMaximo.toString()
                }
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    aforoMaximo: value === "ilimitado" ? "ilimitado" : Number(value),
                  })
                }
                required
              >
                <SelectTrigger id="aforo">
                  <SelectValue placeholder="Selecciona el aforo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ilimitado">Ilimitado</SelectItem>
                  {[10, 15, 20, 25, 30, 40, 50].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} estudiantes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default function MonitoriasGrupalesPage() {
  const [monitorias, setMonitorias] = useState(mockMonitoriasGrupales)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMonitoria, setSelectedMonitoria] = useState<MonitoriaGrupal | null>(null)

  const handleAdd = () => {
    setSelectedMonitoria(null)
    setIsModalOpen(true)
  }

  const handleEdit = (monitoria: MonitoriaGrupal) => {
    setSelectedMonitoria(monitoria)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta monitoría grupal?")) {
      setMonitorias((prev) => prev.filter((m) => m.id !== id))
    }
  }

  const handleSave = (data: Omit<MonitoriaGrupal, "id" | "monitorId">) => {
    if (selectedMonitoria) {
      // Editar
      setMonitorias((prev) =>
        prev.map((m) => (m.id === selectedMonitoria.id ? { ...m, ...data } : m))
      )
    } else {
      // Crear nueva
      const newMonitoria: MonitoriaGrupal = {
        id: Date.now().toString(),
        ...data,
        monitorId: "1", // En el futuro vendrá del contexto de auth
      }
      setMonitorias((prev) => [...prev, newMonitoria])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitorías Grupales</h1>
          <p className="text-muted-foreground">
            Gestiona las monitorías grupales recurrentes que ofreces
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Monitoría Grupal
        </Button>
      </div>

      {monitorias.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No hay monitorías grupales</p>
            <p className="text-sm text-muted-foreground">
              Comienza añadiendo tu primera monitoría grupal
            </p>
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Monitoría Grupal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {monitorias.map((monitoria) => (
            <MonitoriaGrupalCard
              key={monitoria.id}
              monitoria={monitoria}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <MonitoriaGrupalModal
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

