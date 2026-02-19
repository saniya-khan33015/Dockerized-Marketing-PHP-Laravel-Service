# Marketing Service (Python Flask)

This project containerizes a simple Flask-based Marketing service and a Postgres database using Docker and Docker Compose, following industry best practices for multi-stage builds and orchestration.

## Structure
- `marketing_service/` — Flask app and Dockerfile
- `docker-compose.yml` — Orchestrates app and database

## Usage

### 1. Build and Run
```sh
docker-compose up --build
```
- The Flask app will be available at http://localhost:5000
- The Postgres database will be available at localhost:5432

### 2. Stopping
```sh
docker-compose down
```

## Environment Variables
- App: `FLASK_APP`, `FLASK_ENV`
- DB: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

## Notes
- Multi-stage Dockerfile optimizes image size and security.
- Data is persisted in a Docker volume (`pgdata`).
- Update the Flask app to connect to the database as needed.
