"""
GGenius Website - Enhanced FastAPI Server
Революційна AI-платформа для кіберспорту MLBB

@version 2.0.0
@author MLBB-BOSS Team
@license MIT
"""

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, EmailStr, validator
import uvicorn
import os
import logging
from pathlib import Path
from typing import Optional, Dict, Any
import asyncio
import aiofiles
from datetime import datetime

# Налаштування логування
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Pydantic моделі для форм
class ContactForm(BaseModel):
    """Модель для контактної форми"""
    email: EmailStr
    game_id: Optional[str] = None
    interest: str
    message: str
    newsletter: bool = True
    
    @validator('message')
    def validate_message(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Повідомлення має містити мінімум 10 символів')
        if len(v) > 1000:
            raise ValueError('Повідомлення занадто довге (максимум 1000 символів)')
        return v.strip()
    
    @validator('interest')
    def validate_interest(cls, v):
        allowed_interests = [
            'tournaments', 'ai_coaching', 'team_building', 
            'nft_rewards', 'content_creation', 'beta_testing'
        ]
        if v not in allowed_interests:
            raise ValueError('Невідома область інтересів')
        return v

# Ініціалізація FastAPI додатку
app = FastAPI(
    title="GGenius - Революційна AI-платформа для MLBB",
    description="Де штучний інтелект зустрічається з геніальністю гравців",
    version="2.0.0",
    docs_url="/admin/docs",  # Прихована документація
    redoc_url="/admin/redoc",
    openapi_url="/admin/openapi.json"
)

# Middleware для оптимізації
app.add_middleware(
    GZipMiddleware,
    minimum_size=1000
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # У продакшні обмежити до конкретних доменів
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Налаштування шляхів
BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

# Перевірка існування директорій
if not STATIC_DIR.exists():
    logger.error(f"Статична директорія не знайдена: {STATIC_DIR}")
    raise RuntimeError(f"Директорія {STATIC_DIR} не існує")

if not TEMPLATES_DIR.exists():
    logger.warning(f"Директорія шаблонів не знайдена: {TEMPLATES_DIR}")
    TEMPLATES_DIR = STATIC_DIR  # Fallback до static

# Монтування статичних файлів
try:
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
    logger.info(f"Статичні файли змонтовані з {STATIC_DIR}")
except Exception as e:
    logger.error(f"Помилка монтування статичних файлів: {e}")
    raise

# Налаштування Jinja2
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Глобальні змінні для шаблонів
template_globals = {
    "site_name": "GGenius",
    "site_version": "2.0.0",
    "current_year": datetime.now().year,
    "meta_description": "Революційна AI-платформа для кіберспорту Mobile Legends: Bang Bang",
    "meta_keywords": "Mobile Legends, MLBB, кіберспорт, AI, штучний інтелект, турніри, геймінг",
    "social_links": {
        "discord": "https://discord.gg/ggenius",
        "telegram": "https://t.me/ggenius_official",
        "instagram": "https://instagram.com/ggenius.pro",
        "youtube": "https://youtube.com/@ggenius",
        "twitter": "https://twitter.com/ggenius_pro",
        "facebook": "https://facebook.com/ggenius.pro"
    }
}

@app.on_event("startup")
async def startup_event():
    """Ініціалізація при старті сервера"""
    logger.info("🚀 Запуск GGenius Website...")
    logger.info(f"📁 Статична директорія: {STATIC_DIR}")
    logger.info(f"📄 Директорія шаблонів: {TEMPLATES_DIR}")
    
    # Перевірка критичних файлів
    critical_files = [
        STATIC_DIR / "css" / "style.css",
        STATIC_DIR / "js" / "enhancements.js"
    ]
    
    for file_path in critical_files:
        if not file_path.exists():
            logger.warning(f"⚠️ Критичний файл не знайдено: {file_path}")
        else:
            logger.info(f"✅ Файл знайдено: {file_path}")

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def get_index(request: Request):
    """Головна сторінка сайту"""
    try:
        # Спробуємо використати шаблон, якщо він існує
        template_path = TEMPLATES_DIR / "index.html"
        if template_path.exists():
            return templates.TemplateResponse(
                "index.html", 
                {
                    "request": request,
                    **template_globals
                }
            )
        
        # Fallback до статичного файлу
        static_index = STATIC_DIR / "index.html"
        if static_index.exists():
            return FileResponse(
                static_index, 
                media_type="text/html",
                headers={
                    "Cache-Control": "public, max-age=3600",
                    "X-Content-Type-Options": "nosniff"
                }
            )
        
        # Генерація аварійного HTML
        emergency_html = await generate_emergency_html()
        return HTMLResponse(
            content=emergency_html,
            status_code=200,
            headers={"Content-Type": "text/html; charset=utf-8"}
        )
        
    except Exception as e:
        logger.error(f"Помилка обслуговування головної сторінки: {e}")
        raise HTTPException(status_code=500, detail="Внутрішня помилка сервера")

@app.post("/contact", response_class=JSONResponse)
async def submit_contact_form(form_data: ContactForm):
    """Обробка контактної форми"""
    try:
        # Логування отриманих даних
        logger.info(f"📝 Нова заявка: {form_data.email}, інтерес: {form_data.interest}")
        
        # Тут можна додати збереження в базу даних або відправку email
        # Поки що просто логуємо
        
        # Симуляція обробки
        await asyncio.sleep(0.1)
        
        return JSONResponse(
            content={
                "success": True,
                "message": "Дякуємо за інтерес до GGenius! Ми зв'яжемося з вами найближчим часом.",
                "next_step": "Очікуйте на email з деталями про ранній доступ"
            },
            status_code=200
        )
        
    except Exception as e:
        logger.error(f"Помилка обробки форми: {e}")
        return JSONResponse(
            content={
                "success": False,
                "message": "Виникла помилка при обробці форми. Спробуйте пізніше.",
                "error": str(e) if os.getenv("DEBUG") else None
            },
            status_code=400
        )

@app.get("/health", include_in_schema=False)
async def health_check():
    """Перевірка здоров'я сервера"""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "static_files": STATIC_DIR.exists(),
        "templates": TEMPLATES_DIR.exists()
    }

@app.get("/api/stats", response_class=JSONResponse)
async def get_stats():
    """API для отримання статистики платформи"""
    # Поки що статичні дані, пізніше з бази даних
    return {
        "registered_users": 1250,
        "tournaments_held": 47,
        "total_matches": 15420,
        "prize_pool": "$125,000",
        "ai_analyses": 89340,
        "last_updated": datetime.now().isoformat()
    }

async def generate_emergency_html() -> str:
    """Генерація аварійного HTML, якщо файли не знайдені"""
    return """
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GGenius - Революційна AI-платформа для MLBB</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0a0c10 0%, #1a1d23 100%);
            color: #E8E6E3;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
        }
        .logo {
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(135deg, #9C27B0, #FF2E97);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        .subtitle {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .status {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 600px;
        }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #FF2E97;
            animation: spin 1s ease-in-out infinite;
            margin-right: 0.5rem;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="logo">GGenius</div>
    <div class="subtitle">Революційна AI-платформа для Mobile Legends: Bang Bang</div>
    <div class="status">
        <div class="loading"></div>
        Ініціалізація платформи...
        <br><br>
        Завантажуємо компоненти системи штучного інтелекту
    </div>
    <script>
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    </script>
</body>
</html>
    """

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    debug_mode = os.environ.get("DEBUG", "false").lower() == "true"
    
    logger.info(f"🚀 Запуск сервера на порту {port}")
    logger.info(f"🐛 Режим відладки: {debug_mode}")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        reload=debug_mode,
        access_log=debug_mode
)
