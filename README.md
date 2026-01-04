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
