from django.urls import path
from .views import *

urlpatterns = [
    path('', listar_temas, name='listar_temas'),
    path('registrar/', registrar_tema, name='registrar_tema'),
    path('actualizar/<str:id>/', actualizar_tema, name='actualizar_tema'),
    path('eliminar/<str:id>/', eliminar_tema, name='eliminar_tema'),
    path('obtener/<str:id>/', obtener_tema, name='obtener_tema'),
    path('unidad/<str:unidad_id>/', temas_por_unidad, name='temas_por_unidad'),
    path('detalle/<str:id>/', obtener_tema, name='detalle_tema'),  # Alias para mantener consistencia
    path('crear/', registrar_tema, name='crear_tema'),  # Alias para mantener consistencia
]