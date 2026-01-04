# Projekt Monorepo

To repozytorium zawiera kod źródłowy aplikacji (frontend oraz w przyszłości backend).

## Struktura

- `frontend/` - Aplikacja kliencka (Vite + React + TS)
- `backend/` - (Planowane) Backend aplikacji

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

Repozytorium jest przygotowane pod dodanie backendu w folderze `backend/`.
