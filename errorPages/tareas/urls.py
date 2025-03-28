from django.urls import path
from .views import *

urlpatterns = [
    path('', listar_tareas, name='listar_tareas'),
    path('registrar/', registrar_tarea, name='registrar_tarea'),
    path('actualizar/<str:id>/', actualizar_tarea, name='actualizar_tarea'),
    path('eliminar/<str:id>/', eliminar_tarea, name='eliminar_tarea'),
    path('obtener/<str:id>/', obtener_tarea, name='obtener_tarea'),
]
