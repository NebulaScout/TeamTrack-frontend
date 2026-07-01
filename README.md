# TeamTrack Frontend

TeamTrack Frontend is a React + Vite single-page application for managing projects, tasks, users, teams, calendar events, notifications, and admin workflows. It talks to a separate backend API and uses token-based authentication for protected routes and user sessions.

## What’s in the repo

- `src/pages/` contains the top-level screens such as Dashboard, Projects, Tasks, Team, Calendar, Reports, Settings, Login, and Register.
- `src/components/` contains reusable UI pieces, modals, sheets, tables, and dashboard widgets.
- `src/services/` contains the API clients used to call the backend.
- `src/contexts/` contains shared app state such as authentication.
- `src/utils/` contains formatters, mappers, and helpers for working with backend data.
- `src/styles/` contains the CSS module styles for the different views.

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- TanStack Query
- React Hook Form + Zod
- Recharts

## Prerequisites

- Node.js 18 or newer
- npm
- The TeamTrack backend running locally or reachable over the network

## Backend Repository

The backend for this frontend lives in the separate TeamTrack repository: [NebulaScout/TeamTrack](https://github.com/NebulaScout/TeamTrack).

That project is a Django 5.2 REST API with JWT authentication, role-based access control, and MySQL support. It exposes the API endpoints consumed by this frontend.

Typical backend setup:

1. Clone the backend repository.
2. Create and activate a Python virtual environment.
3. Install backend dependencies with `pip install -r requirements.txt`.
4. Configure the backend `.env` file with values such as `SECRET_KEY`, `DEBUG`, `BASE_URL`, and MySQL credentials.
5. Create the MySQL database and run migrations.
6. Run `python manage.py init_roles` and, if needed, `python manage.py createsuperuser`.
7. Start the backend with `python manage.py runserver`.

The backend runs by default at `http://127.0.0.1:8000` unless you change its configuration.

## Getting Started

1. Install dependencies:

	```bash
	npm install
	```

2. Create a `.env` file in the project root and point it at your backend API:

	```bash
	VITE_TEAM_TRACK_API_BASE_URL=http://localhost:8000
	```

	You can also use `VITE_API_BASE_URL` if that is what your backend setup already expects.

	If the backend is running on another host or port, replace the URL with that backend base address.

3. Start the frontend:

	```bash
	npm run dev
	```

4. Open the local Vite URL shown in the terminal.

## Backend Connection

The frontend reads its API base URL from `VITE_TEAM_TRACK_API_BASE_URL` first, then falls back to `VITE_API_BASE_URL`. The request client is defined in [src/services/APIService.js](src/services/APIService.js) and all API calls are built on top of that shared client.

The backend also defines its own `BASE_URL` in `.env`, which should match the URL where the Django app is reachable.

The app expects the backend to expose TeamTrack endpoints under `/api/v1`, including:

- `/api/v1/auth/login/`
- `/api/v1/auth/logout/`
- `/api/v1/auth/me/`
- `/api/token/`
- `/api/token/refresh/`
- `/api/v1/accounts/register/`
- `/api/v1/projects/`
- `/api/v1/tasks/`
- `/api/v1/dashboard/`

Other frontend features also rely on these backend areas:

- `/api/v1/accounts/` for user and account data
- `/api/v1/calendar/events/` for calendar features
- `/api/v1/notifications/` for notifications
- `/api/v1/dashboard/admin/` for admin dashboards and analytics

The auth flow stores `accessToken` and `refreshToken` in `localStorage`. If the access token expires, the client automatically tries to refresh it through `/api/token/refresh/`.

### Connecting to a separate backend repo

If the backend lives in another repository, the usual workflow is:

1. Clone and run the backend repo first.
2. Confirm the backend is reachable at a base URL such as `http://localhost:8000`.
3. Set `VITE_TEAM_TRACK_API_BASE_URL` in this frontend’s `.env` file to that backend URL.
4. Restart the frontend dev server so Vite picks up the new environment variable.

If you keep both repos locally, a common layout is to run the backend on `http://127.0.0.1:8000` and the frontend on Vite’s default dev server port. The frontend only needs the backend API root, not the backend repository path itself.

If the backend uses a different host, port, or path prefix, update the env var to match the backend’s public API root.

## Available Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint across the project.

## Notes

- The app is designed to work with JWT-style auth and protected routes.
- Some UI features depend on backend data shapes, so backend and frontend changes should stay in sync.
- If you add new backend endpoints, keep the base URL configured through the env file rather than hard-coding it in the frontend.
