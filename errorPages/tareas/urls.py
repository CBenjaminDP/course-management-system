from django.urls import path
from .views import *

urlpatterns = [
    path('tareas/', listar_tareas, name='listar_tareas'),
    path('tareas/registrar/', registrar_tarea, name='registrar_tarea'),
    path('tareas/editar/<int:id>/', actualizar_tarea, name='actualizar_tarea'),
    path('tareas/eliminar/<int:id>/', eliminar_tarea, name='eliminar_tarea'),
    path('tareas/ver/<int:id>/', obtener_tarea, name='obtener_tarea'),
]
