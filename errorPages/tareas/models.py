import uuid
from django.db import models
from temas.models import Tema

class Tarea(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    fecha_entrega = models.DateField()
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE, related_name='tareas')

    def __str__(self):
        return self.titulo
