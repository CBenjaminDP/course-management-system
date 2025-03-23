from django.urls import path
from .views import *

urlpatterns = [
    path('usuarios/', listar_usuarios, name='listar_usuarios'),
    path('usuarios/registrar/', registrar_usuario, name='registrar_usuario'),
    path('usuarios/actualizar/<int:id>/', actualizar_usuario, name='actualizar_usuario'),
    path('usuarios/eliminar/<int:id>/', eliminar_usuario, name='eliminar_usuario'),
    path('usuarios/ver/<int:id>/', obtener_usuario, name='obtener_usuario')
]

