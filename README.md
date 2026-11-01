# Notes (Docker)

Приложение «Заметки» (Express + Sequelize/PostgreSQL + React/Vite + Socket.IO),
запускаемое в контейнерах Docker Compose.

## Запуск
1. Скопировать `.env.example` в `.env` и задать значения.
2. Выполнить `docker compose up --build`.
3. Открыть http://localhost (проверка backend: http://localhost:5000/health).

Остановка: `docker compose down` (данные сохраняются в томе `pgdata`).
Полный сброс вместе с данными: `docker compose down -v`.

## Состав
- `db`: PostgreSQL 15, данные в томе `pgdata`, healthcheck `pg_isready`.
- `backend`: Node.js/Express, миграции применяются при старте, healthcheck `/health`.
- `frontend`: React (сборка Vite) на Nginx; Nginx проксирует `/api` и `/socket.io` на backend.

## Сети
- `backend-net`: db и backend (БД недоступна снаружи);
- `frontend-net`: backend и frontend.