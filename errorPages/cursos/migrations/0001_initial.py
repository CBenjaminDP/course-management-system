# Generated by Django 4.2.7 on 2025-04-02 23:51

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Curso',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('fecha_inicio', models.DateField()),
                ('fecha_fin', models.DateField()),
                ('estado', models.BooleanField(default=True)),
                ('imagen_url', models.URLField(blank=True, max_length=500, null=True)),
            ],
        ),
    ]
