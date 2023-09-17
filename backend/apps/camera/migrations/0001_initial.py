# Generated by Django 3.2.5 on 2023-09-13 07:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Model',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Модель',
                'verbose_name_plural': 'Модели',
                'db_table': 'model',
            },
        ),
        migrations.CreateModel(
            name='Camera',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('address', models.CharField(max_length=100, unique=True, verbose_name='Адрес')),
                ('title', models.CharField(max_length=100, verbose_name='Название')),
                ('token', models.CharField(max_length=100, verbose_name='Токен')),
                ('id_tg', models.CharField(max_length=100, verbose_name='ID телеграм')),
                ('toke_bot', models.CharField(max_length=100, verbose_name='Токен бота')),
                ('shablon_sobsheniya', models.CharField(max_length=100, verbose_name='Шаблон сообщения')),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='camera.model', verbose_name='Модель')),
            ],
            options={
                'verbose_name': 'Камера',
                'verbose_name_plural': 'Камеры',
                'db_table': 'camera',
            },
        ),
    ]