# unitai-django

# Команды для разворачивания проекта

    pip install --upgrade pip

    pip install -r backend/requirements/production.txt

    pip install channels
    pip install python-magic-bin

    python backend/manage.py check --deploy

# Миграции
    python backend/manage.py makemigrations
    python backend/manage.py migrate

# Создание админа
    python backend/manage.py createsuperuser

# Запуск
    python backend/manage.py runserver


