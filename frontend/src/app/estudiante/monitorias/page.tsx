"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
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
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MonitoriaCard } from "@/components/student/MonitoriaCard"
import { MonitorProfileModal } from "@/components/student/MonitorProfileModal"
import { Pagination } from "@/components/ui/pagination"
import { MonitoriaDisponible, PerfilMonitor } from "@/types"
import { api, ApiError } from "@/lib/api"
import { Search, Calendar, Clock, DollarSign, Users, Star } from "lucide-react"

function MonitoriaDetailModal({
  monitoria,
  isOpen,
  onClose,
  onConfirm,
  onRequest,
  onViewProfile,
}: {
  monitoria: MonitoriaDisponible | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  onRequest: (data: {
    fecha: string
    horario: string
    cantidadHoras: number
  }) => void
  onViewProfile: (monitorId: string) => void
}) {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestData, setRequestData] = useState({
    fecha: "",
    horario: "",
    cantidadHoras: "",
  })

  if (!monitoria) return null

  const handleRequest = () => {
    if (requestData.fecha && requestData.horario && requestData.cantidadHoras) {
      onRequest({
        fecha: requestData.fecha,
        horario: requestData.horario,
        cantidadHoras: parseInt(requestData.cantidadHoras),
      })
      setShowRequestForm(false)
      setRequestData({ fecha: "", horario: "", cantidadHoras: "" })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{monitoria.curso}</DialogTitle>
          <DialogDescription>
            {monitoria.tipo === "grupal" ? "Monitoría Grupal" : "Monitoría Personalizada"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {monitoria.tipo === "grupal" ? (
              <>
                {/* Horario habitual */}
                {monitoria.diasYHorarios && monitoria.diasYHorarios.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Horario Habitual</p>
                    <div className="space-y-1">
                      {monitoria.diasYHorarios.map((dh, idx) => (
                        <p key={idx} className="text-sm">
                          {dh.dia} a las {dh.hora}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {/* Próxima sesión */}
                {monitoria.fecha && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Próxima Sesión</p>
                    <p className="text-sm">{monitoria.fecha} a las {monitoria.horario}</p>
                  </div>
                )}
                {monitoria.espacio && monitoria.espacio !== 'Por definir' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Espacio</p>
                    <p className="text-sm">{monitoria.espacio}</p>
                  </div>
                )}
                {monitoria.aforoMaximo && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aforo</p>
                    <p className="text-sm">
                      {monitoria.aforoMaximo === "ilimitado"
                        ? "Ilimitado"
                        : `${monitoria.aforoMaximo} estudiantes`}
                    </p>
                  </div>
                )}
                {monitoria.estudiantesConfirmados !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Estudiantes confirmados
                    </p>
                    <p className="text-sm">{monitoria.estudiantesConfirmados}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {monitoria.precioPorHora && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Precio por hora
                    </p>
                    <p className="text-sm">
                      ${monitoria.precioPorHora.toLocaleString("es-CO")}
                    </p>
                  </div>
                )}
                {monitoria.descripcion && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Descripción
                    </p>
                    <p className="text-sm">{monitoria.descripcion}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Card del monitor */}
          <Card
            className="cursor-pointer transition-colors hover:bg-accent"
            onClick={() => onViewProfile(monitoria.monitor.id)}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {monitoria.monitor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{monitoria.monitor.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {monitoria.monitor.calificacion.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de solicitud para personalizadas */}
          {monitoria.tipo === "personalizada" && showRequestForm && (
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-medium">Solicitar Monitoría Personalizada</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={requestData.fecha}
                    onChange={(e) =>
                      setRequestData({ ...requestData, fecha: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="horario">Horario</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={requestData.horario}
                    onChange={(e) =>
                      setRequestData({ ...requestData, horario: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="horas">Cantidad de horas</Label>
                  <Input
                    id="horas"
                    type="number"
                    min="1"
                    value={requestData.cantidadHoras}
                    onChange={(e) =>
                      setRequestData({ ...requestData, cantidadHoras: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleRequest}>Enviar Solicitud</Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {monitoria.tipo === "grupal" ? (
            <Button onClick={() => onConfirm(monitoria.id)}>
              Confirmar Asistencia
            </Button>
          ) : (
            !showRequestForm && (
              <Button onClick={() => setShowRequestForm(true)}>
                Enviar Solicitud
              </Button>
            )
          )}
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function MonitoriasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tipoFilter, setTipoFilter] = useState<"grupal" | "personalizada">("grupal")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonitoria, setSelectedMonitoria] =
    useState<MonitoriaDisponible | null>(null)
  const [selectedMonitorId, setSelectedMonitorId] = useState<string | null>(null)
  const [monitorias, setMonitorias] = useState<MonitoriaDisponible[]>([])
  const [perfilMonitor, setPerfilMonitor] = useState<PerfilMonitor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const itemsPerPage = 15

  // Función para mapear monitoría grupal del backend
  const mapGrupalFromBackend = (data: any): MonitoriaDisponible => {
    return {
      id: data._id || data.id,
      curso: data.curso,
      tipo: "grupal",
      fecha: data.proximaSesion?.fecha,
      horario: data.proximaSesion?.horario,
      espacio: data.proximaSesion?.espacio,
      aforoMaximo: data.aforoMaximo,
      estudiantesConfirmados: data.proximaSesion?.estudiantesConfirmados || 0,
      diasYHorarios: data.diasYHorarios || [], // Horario habitual
      recurrencia: data.recurrencia,
      monitor: data.monitor ? {
        id: data.monitor.id,
        name: data.monitor.name,
        calificacion: data.monitor.calificacion || 0,
      } : { id: data.monitorId, name: "Desconocido", calificacion: 0 },
      monitoriaGrupalId: data.monitoriaGrupalId || data._id?.toString(),
    }
  }

  // Función para mapear monitoría personalizada del backend
  const mapPersonalizadaFromBackend = (data: any): MonitoriaDisponible => {
    return {
      id: data._id || data.id,
      curso: data.curso,
      tipo: "personalizada",
      precioPorHora: data.precioPorHora,
      descripcion: data.descripcion,
      monitor: data.monitor ? {
        id: data.monitor.id,
        name: data.monitor.name,
        calificacion: data.monitor.calificacion || 0,
      } : { id: data.monitorId, name: "Desconocido", calificacion: 0 },
      monitoriaPersonalizadaId: data.monitoriaPersonalizadaId || data._id?.toString(),
    }
  }

  // Cargar monitorías según el tipo
  useEffect(() => {
    loadMonitorias()
  }, [tipoFilter])

  const loadMonitorias = async () => {
    setLoading(true)
    setError(null)
    try {
      let data: any[]
      if (tipoFilter === "grupal") {
        data = await api.getMonitoriasGrupalesDisponibles()
        const mapped = data.map(mapGrupalFromBackend)
        setMonitorias(mapped)
      } else {
        data = await api.getMonitoriasPersonalizadasDisponibles()
        const mapped = data.map(mapPersonalizadaFromBackend)
        setMonitorias(mapped)
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al cargar monitorías')
      console.error('Error loading monitorías:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar y ordenar monitorias
  const filteredMonitorias = useMemo(() => {
    let filtered = monitorias.filter((m) => m.tipo === tipoFilter)

    // Búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.curso.toLowerCase().includes(query) ||
          m.monitor.name.toLowerCase().includes(query)
      )
    }

    // Ordenamiento alfabético por curso (como se especifica en el plan)
    filtered.sort((a, b) => a.curso.localeCompare(b.curso))

    return filtered
  }, [searchQuery, tipoFilter, monitorias])

  // Paginación
  const totalPages = Math.ceil(filteredMonitorias.length / itemsPerPage)
  const paginatedMonitorias = filteredMonitorias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleConfirm = async (id: string) => {
    try {
      await api.confirmarAsistenciaGrupal(id)
      alert('Asistencia confirmada exitosamente')
      setSelectedMonitoria(null)
      // Recargar monitorías para actualizar contadores
      await loadMonitorias()
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || 'Error al confirmar asistencia')
      console.error('Error confirming asistencia:', err)
    }
  }

  const handleRequest = async (data: { fecha: string; horario: string; cantidadHoras: number }) => {
    if (!selectedMonitoria) return

    try {
      // Obtener el espacio (puede venir de la monitoría o ser un campo por defecto)
      const espacio = selectedMonitoria.espacio || "Por definir"
      
      await api.createSolicitud({
        fecha: data.fecha,
        horario: data.horario,
        curso: selectedMonitoria.curso,
        espacio: espacio,
        tipo: "personalizada",
        monitorId: selectedMonitoria.monitor.id,
        monitoriaPersonalizadaId: selectedMonitoria.monitoriaPersonalizadaId,
      })
      alert('Solicitud enviada exitosamente')
      setSelectedMonitoria(null)
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || 'Error al enviar solicitud')
      console.error('Error sending solicitud:', err)
    }
  }

  const handleViewProfile = async (monitorId: string) => {
    try {
      const profile = await api.getUserProfile(monitorId)
      // Mapear perfil del backend al formato esperado
      const perfil: PerfilMonitor = {
        id: profile._id || profile.id,
        name: profile.name,
        email: profile.email,
        calificacion: profile.calificacionMedia || 0,
        avatar: profile.avatar,
        monitoriasGrupales: [], // Se pueden cargar si es necesario
        monitoriasPersonalizadas: [], // Se pueden cargar si es necesario
      }
      setPerfilMonitor(perfil)
      setSelectedMonitorId(monitorId)
      setSelectedMonitoria(null)
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || 'Error al cargar perfil del monitor')
      console.error('Error loading profile:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monitorías Disponibles</h1>
        <p className="text-muted-foreground">
          Explora y agenda las monitorías disponibles
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por curso o monitor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9"
            />
          </div>
        </div>
        <Select
          value={tipoFilter}
          onValueChange={(value) => {
            setTipoFilter(value as "grupal" | "personalizada")
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grupal">Grupales</SelectItem>
            <SelectItem value="personalizada">Personalizadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Cargando monitorías...</p>
          </CardContent>
        </Card>
      ) : paginatedMonitorias.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No se encontraron monitorías</p>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedMonitorias.map((monitoria) => (
              <MonitoriaCard
                key={monitoria.id}
                monitoria={monitoria}
                onClick={() => setSelectedMonitoria(monitoria)}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Modales */}
      <MonitoriaDetailModal
        monitoria={selectedMonitoria}
        isOpen={!!selectedMonitoria}
        onClose={() => setSelectedMonitoria(null)}
        onConfirm={handleConfirm}
        onRequest={handleRequest}
        onViewProfile={handleViewProfile}
      />

      <MonitorProfileModal
        perfil={perfilMonitor}
        isOpen={!!selectedMonitorId}
        onClose={() => {
          setSelectedMonitorId(null)
          setPerfilMonitor(null)
        }}
      />
    </div>
  )
}

