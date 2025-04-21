import json
import random
import string
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Usuario
from .forms import UsuarioForm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password, make_password
from django.views.decorators.csrf import csrf_exempt
from uuid import UUID

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_usuarios(request):
    usuarios = Usuario.objects.all()
    data = [
        {
            'id': usuario.id,
            'username': usuario.username,
            'password': usuario.password,
            'nombre_completo': usuario.nombre_completo,
            'email': usuario.email,
            'rol': usuario.rol,
            'token': usuario.token,
            'fecha_creacion': usuario.fecha_creacion
        } 
        for usuario in usuarios
    ]
    return JsonResponse(data, safe=False)

# Añade esta importación al inicio del archivo
from .email_service import enviar_correo_bienvenida

def generate_password(length=10):
    """Generate a secure random password"""
    characters = string.ascii_letters + string.digits + string.punctuation
    # Ensure at least one of each required character type
    password = random.choice(string.ascii_lowercase)
    password += random.choice(string.ascii_uppercase)
    password += random.choice(string.digits)
    password += random.choice("@$!%*?&")
    
    # Fill the rest with random characters
    password += ''.join(random.choice(characters) for _ in range(length - 4))
    
    # Shuffle the password
    password_list = list(password)
    random.shuffle(password_list)
    return ''.join(password_list)

def generate_username(nombre_completo, max_length=12):
    """Generate a username based on the user's full name with length limit"""
    # Remove spaces and special characters
    base_username = ''.join(e for e in nombre_completo if e.isalnum()).lower()
    
    # Limit the base username length to max_length characters
    if len(base_username) > max_length:
        # Take first part of the name to keep it recognizable
        base_username = base_username[:max_length]
    
    # Add a random number to make it unique
    random_suffix = ''.join(random.choices(string.digits, k=4))
    return base_username + random_suffix

@csrf_exempt
@permission_classes([IsAuthenticated])
def registrar_usuario(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Generate username based on nombre_completo
            nombre_completo = data['nombre_completo']
            username = generate_username(nombre_completo)
            
            # Generate a secure random password
            password = generate_password()
            
            # Create user with generated credentials
            usuario = Usuario.objects.create_user(
                username=username,
                password=password,
                nombre_completo=nombre_completo,
                email=data['email'],
                rol=data['rol']
            )
            
            # Enviar correo de bienvenida con las credenciales generadas
            resultado_email = enviar_correo_bienvenida(
                email_destinatario=data['email'],
                nombre_usuario=username,
                rol=data['rol'],
                password=password  # Enviar la contraseña generada por correo
            )
            
            # Crear respuesta
            response_data = {
                'mensaje': 'Usuario creado correctamente', 
                'id': usuario.id,
                'username': username,  # Include generated username in response
                'password': password   # Include password in response for debugging (remove in production)
            }
            
            # Añadir información sobre el envío del correo
            if resultado_email['success']:
                response_data['email_enviado'] = True
            else:
                response_data['email_enviado'] = False
                response_data['email_error'] = resultado_email['error'] if 'error' in resultado_email else resultado_email['message']
            
            return JsonResponse(response_data, status=201)
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error al registrar usuario: {str(e)}")
            print(f"Detalles del error: {error_details}")
            return JsonResponse({'error': str(e), 'details': error_details}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_usuario(request, id):
    if request.method == 'PUT':
        usuario = get_object_or_404(Usuario, id=id)
        try:
            data = json.loads(request.body)
            
            # Update only if field is present in request
            if 'username' in data:
                usuario.username = data['username']
            if 'password' in data:
                usuario.set_password(data['password'])
            if 'nombre_completo' in data:
                usuario.nombre_completo = data['nombre_completo']
            if 'email' in data:
                usuario.email = data['email']
            if 'rol' in data:
                usuario.rol = data['rol']
            if 'is_active' in data:
                usuario.is_active = data['is_active']
            
            usuario.save()

            return JsonResponse({
                'mensaje': 'Usuario actualizado correctamente',
                'usuario': {
                    'id': usuario.id,
                    'username': usuario.username,
                    'nombre_completo': usuario.nombre_completo,
                    'email': usuario.email,
                    'rol': usuario.rol,
                    'is_active': usuario.is_active,
                    'fecha_creacion': usuario.fecha_creacion
                }
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_usuario(request, id):
    if request.method == 'DELETE':
        #Intentar eliminar el objeto
        #1) Obtener la entidad a eliminar
        #Parametros: modelo y id o identificador del objeto
        usuario = get_object_or_404(Usuario, id=id)
        try:
            usuario.delete()
            return JsonResponse({'mensaje': 'Usuario eliminado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario(request, id):
    try:
        # Convertir el ID a UUID válido
        if len(id) == 32:  # UUID sin guiones
            formatted_id = f"{id[:8]}-{id[8:12]}-{id[12:16]}-{id[16:20]}-{id[20:]}"
        else:
            formatted_id = id
            
        usuario = get_object_or_404(Usuario, id=formatted_id)
        data = {
            'id': usuario.id,
            'username': usuario.username,
            'password': usuario.password,
            'nombre_completo': usuario.nombre_completo,
            'email': usuario.email,
            'rol': usuario.rol,
            'token': usuario.token,
            'fecha_creacion': usuario.fecha_creacion
        }
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return JsonResponse({
        'message': 'This is a protected view',
        'user': request.user.username,
        'rol': request.user.rol
    })


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def desactivar_usuario(request, id):
    if request.method == 'PUT':
        try:
            usuario = get_object_or_404(Usuario, id=id)
            usuario.is_active = not usuario.is_active
            usuario.save()
            status_message = 'activado' if usuario.is_active else 'desactivado'
            return JsonResponse({
                'mensaje': f'Usuario {status_message} correctamente',
                'is_active': usuario.is_active
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def format_uuid(uuid_string):
    """Helper function to handle UUIDs with or without hyphens"""
    # Remove any existing hyphens
    clean_uuid = uuid_string.replace('-', '')
    # Insert hyphens in correct positions
    formatted_uuid = f"{clean_uuid[:8]}-{clean_uuid[8:12]}-{clean_uuid[12:16]}-{clean_uuid[16:20]}-{clean_uuid[20:]}"
    return formatted_uuid

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_actual(request):
    usuario = request.user
    data = {
        'id': usuario.id,
        'username': usuario.username,
        'email': usuario.email,
        'rol': usuario.rol,
        # otros campos que necesites
    }
    return JsonResponse(data)


# Add this function to your views.py
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cambiar_password(request, id):
    if request.method == 'PUT':
        try:
            usuario = get_object_or_404(Usuario, id=id)
            
            # Check if the user making the request is the same as the user being modified
            # or if the user is an admin
            if str(request.user.id) != str(usuario.id) and request.user.rol != 'admin':
                return JsonResponse({'error': 'No tienes permiso para cambiar esta contraseña'}, status=403)
            
            data = json.loads(request.body)
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            
            # Verify current password
            if not check_password(current_password, usuario.password):
                return JsonResponse({'error': 'La contraseña actual es incorrecta'}, status=400)
            
            # Update password
            usuario.set_password(new_password)
            usuario.save()
            
            return JsonResponse({'mensaje': 'Contraseña actualizada correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)