from django.apps import AppConfig
from django.db.models.signals import post_migrate

def crear_usuarios_default(sender, **kwargs):
    from .models import Usuario

    usuarios_default = [
        {
            'username': 'admin',
            'email': 'admin@example.com',
            'password': 'admin123',
            'nombre_completo': 'Administrador',
            'rol': 'admin',
            'is_staff': True,
            'is_admin': True,
            'is_superuser': True
        },
        {
            'username': 'profesor',
            'email': 'profesor@example.com',
            'password': 'profesor123',
            'nombre_completo': 'Profesor Default',
            'rol': 'profesor'
        },
        {
            'username': 'estudiante',
            'email': 'estudiante@example.com',
            'password': 'estudiante123',
            'nombre_completo': 'Estudiante Default',
            'rol': 'estudiante'
        }
    ]

    for usuario_data in usuarios_default:
        username = usuario_data['username']
        if not Usuario.objects.filter(username=username).exists():
            Usuario.objects.create_user(**usuario_data)
            print(f"Usuario {username} creado exitosamente")

class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usuarios'

    def ready(self):
        post_migrate.connect(crear_usuarios_default, sender=self)
