# syntax=docker/dockerfile:1

# --- Build stage ---
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt ./
RUN pip install --user --no-cache-dir -r requirements.txt

# --- Production image ---
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY marketing_service/app.py ./app.py
COPY ui/templates ./ui/templates
EXPOSE 5000
CMD ["python", "app.py"]
