# ClassMate-V2

ClassMate application built with NestJS backend, Next.js frontend, and MongoDB database. The project is fully dockerized for easy deployment and development.

## 🏗️ Project Structure

```
ClassMate-V2/
├── backend/          # NestJS backend API
│   ├── src/          # Source code
│   ├── Dockerfile    # Backend Docker configuration
│   └── package.json
├── frontend/         # Next.js frontend
│   ├── src/          # Source code
│   ├── Dockerfile    # Frontend Docker configuration
│   └── package.json
├── docker-compose.yml      # Production Docker Compose
└── docker-compose.dev.yml  # Development Docker Compose
```

## 🚀 Quick Start

### Prerequisites

- Docker
- Docker Compose
- Node.js 20+ (for local development)

### Running with Docker (Recommended)

#### Production Mode

1. Clone the repository:
```bash
git clone https://github.com/JohanDanielAguirre/ClassMate-V2.git
cd ClassMate-V2
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

4. Stop all services:
```bash
docker-compose down
```

#### Development Mode

1. Start services in development mode with hot reload:
```bash
docker-compose -f docker-compose.dev.yml up
```

2. Stop development services:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Running Locally (Without Docker)

#### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start MongoDB (you'll need MongoDB installed locally or use Docker):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

5. Run the backend:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

#### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Run the frontend:
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📦 Docker Commands

### Build images
```bash
docker-compose build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart services
```bash
docker-compose restart
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

## 🔧 Configuration

### Backend Environment Variables

Located in `backend/.env`:
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)
- `PORT`: Backend port (default: 3001)

### Frontend Environment Variables

Located in `frontend/.env.local`:
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 📚 Technology Stack

- **Backend**: NestJS (Node.js framework)
- **Frontend**: Next.js (React framework)
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## 🏃 Development

### Backend Development
```bash
cd backend
npm run start:dev  # Starts with hot reload
npm run lint       # Run linter
npm run format     # Format code
```

### Frontend Development
```bash
cd frontend
npm run dev        # Starts development server
npm run lint       # Run linter
```

## 🐳 Docker Architecture

The project uses a multi-service Docker setup:

1. **MongoDB**: Database service with persistent volume
2. **Backend**: NestJS API connected to MongoDB
3. **Frontend**: Next.js application connected to Backend

All services communicate through a custom Docker network (`classmate-network`).

## 📝 API Endpoints

### Backend API

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

