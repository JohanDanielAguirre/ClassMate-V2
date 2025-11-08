export type UserRole = "Monitor" | "Estudiante"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  university: string
  avatar?: string
}

export interface MonitoriaPersonalizada {
  id: string
  curso: string
  precioPorHora: number
  descripcion: string
  monitorId: string
}

export interface MonitoriaGrupal {
  id: string
  curso: string
  recurrencia: "dos-a-la-semana" | "una-a-la-semana" | "una-cada-dos-semanas"
  diasYHorarios: Array<{
    dia: string // "Lunes", "Martes", etc.
    hora: string // "14:00"
  }>
  aforoMaximo: number | "ilimitado"
  monitorId: string
}

export interface SolicitudMonitoria {
  id: string
  fecha: string
  horario: string
  curso: string
  estudiante: {
    id: string
    name: string
    email: string
  }
  espacio: string
  tipo: "personalizada" | "grupal"
  monitoriaGrupalId?: string
  estado: "pendiente" | "aceptada" | "rechazada"
  tieneConflicto?: boolean
}

export interface MonitoriaConfirmada {
  id: string
  fecha: string
  horario: string
  curso: string
  espacio: string
  tipo: "personalizada" | "grupal"
  estudiantes: Array<{
    id: string
    name: string
  }>
  monitoriaPersonalizadaId?: string
  monitoriaGrupalId?: string
}

export interface DashboardStats {
  monitoriasConfirmadasEstaSemana: number
  proximaMonitoria?: {
    fecha: string
    horario: string
    ubicacion: string
    curso: string
  }
  totalMonitoriasDadas: number
  calificacionMedia: number
}

export interface MonitoriaDisponible {
  id: string
  curso: string
  tipo: "personalizada" | "grupal"
  fecha?: string
  horario?: string
  precioPorHora?: number
  monitor: {
    id: string
    name: string
    calificacion: number
    avatar?: string
  }
  monitoriaPersonalizadaId?: string
  monitoriaGrupalId?: string
  descripcion?: string
  espacio?: string
  aforoMaximo?: number | "ilimitado"
  estudiantesConfirmados?: number
}

export interface SolicitudMonitoriaEstudiante {
  id: string
  fecha: string
  horario: string
  cantidadHoras: number
  monitoriaPersonalizadaId: string
  estudianteId: string
  estado: "pendiente" | "aceptada" | "rechazada"
}

export interface PerfilMonitor {
  id: string
  name: string
  email: string
  calificacion: number
  avatar?: string
  monitoriasGrupales: MonitoriaGrupal[]
  monitoriasPersonalizadas: MonitoriaPersonalizada[]
}

export interface MonitoriaEstudiante {
  id: string
  fecha: string
  horario: string
  curso: string
  espacio: string
  tipo: "personalizada" | "grupal"
  monitor: {
    id: string
    name: string
  }
  monitoriaPersonalizadaId?: string
  monitoriaGrupalId?: string
  yaPaso: boolean
  calificada: boolean
  calificacion?: number
}

