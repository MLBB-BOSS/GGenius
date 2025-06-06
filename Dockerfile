# GGenius Website Dockerfile
FROM python:3.11-slim

# Встановлення системних залежностей
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Створення робочої директорії
WORKDIR /app

# Копіювання requirements
COPY website/requirements.txt .

# Встановлення Python залежностей
RUN pip install --no-cache-dir -r requirements.txt

# Копіювання коду додатку
COPY website/ ./website/

# Створення non-root користувача
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Експорт порту
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Запуск сервера
CMD ["python", "-m", "uvicorn", "website.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
