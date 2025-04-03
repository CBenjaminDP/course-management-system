from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.contrib.auth import get_user_model

def crear_usuarios_default(sender, **kwargs):
    Usuario = get_user_model()
    usuarios_default = [
        {
            'email': 'admin@example.com',
            'password': '$2b$10$3V96eNj2aQbApmbluwWoyORR3BLf8hWkbTLu.lKNE2UqJ2PX8tAsK',
            'username': 'admin',
            'rol': 'admin',
            'is_staff': True,
            'is_superuser': True,
        },
        {
            'username': 'profesor',
            'email': 'profesor@example.com',
            'password': '$2b$10$ZLONC6WY33LUUd3r6MgzzOXqLCxWf4x1qq0tXwND/NHdGx7MwF8vq',
            'nombre_completo': 'Profesor Default',
            'rol': 'profesor'
        },
        {
            'username': 'estudiante',
            'email': 'estudiante@example.com',
            'password': '$2b$10$xGq7bOemKzQeGQTV2cWBmeFM15TDQab1PbD9cgU0yvoOaKg/6Nlw2',
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
