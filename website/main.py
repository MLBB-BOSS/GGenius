from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os # Для отримання порту Heroku

# Ініціалізація FastAPI додатку
app = FastAPI(
    title="GGenius Website",
    description="Офіційний сайт-візитка проєкту GGenius.",
    version="0.1.0",
)

# Монтування статичних файлів
# Це дозволить отримувати доступ до файлів з папки 'static' через URL '/static'
# Наприклад, website/static/css/style.css буде доступний за /static/css/style.css
# Для index.html ми зробимо окремий ендпоінт
try:
    app.mount("/static", StaticFiles(directory="website/static"), name="static")
except RuntimeError as e:
    print(f"Помилка монтування статичних файлів: {e}")
    print("Переконайтесь, що директорія 'website/static' існує у корені проєкту.")

@app.get("/", include_in_schema=False)
async def get_index_html():
    """
    Обслуговує головну сторінку сайту (index.html).
    """
    index_path = "website/static/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"error": "index.html не знайдено"}, 404

# Тут можна додати логіку для запуску вашого Aiogram бота,
# але для початку зосередимось на сайті.
# Запуск бота в тому ж процесі, що й веб-сервер, може бути складним
# і зазвичай рекомендується запускати їх як окремі процеси.
# Для Heroku це означатиме різні типи процесів у Procfile.

if __name__ == "__main__":
    # Це для локального запуску, Heroku використовуватиме Procfile
    port = int(os.environ.get("PORT", 8000)) # Heroku надає змінну PORT
    uvicorn.run(app, host="0.0.0.0", port=port)
