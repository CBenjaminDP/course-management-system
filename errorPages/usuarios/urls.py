from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_usuarios, name='listar_usuarios'),
    path('todos/', views.listar_usuarios, name='listar_todos_usuarios'),
    path('registrar/', views.registrar_usuario, name='registrar_usuario'),
    path('uuid/<str:id>/', views.obtener_usuario, name='obtener_usuario_uuid'),
    path('actualizar/<str:id>/', views.actualizar_usuario, name='actualizar_usuario'),
    path('eliminar/<str:id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('desactivar/<str:id>/', views.desactivar_usuario, name='desactivar_usuario'),
    path('usuario-actual/', views.obtener_usuario_actual, name='obtener_usuario_actual'),
    path('cambiar-password/<str:id>/', views.cambiar_password, name='cambiar_password'),
]

