# ClassMate Backend (NestJS)

API que soporta el frontend de ClassMate.

## Requisitos
- Node.js 20+
- MongoDB (local o Docker). Con docker-compose ya se incluye un servicio `mongodb`.

## Variables de entorno
Ver `.env.example`.

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| MONGODB_URI | Cadena conexión Mongo | mongodb://localhost:27017/classmate |
| JWT_SECRET | Secreto JWT | dev-secret |
| PORT | Puerto HTTP | 3001 |

## Instalación y ejecución local
```bash
cd backend
npm install
npm run build
npm run start:dev
```
Con Docker (todo el stack):
```bash
docker compose up -d --build
```

## Seed de datos
Una vez levantado el backend (y Mongo disponible):
```bash
curl -X POST http://localhost:3001/seed/run
```
Crea un monitor, monitorías personalizadas y grupales de ejemplo.

## Autenticación
JWT Bearer. Al registrarse o hacer login se devuelve `{ access_token }`.
Enviar el token en `Authorization: Bearer <token>`.

## Endpoints principales

### Salud
GET `/health` => `{ status: 'ok', timestamp }`

### Auth
POST `/auth/register` (body: name,email,password,role,university[,avatar])
POST `/auth/login` (body: email,password)
GET  `/auth/profile` (token) => payload básico del usuario

### Users
POST `/users` (crear usuario genérico - útil para scripts)
GET  `/users/monitors` (lista monitores)
GET  `/users/:id`

### Monitorías Personalizadas
POST `/monitorias-personalizadas` (token Monitor) body: {curso,precioPorHora,descripcion}
GET  `/monitorias-personalizadas/monitor/:monitorId`

### Monitorías Grupales
POST `/monitorias-grupales` (token Monitor) body: {curso,recurrencia,diasYHorarios:[{dia,hora}],aforoMaximo<'ilimitado'|number>}
GET  `/monitorias-grupales/monitor/:monitorId`

### Solicitudes
POST `/solicitudes` (token Estudiante) body: {fecha,horario,curso,espacio,tipo,monitorId,[monitoriaGrupalId|monitoriaPersonalizadaId]}
GET  `/solicitudes/monitor/:monitorId` (lista pendientes del monitor)
PATCH `/solicitudes/:id/estado` body: {estado:'aceptada'|'rechazada'}

### Monitorías Confirmadas
POST `/monitorias-confirmadas` (token Monitor) body: {fecha,horario,curso,espacio,tipo,[monitoriaPersonalizadaId|monitoriaGrupalId]}
GET  `/monitorias-confirmadas/monitor/:monitorId`
GET  `/monitorias-confirmadas/estudiante/:estudianteId`

### Dashboard
GET `/dashboard/monitor/:monitorId` => { monitoriasConfirmadasEstaSemana, proximaMonitoria, totalMonitoriasDadas, calificacionMedia }

## Mapeo con tipos del Frontend
- User.role => "Monitor" | "Estudiante"
- MonitoriaPersonalizada => colección `monitoriaspersonalizadas`
- MonitoriaGrupal.aforoMaximo => number | "ilimitado" (internamente string)
- Solicitud => estados: pendiente/aceptada/rechazada
- MonitoriaConfirmada => estudiantes (array {id,name})

## Próximos pasos sugeridos
1. Añadir calificaciones (ratings) y endpoint POST rating.
2. Validar solapamiento de horarios en monitorías confirmadas.
3. Paginación y filtros (curso, monitor, fecha).
4. Seguridad: password hashing ya presente (bcrypt), agregar refresh tokens.
5. Tests unitarios con Jest.

## Ejemplos rápidos
Registro monitor:
```bash
curl -X POST http://localhost:3001/auth/register -H "Content-Type: application/json" -d '{"name":"Dr. Sebastian","email":"sebas@example.com","password":"pass","role":"Monitor","university":"ICESI"}'
```
Crear monitoría grupal (usar token):
```bash
curl -X POST http://localhost:3001/monitorias-grupales -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"curso":"APO 3","recurrencia":"una-a-la-semana","diasYHorarios":[{"dia":"Jueves","hora":"13:00"}],"aforoMaximo":20}'
```

