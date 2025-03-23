from django.urls import path
from .views import *

urlpatterns = [
    path('', listar_unidades, name='listar_unidades'),
    path('registrar/', registrar_unidad, name='registrar_unidad'),
    path('actualizar/<int:id>/', actualizar_unidad, name='actualizar_unidad'),
    path('eliminar/<int:id>/', eliminar_unidad, name='eliminar_unidad'),
    path('obtener/<int:id>/', obtener_unidad, name='obtener_unidad')
]