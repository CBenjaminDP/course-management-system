from django.db import migrations

def create_default_users(apps, schema_editor):
    Usuario = apps.get_model('usuarios', 'Usuario')
    
    # Create admin user
    Usuario.objects.create(
        username='admin',
        password='admin123',  # Recuerda cambiar esto en producción
        nombre_completo='Administrador del Sistema',
        email='admin@sistema.com',
        rol='admin',
        token=''
    )

    # Create teacher user
    Usuario.objects.create(
        username='teacher',
        password='teacher123',
        nombre_completo='Profesor Demo',
        email='teacher@sistema.com',
        rol='teacher',
        token=''
    )

    # Create student user
    Usuario.objects.create(
        username='student',
        password='student123',
        nombre_completo='Estudiante Demo',
        email='student@sistema.com',
        rol='student',
        token=''
    )

def delete_default_users(apps, schema_editor):
    Usuario = apps.get_model('usuarios', 'Usuario')
    Usuario.objects.filter(username__in=['admin', 'teacher', 'student']).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_users, delete_default_users),
    ]