from django.db import models
from unidades.models import Unidad 

class Tema(models.Model):
    nombre = models.CharField(max_length=100)
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='temas')
    descripcion = models.TextField(null=True, blank=True)
    orden = models.IntegerField()

    def __str__(self):
        return self.nombre
