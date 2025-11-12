"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/student/Calendar"
import { MonitoriaEstudiante } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { api, ApiError } from "@/lib/api"
import { Calendar as CalendarIcon, Clock, MapPin, BookOpen, Star } from "lucide-react"
import { cn } from "@/lib/utils"

function StarRating({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={cn(
            "transition-colors",
            readonly && "cursor-default",
            !readonly && "cursor-pointer hover:scale-110"
          )}
        >
          <Star
            className={cn(
              "h-5 w-5",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            )}
          />
        </button>
      ))}
    </div>
  )
}

function MonitoriaModal({
  monitoria,
  isOpen,
  onClose,
  onRate,
}: {
  monitoria: MonitoriaEstudiante | null
  isOpen: boolean
  onClose: () => void
  onRate: (monitoriaId: string, rating: number) => void
}) {
  const [rating, setRating] = useState(monitoria?.calificacion || 0)

  if (!monitoria) return null

  const handleRate = () => {
    if (rating > 0) {
      onRate(monitoria.id, rating)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Monitoría - {monitoria.curso}</DialogTitle>
          <DialogDescription>Detalles de la monitoría</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="text-sm">{monitoria.fecha}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Horario</p>
              <p className="text-sm">{monitoria.horario}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Curso</p>
              <p className="text-sm">{monitoria.curso}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Espacio</p>
              <p className="text-sm">{monitoria.espacio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <Badge variant={monitoria.tipo === "grupal" ? "default" : "secondary"}>
                {monitoria.tipo === "grupal" ? "Grupal" : "Personalizada"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monitor</p>
              <p className="text-sm">{monitoria.monitor.name}</p>
            </div>
          </div>
          {monitoria.yaPaso && !monitoria.calificada && (
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Califica esta monitoría</p>
              <StarRating rating={rating} onRatingChange={setRating} />
              <Button onClick={handleRate} className="mt-3" disabled={rating === 0}>
                Enviar calificación
              </Button>
            </div>
          )}
          {monitoria.calificada && monitoria.calificacion && (
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Tu calificación</p>
              <StarRating rating={monitoria.calificacion} readonly />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DiaModal({
  fecha,
  monitorias,
  isOpen,
  onClose,
  onMonitoriaClick,
}: {
  fecha: Date | null
  monitorias: MonitoriaEstudiante[]
  isOpen: boolean
  onClose: () => void
  onMonitoriaClick: (monitoria: MonitoriaEstudiante) => void
}) {
  if (!fecha) return null

  const fechaStr = fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{fechaStr}</DialogTitle>
          <DialogDescription>
            {monitorias.length} monitoría(s) programada(s)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {monitorias.map((monitoria) => (
            <Card
              key={monitoria.id}
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => {
                onMonitoriaClick(monitoria)
                onClose()
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{monitoria.curso}</p>
                      <Badge
                        variant={monitoria.tipo === "grupal" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {monitoria.tipo === "grupal" ? "Grupal" : "Personalizada"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {monitoria.horario} - {monitoria.espacio}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Monitor: {monitoria.monitor.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function EstudianteDashboardPage() {
  const { user } = useAuth()
  const [monitorias, setMonitorias] = useState<MonitoriaEstudiante[]>([])
  const [proximaMonitoria, setProximaMonitoria] = useState<MonitoriaEstudiante | null>(null)
  const [monitoriasHoy, setMonitoriasHoy] = useState(0)
  const [selectedMonitoria, setSelectedMonitoria] =
    useState<MonitoriaEstudiante | null>(null)
  const [selectedDay, setSelectedDay] = useState<{
    date: Date
    monitorias: MonitoriaEstudiante[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para mapear monitoría del backend
  const mapMonitoriaFromBackend = (data: any): MonitoriaEstudiante => {
    const hoy = new Date().toISOString().split("T")[0]
    const now = new Date()
    const horaActual = now.toTimeString().slice(0, 5)
    const fechaMonitoria = data.fecha
    const horarioMonitoria = data.horario
    const yaPaso = fechaMonitoria < hoy || (fechaMonitoria === hoy && horarioMonitoria < horaActual)

    return {
      id: data._id || data.id,
      fecha: data.fecha,
      horario: data.horario,
      curso: data.curso,
      espacio: data.espacio,
      tipo: data.tipo,
      monitor: data.monitor ? {
        id: data.monitor.id,
        name: data.monitor.name,
      } : { id: data.monitorId, name: "Desconocido" },
      monitoriaPersonalizadaId: data.monitoriaPersonalizadaId,
      monitoriaGrupalId: data.monitoriaGrupalId,
      yaPaso,
      calificada: false, // Por ahora siempre false, se puede implementar después
      calificacion: undefined,
    }
  }

  // Cargar datos del dashboard
  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
    }
  }, [user?.id])

  const loadDashboardData = async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)
    try {
      const data = await api.getEstudianteDashboard()

      // Mapear próxima monitoría
      if (data.proximaMonitoria) {
        const proxima = mapMonitoriaFromBackend(data.proximaMonitoria)
        setProximaMonitoria(proxima)
      } else {
        setProximaMonitoria(null)
      }

      // Establecer cantidad de monitorías de hoy
      setMonitoriasHoy(data.monitoriasHoy || 0)

      // Mapear todas las monitorías confirmadas para el calendario
      const monitoriasMapped = (data.monitoriasConfirmadas || []).map(mapMonitoriaFromBackend)
      setMonitorias(monitoriasMapped)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al cargar datos del dashboard')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDayClick = (date: Date, dayMonitorias: MonitoriaEstudiante[]) => {
    setSelectedDay({ date, monitorias: dayMonitorias })
  }

  const handleMonitoriaClick = (monitoria: MonitoriaEstudiante) => {
    setSelectedMonitoria(monitoria)
  }

  const handleRate = (monitoriaId: string, rating: number) => {
    // TODO: Implementar endpoint para calificar monitoría
    setMonitorias((prev) =>
      prev.map((m) =>
        m.id === monitoriaId ? { ...m, calificacion: rating, calificada: true } : m
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de tus monitorías</p>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 2 Cards superiores */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Próxima Monitoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximaMonitoria ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold">{proximaMonitoria.curso}</p>
                <p className="text-xs text-muted-foreground">
                  {proximaMonitoria.fecha} a las {proximaMonitoria.horario} - {proximaMonitoria.espacio}
                </p>
                <p className="text-xs text-muted-foreground">
                  Monitor: {proximaMonitoria.monitor.name}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No tienes monitorías programadas
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Monitorías de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monitoriasHoy}</div>
            <p className="text-sm text-muted-foreground">
              {monitoriasHoy === 1
                ? "monitoría programada"
                : "monitorías programadas"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendario */}
      <Card>
        <CardHeader>
          <CardTitle>Calendario</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            monitorias={monitorias}
            onDayClick={handleDayClick}
            onMonitoriaClick={handleMonitoriaClick}
          />
        </CardContent>
      </Card>

      {/* Modales */}
      <MonitoriaModal
        monitoria={selectedMonitoria}
        isOpen={!!selectedMonitoria}
        onClose={() => setSelectedMonitoria(null)}
        onRate={handleRate}
      />

      <DiaModal
        fecha={selectedDay?.date || null}
        monitorias={selectedDay?.monitorias || []}
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        onMonitoriaClick={handleMonitoriaClick}
      />
    </div>
  )
}

