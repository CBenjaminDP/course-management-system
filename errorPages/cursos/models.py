import uuid
from django.db import models
from usuarios.models import Usuario

class Curso(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    profesor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='cursos')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.BooleanField(default=True)
    imagen_url = models.URLField(max_length=500, blank=True, null=True)
    
    def __str__(self):
        return self.nombre