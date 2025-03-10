from django.db import models
from usuarios.models import Usuario

class Curso(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    profesor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='cursos')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre