import {
  User,
  MonitoriaPersonalizada,
  MonitoriaGrupal,
  SolicitudMonitoria,
  MonitoriaConfirmada,
  DashboardStats,
  MonitoriaDisponible,
  PerfilMonitor,
  MonitoriaEstudiante,
} from "@/types"

export const mockUser: User = {
  id: "1",
  name: "Dr. Sebastián Escobar",
  email: "sebastian.escobar@example.com",
  role: "Monitor",
  university: "ICESI",
}

export const mockMonitoriasPersonalizadas: MonitoriaPersonalizada[] = [
  {
    id: "1",
    curso: "APO 1",
    precioPorHora: 25000,
    descripcion: "Monitoría personalizada para APO 1, enfocada en fundamentos de programación orientada a objetos.",
    monitorId: "1",
  },
  {
    id: "2",
    curso: "Estructuras de Datos",
    precioPorHora: 30000,
    descripcion: "Ayuda con estructuras de datos avanzadas, árboles, grafos y algoritmos de ordenamiento.",
    monitorId: "1",
  },
]

export const mockMonitoriasGrupales: MonitoriaGrupal[] = [
  {
    id: "1",
    curso: "APO 3",
    recurrencia: "una-a-la-semana",
    diasYHorarios: [
      {
        dia: "Jueves",
        hora: "13:00",
      },
    ],
    aforoMaximo: 20,
    monitorId: "1",
  },
  {
    id: "2",
    curso: "Base de Datos",
    recurrencia: "dos-a-la-semana",
    diasYHorarios: [
      {
        dia: "Lunes",
        hora: "10:00",
      },
      {
        dia: "Miércoles",
        hora: "10:00",
      },
    ],
    aforoMaximo: "ilimitado",
    monitorId: "1",
  },
]

export const mockSolicitudes: SolicitudMonitoria[] = [
  {
    id: "1",
    fecha: "2024-01-15",
    horario: "14:00",
    curso: "APO 1",
    estudiante: {
      id: "2",
      name: "Juan Pérez",
      email: "juan.perez@example.com",
    },
    espacio: "Sala 201",
    tipo: "personalizada",
    estado: "pendiente",
    tieneConflicto: false,
  },
  {
    id: "2",
    fecha: "2024-01-15",
    horario: "13:00",
    curso: "APO 3",
    estudiante: {
      id: "3",
      name: "María García",
      email: "maria.garcia@example.com",
    },
    espacio: "Aula 305",
    tipo: "grupal",
    monitoriaGrupalId: "1",
    estado: "pendiente",
    tieneConflicto: true,
  },
  {
    id: "3",
    fecha: "2024-01-16",
    horario: "15:00",
    curso: "Estructuras de Datos",
    estudiante: {
      id: "4",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
    },
    espacio: "Laboratorio 102",
    tipo: "personalizada",
    estado: "pendiente",
    tieneConflicto: false,
  },
]

export const mockMonitoriasConfirmadas: MonitoriaConfirmada[] = [
  {
    id: "1",
    fecha: "2024-01-15",
    horario: "13:00",
    curso: "APO 3",
    espacio: "Aula 305",
    tipo: "grupal",
    monitoriaGrupalId: "1",
    estudiantes: [
      { id: "5", name: "Ana López" },
      { id: "6", name: "Pedro Martínez" },
      { id: "7", name: "Laura Sánchez" },
    ],
  },
  {
    id: "2",
    fecha: "2024-01-15",
    horario: "16:00",
    curso: "APO 1",
    espacio: "Sala 201",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "1",
    estudiantes: [{ id: "8", name: "Diego Torres" }],
  },
  {
    id: "3",
    fecha: "2024-01-16",
    horario: "10:00",
    curso: "Base de Datos",
    espacio: "Aula 205",
    tipo: "grupal",
    monitoriaGrupalId: "2",
    estudiantes: [
      { id: "9", name: "Sofía Ramírez" },
      { id: "10", name: "Andrés Gómez" },
    ],
  },
]

export const mockDashboardStats: DashboardStats = {
  monitoriasConfirmadasEstaSemana: 8,
  proximaMonitoria: {
    fecha: "2024-01-15",
    horario: "13:00",
    ubicacion: "Aula 305",
    curso: "APO 3",
  },
  totalMonitoriasDadas: 142,
  calificacionMedia: 4.5,
}

