from django.urls import path
from .views import *

urlpatterns = [
    path('inscripciones/', listar_inscripciones, name='listar_inscripciones'),
    path('inscripciones/registrar/', registrar_inscripcion, name='registrar_inscripcion'),
    path('inscripciones/editar/<int:id>/', actualizar_inscripcion, name='actualizar_inscripcion'),
    path('inscripciones/eliminar/<int:id>/', eliminar_inscripcion, name='eliminar_inscripcion'),
    path('inscripciones/ver/<int:id>/', obtener_inscripcion, name='obtener_inscripcion'),
]
