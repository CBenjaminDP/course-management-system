from django.db import models
from usuarios.models import Usuario  
from cursos.models import Curso      

class Inscripcion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='inscripciones')
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='inscripciones')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inscripción {self.id_inscripcion}: {self.usuario.username} en {self.curso.nombre}"
