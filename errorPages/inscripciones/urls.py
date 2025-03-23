from django.urls import path
from .views import *

urlpatterns = [
    path('', listar_inscripciones, name='listar_inscripciones'),
    path('registrar/', registrar_inscripcion, name='registrar_inscripcion'),
    path('actualizar/<str:id>/', actualizar_inscripcion, name='actualizar_inscripcion'),
    path('eliminar/<str:id>/', eliminar_inscripcion, name='eliminar_inscripcion'),
    path('obtener/<str:id>/', obtener_inscripcion, name='obtener_inscripcion'),
]
