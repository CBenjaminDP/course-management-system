from django.db import models
from temas.models import Tema 

class Tarea(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    fecha_entrega = models.DateField()
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE, related_name='tareas')

    def __str__(self):
        return self.titulo
