from django.db import models

class Usuario(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    nombre_completo = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    rol = models.CharField(max_length=50)
    token = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
