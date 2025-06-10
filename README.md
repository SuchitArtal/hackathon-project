#Educational Skill Assessment Platform

A full-stack platform for personalized skill assessment and learning roadmap generation.

## Tech Stack

- **Frontend**: React.js (TypeScript) + Zustand + Tailwind CSS
- **Backend**: Express.js + Prisma ORM + PostgreSQL
- **Auth Service**: FastAPI + SQLModel + Alembic + JWT
- **AI Service**: FastAPI + GPT-4 Integration
- **Database**: PostgreSQL + Redis
- **Infrastructure**: Docker + Docker Compose + GitHub Actions

## Prerequisites

- Docker and Docker Compose
- Node.js (v18+) (for local frontend dev)
- Python (v3.11+) (for local FastAPI dev)

## Setup & Usage (Docker Compose)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/hackathon-project.git
   cd hackthon-project
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your secrets:
     ```bash
     cp .env.example .env
     # Edit .env with your DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, etc.
     ```
   - Example for Postgres:
     ```env
     DATABASE_URL=postgresql://bhaktisn:IDRP_jnanasetu@postgres:5432/bhaktisn
     JWT_SECRET=your_jwt_secret
     GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
     ```

3. **Start all services with Docker:**
   ```bash
   docker-compose up -d --build
   ```
   This will start Postgres, Redis, backend, frontend, auth-service, and ai-service.

4. **Run database migrations:**
   - **Backend (Prisma):**
     ```bash
     docker-compose exec backend npx prisma migrate deploy
     ```
   - **Auth Service (Alembic):**
     ```bash
     docker-compose exec auth-service alembic upgrade head
     ```

5. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api-docs
   - Auth Service API: http://localhost:8000/docs
   - AI Service API: http://localhost:8001/docs


## Running All Services Locally (Hot Reload)

If you want to run all services locally with hot-reloading:

1. **Stop all Docker containers:**
   ```bash
   docker-compose down
   ```

2. **Start Postgres and Redis in Docker:**
   ```bash
   docker-compose up -d postgres redis
   ```

3. **Run the backend locally:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will be available at http://localhost:3000.

4. **Run the auth-service locally:**
   ```bash
   cd auth-service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
   The auth-service will be available at http://localhost:8000.

5. **Run the ai-service locally:**
   ```bash
   cd ai-service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8001
   ```
   The ai-service will be available at http://localhost:8001.

6. **Run the frontend locally:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at http://localhost:5173 and will reload on code changes.

## Inspecting Users in PostgreSQL

To check user details in the Postgres container:
```bash
docker-compose exec postgres psql -U bhaktisn -d bhaktisn
```
Then in the psql prompt:
```sql
SELECT * FROM "user";
```

## Project Structure

```

├── frontend/           # React + TypeScript frontend
├── backend/            # Express.js backend
├── auth-service/       # FastAPI Auth service
├── ai-service/         # FastAPI AI service
├── docker/             # Docker configuration
└── docs/               # API documentation
```

## Troubleshooting

- **Database connection errors:**
  - Ensure `DATABASE_URL` uses `postgres` as the host, not `localhost`.
  - If you change the DB name, run `docker-compose down -v` to reset volumes.
- **Migrations not running:**
  - Make sure the service is healthy and the DB exists.
- **Environment variables not updating:**
  - Rebuild containers after changing `.env`: `docker-compose up -d --build`

## Development Guidelines

- Use feature branches and pull requests for all changes
- Follow TypeScript and Python best practices
- Implement proper error handling and validation
- Write unit tests for critical components
- Follow RESTful API design principles

## VS Code Extensions

Recommended extensions for development:
- ESLint
- Prettier
- TypeScript
- Docker
- PostgreSQL
- Python
- REST Client

## License

MIT License 


