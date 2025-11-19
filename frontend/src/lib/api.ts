const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'Monitor' | 'Estudiante';
  university: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Agregar token si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText || 'Error en la petición',
        }));
        throw {
          message: errorData.message || 'Error en la petición',
          statusCode: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }
      throw {
        message: 'Error de conexión con el servidor',
        statusCode: 0,
      } as ApiError;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<any> {
    return this.request<any>('/auth/profile', {
      method: 'GET',
    });
  }

  // Monitorías Personalizadas
  async getMonitoriasPersonalizadas(monitorId: string): Promise<any[]> {
    return this.request<any[]>(`/monitorias-personalizadas/monitor/${monitorId}`, {
      method: 'GET',
    });
  }

  async createMonitoriaPersonalizada(data: {
    curso: string;
    precioPorHora: number;
    descripcion: string;
  }): Promise<any> {
    return this.request<any>('/monitorias-personalizadas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMonitoriaPersonalizada(id: string, data: {
    curso: string;
    precioPorHora: number;
    descripcion: string;
  }): Promise<any> {
    return this.request<any>(`/monitorias-personalizadas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMonitoriaPersonalizada(id: string): Promise<void> {
    return this.request<void>(`/monitorias-personalizadas/${id}`, {
      method: 'DELETE',
    });
  }

  // Monitorías Grupales
  async getMonitoriasGrupales(monitorId: string): Promise<any[]> {
    return this.request<any[]>(`/monitorias-grupales/monitor/${monitorId}`, {
      method: 'GET',
    });
  }

  async createMonitoriaGrupal(data: {
    curso: string;
    recurrencia: 'dos-a-la-semana' | 'una-a-la-semana' | 'una-cada-dos-semanas';
    diasYHorarios: { dia: string; hora: string }[];
    aforoMaximo?: number | 'ilimitado';
  }): Promise<any> {
    return this.request<any>('/monitorias-grupales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMonitoriaGrupal(id: string, data: {
    curso: string;
    recurrencia: 'dos-a-la-semana' | 'una-a-la-semana' | 'una-cada-dos-semanas';
    diasYHorarios: { dia: string; hora: string }[];
    aforoMaximo?: number | 'ilimitado';
  }): Promise<any> {
    return this.request<any>(`/monitorias-grupales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMonitoriaGrupal(id: string): Promise<void> {
    return this.request<void>(`/monitorias-grupales/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getMonitorDashboard(): Promise<any> {
    return this.request<any>('/dashboard/monitor', {
      method: 'GET',
    });
  }

  // Solicitudes
  async updateSolicitudEstado(id: string, estado: 'aceptada' | 'rechazada'): Promise<any> {
    return this.request<any>(`/solicitudes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    });
  }

  async createSolicitud(data: {
    fecha: string;
    horario: string;
    curso: string;
    espacio: string;
    tipo: 'personalizada' | 'grupal';
    monitorId: string;
    monitoriaGrupalId?: string;
    monitoriaPersonalizadaId?: string;
  }): Promise<any> {
    return this.request<any>('/solicitudes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Monitorías Disponibles
  async getMonitoriasGrupalesDisponibles(): Promise<any[]> {
    return this.request<any[]>('/monitorias-grupales/disponibles', {
      method: 'GET',
    });
  }

  async getMonitoriasPersonalizadasDisponibles(): Promise<any[]> {
    return this.request<any[]>('/monitorias-personalizadas/disponibles', {
      method: 'GET',
    });
  }

  // Confirmar Asistencia
  async confirmarAsistenciaGrupal(monitoriaGrupalId: string): Promise<any> {
    return this.request<any>(`/monitorias-confirmadas/grupal/${monitoriaGrupalId}/confirmar`, {
      method: 'POST',
    });
  }

  // Usuarios
  async getUserProfile(userId: string): Promise<any> {
    return this.request<any>(`/users/${userId}`, {
      method: 'GET',
    });
  }

  // Dashboard Estudiante
  async getEstudianteDashboard(): Promise<any> {
    return this.request<any>('/dashboard/estudiante', {
      method: 'GET',
    });
  }

  async getMonitoriasConfirmadasEstudiante(estudianteId: string): Promise<any[]> {
    return this.request<any[]>(`/monitorias-confirmadas/estudiante/${estudianteId}`, {
      method: 'GET',
    });
  }

  // Ratings
  async rateMonitoria(monitoriaConfirmadaId: string, score: number, comentario?: string): Promise<any> {
    return this.request<any>('/ratings', {
      method: 'POST',
      body: JSON.stringify({ monitoriaConfirmadaId, score, comentario }),
    });
  }

  async getRatingsByMonitor(monitorId: string): Promise<any[]> {
    return this.request<any[]>(`/ratings/monitor/${monitorId}`, { method: 'GET' });
  }

  async getRatingsByMonitoria(monitoriaConfirmadaId: string): Promise<any[]> {
    return this.request<any[]>(`/ratings/monitoria/${monitoriaConfirmadaId}`, { method: 'GET' });
  }

  async getMyRatingForMonitoria(monitoriaConfirmadaId: string): Promise<any | null> {
    return this.request<any>(`/ratings/monitoria/${monitoriaConfirmadaId}/mine`, { method: 'GET' });
  }
}

export const api = new ApiClient();
