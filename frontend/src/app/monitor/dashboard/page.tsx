"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  mockDashboardStats,
  mockSolicitudes,
  mockMonitoriasConfirmadas,
} from "@/data/mockData"
import { SolicitudMonitoria, MonitoriaConfirmada } from "@/types"
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react"

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative">
              <Star className="h-5 w-5 text-gray-400" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          )
        } else {
          return <Star key={i} className="h-5 w-5 text-gray-400" />
        }
      })}
      <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
    </div>
  )
}

function SolicitudModal({
  solicitud,
  isOpen,
  onClose,
  onAccept,
  onReject,
}: {
  solicitud: SolicitudMonitoria | null
  isOpen: boolean
  onClose: () => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
}) {
  if (!solicitud) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitud de Monitoría</DialogTitle>
          <DialogDescription>
            Detalles de la solicitud de monitoría
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="text-sm">{solicitud.fecha}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Horario</p>
              <p className="text-sm">{solicitud.horario}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Curso</p>
              <p className="text-sm">{solicitud.curso}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Espacio</p>
              <p className="text-sm">{solicitud.espacio}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Estudiante</p>
              <p className="text-sm">{solicitud.estudiante.name}</p>
              <p className="text-xs text-muted-foreground">{solicitud.estudiante.email}</p>
            </div>
          </div>
          {solicitud.tieneConflicto && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-medium">
                  Esta solicitud tiene conflicto con una monitoría ya confirmada
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onReject(solicitud.id)
              onClose()
            }}
          >
            Rechazar
          </Button>
          <Button
            onClick={() => {
              onAccept(solicitud.id)
              onClose()
            }}
          >
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HorarioModal({
  monitoria,
  isOpen,
  onClose,
}: {
  monitoria: MonitoriaConfirmada | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!monitoria) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Monitoría Confirmada</DialogTitle>
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
              <p className="text-sm font-medium text-muted-foreground">Estudiantes</p>
              <p className="text-sm">{monitoria.estudiantes.length}</p>
            </div>
          </div>
          {monitoria.estudiantes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Lista de Estudiantes:
              </p>
              <ul className="space-y-1">
                {monitoria.estudiantes.map((estudiante) => (
                  <li key={estudiante.id} className="text-sm">
                    • {estudiante.name}
                  </li>
                ))}
              </ul>
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

export default function DashboardPage() {
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudMonitoria | null>(
    null
  )
  const [selectedMonitoria, setSelectedMonitoria] = useState<MonitoriaConfirmada | null>(
    null
  )
  const [solicitudes, setSolicitudes] = useState(mockSolicitudes)
  const stats = mockDashboardStats

  // Filtrar monitorias del día actual
  const today = new Date().toISOString().split("T")[0]
  const monitoriasHoy = mockMonitoriasConfirmadas
    .filter((m) => m.fecha === today)
    .sort((a, b) => a.horario.localeCompare(b.horario))

  const handleAcceptSolicitud = (id: string) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: "aceptada" } : s))
    )
  }

  const handleRejectSolicitud = (id: string) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: "rechazada" } : s))
    )
  }

  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de tu actividad como monitor</p>
      </div>

      {/* 4 Cards principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monitorias Confirmadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monitoriasConfirmadasEstaSemana}</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Monitoría</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.proximaMonitoria ? (
              <>
                <div className="text-lg font-semibold">
                  {stats.proximaMonitoria.horario}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.proximaMonitoria.curso} - {stats.proximaMonitoria.ubicacion}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No hay monitorías programadas</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monitorias</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMonitoriasDadas}</div>
            <p className="text-xs text-muted-foreground">Dadas en total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Media</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <StarRating rating={stats.calificacionMedia} />
          </CardContent>
        </Card>
      </div>

      {/* 2 Cards grandes */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Solicitudes de Monitorias */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Monitorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {solicitudesPendientes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay solicitudes pendientes
                </p>
              ) : (
                solicitudesPendientes.map((solicitud) => (
                  <div
                    key={solicitud.id}
                    className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent"
                    onClick={() => setSelectedSolicitud(solicitud)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{solicitud.curso}</p>
                          {solicitud.tieneConflicto && (
                            <Badge variant="destructive" className="text-xs">
                              Conflicto
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {solicitud.estudiante.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {solicitud.fecha} a las {solicitud.horario} - {solicitud.espacio}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Horario Diario */}
        <Card>
          <CardHeader>
            <CardTitle>Horario de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monitoriasHoy.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay monitorías programadas para hoy
                </p>
              ) : (
                monitoriasHoy.map((monitoria) => (
                  <div
                    key={monitoria.id}
                    className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent"
                    onClick={() => setSelectedMonitoria(monitoria)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{monitoria.horario}</p>
                          <Badge
                            variant={monitoria.tipo === "grupal" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {monitoria.tipo === "grupal" ? "Grupal" : "Personalizada"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{monitoria.curso}</p>
                        <p className="text-xs text-muted-foreground">
                          {monitoria.espacio} - {monitoria.estudiantes.length} estudiante(s)
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <SolicitudModal
        solicitud={selectedSolicitud}
        isOpen={!!selectedSolicitud}
        onClose={() => setSelectedSolicitud(null)}
        onAccept={handleAcceptSolicitud}
        onReject={handleRejectSolicitud}
      />

      <HorarioModal
        monitoria={selectedMonitoria}
        isOpen={!!selectedMonitoria}
        onClose={() => setSelectedMonitoria(null)}
      />
    </div>
  )
}

