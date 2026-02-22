# Marketing Management Web Application

## Overview
A production-ready FastAPI web app for marketing management, featuring JWT authentication, lead and campaign management, MongoDB integration, and Docker orchestration.

## Features
- User registration, login, JWT authentication, role-based access
- Lead CRUD, status tracking, search/filter
- Campaign creation, lead assignment, statistics
- MongoDB container, PyMongo ORM
- Pydantic validation, structured logging, CORS
- Multi-stage Dockerfile, Docker Compose

## Setup Instructions

### 1. Clone the repository
```
git clone <repo-url>
cd App.Test
```

### 2. Environment Configuration
Edit `.env` for DB and JWT settings.

### 3. Build Docker Images
```
docker build -t fastapi_app .
```

### 4. Start with Docker Compose
```
docker-compose up --build
```

### 5. API Usage Examples
#### Register
```
POST /auth/register
{
  "email": "user@example.com",
  "password": "yourpassword",
  "role": "Admin"
}
```
#### Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
#### Create Lead
```
POST /leads/
{
  "name": "John Doe",
  "email": "john@example.com",
  "status": "New"
}
```
#### Create Campaign
```
POST /campaigns/
{
  "name": "Spring Sale",
  "description": "Discounts for spring"
}
```

## Folder Structure
- app/
  - main.py
  - models/
  - routes/
  - services/
  - core/
  - utils/
  - config/
- .env
- requirements.txt
- Dockerfile
- docker-compose.yml

## Notes
- Run as non-root user in container
- MongoDB data persisted via volume
- All API endpoints use Pydantic validation
- Logging and exception handling included
