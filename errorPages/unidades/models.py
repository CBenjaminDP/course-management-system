from django.db import models
from cursos.models import Curso 

class Unidad(models.Model):
    nombre = models.CharField(max_length=100)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='unidades')
    orden = models.IntegerField()

    def __str__(self):
        return self.nombre
