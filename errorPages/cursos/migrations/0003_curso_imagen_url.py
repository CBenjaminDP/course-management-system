# Generated by Django 5.1.4 on 2025-04-02 07:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cursos', '0002_alter_curso_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='curso',
            name='imagen_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
