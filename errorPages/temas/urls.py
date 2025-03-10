from django.urls import path
from .views import *

urlpatterns = [
    path('temas/', listar_temas, name='listar_temas'),
    path('temas/registrar/', registrar_tema, name='registrar_tema'),
    path('temas/editar/<int:id>/', actualizar_tema, name='actualizar_tema'),
    path('temas/eliminar/<int:id>/', eliminar_tema, name='eliminar_tema'),
    path('temas/ver/<int:id>/', obtener_tema, name='obtener_tema'),
]