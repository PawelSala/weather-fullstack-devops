# Projekt Monorepo

To repozytorium zawiera kod źródłowy aplikacji (frontend oraz backend).

## Struktura

- `frontend/` - Aplikacja kliencka (Vite + React + TS)
- `backend/` - Backend aplikacji (Express + TS + Postgres)

## Frontend

### Uruchomienie deweloperskie

```bash
cd frontend
npm ci
npm run dev
```

### Budowanie wersji produkcyjnej

```bash
cd frontend
npm ci
npm run build
```

## Local dev (DB + backend)

1. Uruchom bazę danych:
   ```bash
   docker compose up -d
   ```

2. Uruchom backend:
   ```bash
   cd backend
   npm ci
   # Skopiuj przykładowy plik .env (lub ustaw zmienne środowiskowe ręcznie)
   cp .env.example .env 
   npm run dev
   ```

3. Testowanie API (curl):
   ```bash
   # Health check
   curl http://localhost:3000/api/health

   # Dodaj ulubione miasto
   curl -X POST http://localhost:3000/api/favorites -H "Content-Type: application/json" -d "{\"cityId\":\"warsaw\",\"cityName\":\"Warsaw\",\"country\":\"PL\",\"lat\":52.2297,\"lon\":21.0122}"

   # Pobierz listę ulubionych
   curl http://localhost:3000/api/favorites

   # Usuń ulubione miasto
   curl -X DELETE http://localhost:3000/api/favorites/warsaw
   ```

## Run full stack (Docker)

Uruchomienie całego systemu (baza danych + backend + frontend) w kontenerach:

```bash
docker compose up --build
```

Dostępne usługi:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api/health

## CI/CD (GitHub Actions)

Projekt wykorzystuje GitHub Actions do automatyzacji procesów CI/CD.

### Workflowy

1. **PR (`pr.yml`)**:
   - Uruchamiany przy każdym Pull Request do gałęzi `main`.
   - Wykonuje walidację kodu (lint, test, build) dla frontendu i backendu.
   - Wykorzystuje reusable workflow `_ci.yml`.

2. **Main (`main.yml`)**:
   - Uruchamiany po zmergowaniu zmian do gałęzi `main`.
   - Wykonuje walidację kodu (lint, test, build).
   - Buduje obrazy Docker dla frontendu i backendu.
   - Publikuje obrazy do GitHub Container Registry (GHCR).

### Obrazy Docker

Obrazy są dostępne w GitHub Packages repozytorium:
- `ghcr.io/<user>/<repo>-frontend:latest`
- `ghcr.io/<user>/<repo>-backend:latest`

### Custom Actions

W projekcie zdefiniowano własną akcję kompozytową `.github/actions/node-ci`, która standaryzuje konfigurację środowiska Node.js i instalację zależności.


