from django.urls import path
from .views import *

urlpatterns = [
    path('listar_unidades/', listar_unidades, name='listar_unidades'),
    path('registrar_unidad/', registrar_unidad, name='registrar_unidad'),
    path('actualizar_unidad/<int:id>/', actualizar_unidad, name='actualizar_unidad'),
    path('eliminar_unidad/<int:id>/', eliminar_unidad, name='eliminar_unidad'),
    path('obtener_unidad/<int:id>/', obtener_unidad, name='obtener_unidad')
]