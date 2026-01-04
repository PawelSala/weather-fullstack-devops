# Weather App (Full Stack)

Kompletna aplikacja pogodowa typu Full Stack, składająca się z frontendu (React), backendu (Express) oraz bazy danych (PostgreSQL). System umożliwia wyszukiwanie pogody (OpenWeather API) oraz trwałe zapisywanie ulubionych lokalizacji.

## Funkcje aplikacji

*   **Wyszukiwanie pogody**: Aktualne dane pogodowe dla dowolnego miasta.
*   **Ulubione lokalizacje**: Dodawanie i usuwanie miast z listy ulubionych (trwały zapis w bazie danych).
*   **Responsywność**: Dostosowany interfejs dla urządzeń mobilnych i desktopowych.
*   **Architektura**: Podział na frontend i backend, komunikacja przez REST API.
*   **Konteneryzacja**: Pełne środowisko uruchomieniowe w Dockerze.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Redux Toolkit.
*   **Backend**: Node.js, Express, TypeScript, `pg` (PostgreSQL client).
*   **Baza danych**: PostgreSQL 16.
*   **CI/CD**: GitHub Actions, GitHub Container Registry (GHCR).
*   **Infrastruktura**: Docker, Docker Compose.

## Struktura Repozytorium

*   `frontend/` - Kod źródłowy aplikacji klienckiej.
*   `backend/` - Kod źródłowy serwera API.
*   `docker-compose.yml` - Definicja usług dla Docker Compose (DB, Backend, Frontend).
*   `.github/` - Konfiguracja CI/CD (Workflowy i Custom Actions).

## Uruchomienie Lokalne

### 1. Full Stack (Docker) - Zalecane

Najprostszy sposób na uruchomienie całego systemu.

```bash
docker compose up --build
```

Dostępne usługi:
*   **Frontend**: [http://localhost:8080](http://localhost:8080)
*   **Backend API**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
*   **Baza danych**: `localhost:5432`

### 2. Tryb Deweloperski (Bez Dockera)

Wymaga zainstalowanego Node.js oraz działającej instancji PostgreSQL (np. z Dockera).

**Baza danych:**
```bash
docker compose up -d db
```

**Backend:**
```bash
cd backend
cp .env.example .env  # Upewnij się, że DATABASE_URL pasuje
npm ci
npm run dev
```

**Frontend:**
```bash
cd frontend
npm ci
npm run dev
```
*Frontend będzie dostępny pod adresem wskazanym przez Vite (zazwyczaj http://localhost:5173).*

## Konfiguracja ENV

### Backend (`backend/.env`)

```ini
PORT=3000
DATABASE_URL=postgres://app:app@localhost:5432/app
```
*W Dockerze `DATABASE_URL` jest nadpisywane automatycznie na host `db`.*

### Frontend (`frontend/.env`)

Jeśli aplikacja wymaga klucza API do OpenWeatherMap, należy go dodać w pliku `.env` (lub `.env.local`) we frontendzie:
```ini
VITE_OPENWEATHER_API_KEY=twoj_klucz_api
```

## Dokumentacja API Backend

Serwer wystawia następujące endpointy REST:

*   `GET /api/health`
    *   Zwraca status serwera: `{ "ok": true }`
*   `GET /api/favorites`
    *   Zwraca listę ulubionych miast.
*   `POST /api/favorites`
    *   Dodaje miasto do ulubionych (Upsert).
    *   **Body**:
        ```json
        {
          "cityId": "warsaw",
          "cityName": "Warsaw",
          "country": "PL",
          "lat": 52.2297,
          "lon": 21.0122
        }
        ```
*   `DELETE /api/favorites/:cityId`
    *   Usuwa miasto z ulubionych na podstawie `cityId`.

## Schemat Bazy Danych

Tabela `favorites`:

| Kolumna      | Typ              | Opis                                      |
| :----------- | :--------------- | :---------------------------------------- |
| `city_id`    | TEXT (PK)        | Unikalny identyfikator miasta (np. nazwa) |
| `city_name`  | TEXT             | Wyświetlana nazwa miasta                  |
| `country`    | TEXT             | Kod kraju                                 |
| `lat`        | DOUBLE PRECISION | Szerokość geograficzna                    |
| `lon`        | DOUBLE PRECISION | Długość geograficzna                      |
| `created_at` | TIMESTAMPTZ      | Data dodania (domyślnie `NOW()`)          |

## CI/CD (GitHub Actions)

Projekt posiada w pełni zautomatyzowany pipeline CI/CD.

### Workflowy

1.  **PR (`pr.yml`)**:
    *   Uruchamiany na Pull Request do `main`.
    *   Wywołuje reusable workflow `_ci.yml`.
    *   Waliduje frontend i backend (lint, test, build).
2.  **Main (`main.yml`)**:
    *   Uruchamiany po merge'u do `main`.
    *   Wywołuje reusable workflow `_ci.yml`.
    *   Buduje obrazy Docker (multi-stage).
    *   Publikuje obrazy do **GitHub Container Registry (GHCR)**.

### Custom Action

Zdefiniowano własną akcję `.github/actions/node-ci/action.yml`, która:
*   Ustawia środowisko Node.js.
*   Obsługuje cache dla `npm`.
*   Instaluje zależności (`npm ci`).
*   Jest używana w obu workflowach (`_ci.yml`) dla zachowania spójności (DRY).

### Obrazy w GHCR

Obrazy można znaleźć w zakładce **Packages** na stronie głównej repozytorium (GitHub → repo → Packages).

*   `ghcr.io/<user>/<repo>-frontend:latest`
*   `ghcr.io/<user>/<repo>-backend:latest`


## Troubleshooting

1.  **Brak danych pogodowych**: Sprawdź czy zdefiniowano poprawny klucz `VITE_OPENWEATHER_API_KEY` w pliku `.env`.
2.  **Porty zajęte**: Upewnij się, że porty 8080, 3000 lub 5432 nie są zajęte przez inne procesy.
3.  **Reset bazy danych**: Aby wyczyścić dane i zacząć od nowa:
    ```bash
    docker compose down -v
    docker compose up --build
    ```
3.  **Błąd uprawnień GHCR**: Jeśli workflow `main` nie może wypchnąć obrazu, sprawdź czy w `main.yml` są uprawnienia:
    ```yaml
    permissions:
      packages: write
    ```


