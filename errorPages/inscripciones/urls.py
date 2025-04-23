from django.urls import path
from .views import *

urlpatterns = [
    path('', listar_inscripciones, name='listar_inscripciones'),
    path('registrar/', registrar_inscripcion, name='registrar_inscripcion'),
    path('actualizar/<str:id>/', actualizar_inscripcion, name='actualizar_inscripcion'),
    path('eliminar/<str:id>/', eliminar_inscripcion, name='eliminar_inscripcion'),
    path('obtener/<str:id>/', obtener_inscripcion, name='obtener_inscripcion'),
    
    # Nuevas URLs para el sistema de progreso
    path('marcar-tarea-completada/', marcar_tarea_completada, name='marcar_tarea_completada'),
    path('estado-tareas/<str:curso_id>/', estado_tareas, name='estado_tareas'),
    path('reiniciar-progreso/<str:inscripcion_id>/', reiniciar_progreso, name='reiniciar_progreso'),
]