export const mockEstudiante: User = {
  id: "2",
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  role: "Estudiante",
  university: "ICESI",
}

// Helper para obtener fechas relativas
const getDateString = (daysFromToday: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split("T")[0]
}

export const mockMonitoriasEstudiante: MonitoriaEstudiante[] = [
  {
    id: "e1",
    fecha: getDateString(3), // 3 días desde hoy
    horario: "13:00",
    curso: "APO 3",
    espacio: "Aula 305",
    tipo: "grupal",
    monitoriaGrupalId: "1",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e2",
    fecha: getDateString(3), // 3 días desde hoy - mismo día que e1
    horario: "16:00",
    curso: "APO 1",
    espacio: "Sala 201",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "1",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e3",
    fecha: getDateString(3), // 3 días desde hoy - mismo día que e1 y e2 (para probar "Ver todas")
    horario: "18:00",
    curso: "Estructuras de Datos",
    espacio: "Laboratorio 102",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "2",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e4",
    fecha: getDateString(3), // 3 días desde hoy - mismo día (4ta monitoría)
    horario: "19:30",
    curso: "Algoritmos",
    espacio: "Aula 401",
    tipo: "grupal",
    monitoriaGrupalId: "3",
    monitor: {
      id: "3",
      name: "María González",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e5",
    fecha: getDateString(5), // 5 días desde hoy
    horario: "10:00",
    curso: "Base de Datos",
    espacio: "Aula 205",
    tipo: "grupal",
    monitoriaGrupalId: "2",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e6",
    fecha: getDateString(5), // 5 días desde hoy - mismo día que e5
    horario: "14:00",
    curso: "Redes",
    espacio: "Laboratorio 301",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "3",
    monitor: {
      id: "4",
      name: "Carlos Ramírez",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e7",
    fecha: getDateString(5), // 5 días desde hoy - mismo día (3ra monitoría)
    horario: "16:00",
    curso: "Sistemas Operativos",
    espacio: "Aula 303",
    tipo: "grupal",
    monitoriaGrupalId: "4",
    monitor: {
      id: "5",
      name: "Ana Martínez",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e8",
    fecha: getDateString(-5), // 5 días atrás
    horario: "10:00",
    curso: "Base de Datos",
    espacio: "Aula 205",
    tipo: "grupal",
    monitoriaGrupalId: "2",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
    },
    yaPaso: true,
    calificada: false,
  },
  {
    id: "e9",
    fecha: getDateString(3), // 3 días desde hoy - 5ta monitoría en este día
    horario: "20:30",
    curso: "Programación Web",
    espacio: "Aula 202",
    tipo: "grupal",
    monitoriaGrupalId: "5",
    monitor: {
      id: "6",
      name: "Luis Fernández",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e10",
    fecha: getDateString(5), // 5 días desde hoy - 4ta monitoría en este día
    horario: "18:00",
    curso: "Inteligencia Artificial",
    espacio: "Laboratorio 205",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "4",
    monitor: {
      id: "7",
      name: "Patricia López",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e11",
    fecha: getDateString(5), // 5 días desde hoy - 5ta monitoría en este día
    horario: "19:00",
    curso: "Seguridad Informática",
    espacio: "Aula 304",
    tipo: "grupal",
    monitoriaGrupalId: "6",
    monitor: {
      id: "8",
      name: "Roberto Silva",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e12",
    fecha: getDateString(7), // 7 días desde hoy
    horario: "09:00",
    curso: "APO 2",
    espacio: "Aula 301",
    tipo: "grupal",
    monitoriaGrupalId: "7",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e13",
    fecha: getDateString(7), // 7 días desde hoy - mismo día
    horario: "11:00",
    curso: "Cálculo Diferencial",
    espacio: "Aula 402",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "5",
    monitor: {
      id: "9",
      name: "Carmen Ruiz",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e14",
    fecha: getDateString(7), // 7 días desde hoy - mismo día (3ra monitoría)
    horario: "15:00",
    curso: "Física I",
    espacio: "Laboratorio 401",
    tipo: "grupal",
    monitoriaGrupalId: "8",
    monitor: {
      id: "10",
      name: "Javier Morales",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e15",
    fecha: getDateString(7), // 7 días desde hoy - mismo día (4ta monitoría)
    horario: "17:00",
    curso: "Química General",
    espacio: "Aula 501",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "6",
    monitor: {
      id: "11",
      name: "Isabel Torres",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e16",
    fecha: getDateString(10), // 10 días desde hoy
    horario: "10:00",
    curso: "Estadística",
    espacio: "Aula 203",
    tipo: "grupal",
    monitoriaGrupalId: "9",
    monitor: {
      id: "12",
      name: "Fernando Castro",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e17",
    fecha: getDateString(10), // 10 días desde hoy - mismo día
    horario: "12:00",
    curso: "Álgebra Lineal",
    espacio: "Aula 302",
    tipo: "personalizada",
    monitoriaPersonalizadaId: "7",
    monitor: {
      id: "13",
      name: "Mónica Vargas",
    },
    yaPaso: false,
    calificada: false,
  },
  {
    id: "e18",
    fecha: getDateString(10), // 10 días desde hoy - mismo día (3ra monitoría)
    horario: "14:00",
    curso: "Matemáticas Discretas",
    espacio: "Aula 403",
    tipo: "grupal",
    monitoriaGrupalId: "10",
    monitor: {
      id: "14",
      name: "Ricardo Peña",
    },
    yaPaso: false,
    calificada: false,
  },
]

export const mockMonitoriasDisponibles: MonitoriaDisponible[] = [
  // Grupales
  {
    id: "d1",
    curso: "APO 3",
    tipo: "grupal",
    fecha: "2024-01-22",
    horario: "13:00",
    espacio: "Aula 305",
    monitoriaGrupalId: "1",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
      calificacion: 4.5,
    },
    aforoMaximo: 20,
    estudiantesConfirmados: 12,
  },
  {
    id: "d2",
    curso: "Base de Datos",
    tipo: "grupal",
    fecha: "2024-01-20",
    horario: "10:00",
    espacio: "Aula 205",
    monitoriaGrupalId: "2",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
      calificacion: 4.5,
    },
    aforoMaximo: "ilimitado",
    estudiantesConfirmados: 8,
  },
  {
    id: "d3",
    curso: "Algoritmos",
    tipo: "grupal",
    fecha: "2024-01-18",
    horario: "14:00",
    espacio: "Laboratorio 301",
    monitoriaGrupalId: "3",
    monitor: {
      id: "3",
      name: "María González",
      calificacion: 4.8,
    },
    aforoMaximo: 15,
    estudiantesConfirmados: 10,
  },
  // Personalizadas
  {
    id: "d4",
    curso: "APO 1",
    tipo: "personalizada",
    precioPorHora: 25000,
    descripcion: "Monitoría personalizada para APO 1, enfocada en fundamentos de programación orientada a objetos.",
    monitoriaPersonalizadaId: "1",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
      calificacion: 4.5,
    },
  },
  {
    id: "d5",
    curso: "Estructuras de Datos",
    tipo: "personalizada",
    precioPorHora: 30000,
    descripcion: "Ayuda con estructuras de datos avanzadas, árboles, grafos y algoritmos de ordenamiento.",
    monitoriaPersonalizadaId: "2",
    monitor: {
      id: "1",
      name: "Dr. Sebastián Escobar",
      calificacion: 4.5,
    },
  },
  {
    id: "d6",
    curso: "Redes de Computadores",
    tipo: "personalizada",
    precioPorHora: 28000,
    descripcion: "Monitoría personalizada sobre protocolos de red, TCP/IP y arquitectura de redes.",
    monitoriaPersonalizadaId: "3",
    monitor: {
      id: "4",
      name: "Carlos Ramírez",
      calificacion: 4.7,
    },
  },
]

export const mockPerfilMonitor: PerfilMonitor = {
  id: "1",
  name: "Dr. Sebastián Escobar",
  email: "sebastian.escobar@example.com",
  calificacion: 4.5,
  monitoriasGrupales: mockMonitoriasGrupales,
  monitoriasPersonalizadas: mockMonitoriasPersonalizadas,
}

