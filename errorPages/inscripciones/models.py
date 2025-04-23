import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from usuarios.models import Usuario
from cursos.models import Curso
from tareas.models import Tarea

class Inscripcion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='inscripciones')
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='inscripciones')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)
    porcentaje_completado = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.00,
        validators=[
            MinValueValidator(0.00),
            MaxValueValidator(100.00)
        ]
    )

    def actualizar_porcentaje(self):
        """Actualiza el porcentaje basado en las tareas completadas"""
        # Obtener el total de tareas en el curso
        total_tareas = 0
        for unidad in self.curso.unidades.all():
            for tema in unidad.temas.all():
                total_tareas += tema.tareas.count()
        
        # Si no hay tareas, el porcentaje es 0
        if total_tareas == 0:
            self.porcentaje_completado = 0
            self.save()
            return
        
        # Contar tareas completadas
        tareas_completadas = self.tareas_completadas.count()
        
        # Calcular porcentaje
        porcentaje = (tareas_completadas / total_tareas) * 100
        self.porcentaje_completado = round(porcentaje, 2)
        self.save()

    def __str__(self):
        return f"Inscripción: {self.usuario.nombre_completo} en {self.curso.nombre}"


class TareaCompletada(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inscripcion = models.ForeignKey(Inscripcion, on_delete=models.CASCADE, related_name='tareas_completadas')
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, related_name='completados')
    fecha_completado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Asegura que una tarea solo pueda ser completada una vez por inscripción
        unique_together = ['inscripcion', 'tarea']
        
    def __str__(self):
        return f"Tarea '{self.tarea.titulo}' completada por {self.inscripcion.usuario.nombre_completo}"