from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_usuarios, name='listar_usuarios'),
    path('todos/', views.listar_usuarios, name='listar_todos_usuarios'),
    path('registrar/', views.registrar_usuario, name='registrar_usuario'),
    # Cambiar esta ruta para manejar UUIDs sin guiones
    path('uuid/<str:id>/', views.obtener_usuario, name='obtener_usuario_uuid'),
    path('actualizar/<str:id>/', views.actualizar_usuario, name='actualizar_usuario'),
    path('eliminar/<str:id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('desactivar/<str:id>/', views.desactivar_usuario, name='desactivar_usuario'),
]

