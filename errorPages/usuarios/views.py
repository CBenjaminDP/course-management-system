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


import secrets
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password

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
        'nombre_completo': usuario.nombre_completo,
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



@csrf_exempt
def send_reset_email(request):
    if request.method == "POST":
        email = request.POST.get("email")
        user = Usuario.objects.filter(email=email).first() 

        if user:
            token = secrets.token_urlsafe(20)
            user.token = token
            user.save()
            reset_link = f"http://localhost:3000/login/recover/reset-password/{token}"
            
            # Colores basados en la misma paleta utilizada en los componentes frontend
            primary_color = "#FFD700"  # Amarillo/dorado del logo
            secondary_color = "#4A4A4A"  # Gris oscuro para contraste
            text_color = "#333333"  # Casi negro para texto
            bg_color = "#F8F9FA"  # Fondo suave
            accent_color = "#E6C200"  # Amarillo más oscuro para hover
            
            send_mail(
                subject="Recuperación de contraseña - ErrorPages",
                message=f"Hola, usa este enlace para restablecer tu contraseña: {reset_link}",  
                from_email="no-reply@errorpages.com",
                recipient_list=[email],
                fail_silently=False,
                html_message=f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Recuperación de contraseña</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: {text_color}; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <!-- Cabecera -->
                        <div style="background-color: {primary_color}; text-align: center; padding: 15px; border-radius: 10px 10px 0 0;">
                            <img src="https://i.ibb.co/LDQm0hN9/logo.png" alt="ErrorPages Logo" style="max-width: 150px; height: auto;">
                        </div>
                        
                        <!-- Contenido principal -->
                        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #eee;">
                            <h2 style="color: {secondary_color}; margin-top: 0; margin-bottom: 20px; text-align: center; font-size: 24px; position: relative;">
                                Recuperación de contraseña
                                <span style="display: block; width: 60px; height: 3px; background-color: {primary_color}; margin: 15px auto 0;"></span>
                            </h2>
                            
                            <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">Hola,</p>
                            <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.5;">Has solicitado restablecer tu contraseña para tu cuenta en ErrorPages. Para continuar con este proceso, haz clic en el botón de abajo:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{reset_link}" 
                                   style="display: inline-block; padding: 14px 30px; background-color: {primary_color}; color: {text_color}; 
                                   text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px;
                                   box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3); transition: all 0.3s ease;">
                                    Restablecer contraseña
                                </a>
                            </div>
                            
                            <p style="margin-bottom: 10px; font-size: 14px; line-height: 1.5; color: {secondary_color};">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                            <div style="background-color: {bg_color}; padding: 12px; border-radius: 6px; margin-bottom: 25px; word-break: break-all;">
                                <a href="{reset_link}" style="color: {secondary_color}; font-size: 14px; text-decoration: none;">{reset_link}</a>
                            </div>
                            
                            <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.5;">Este enlace expirará en 24 horas. Si no solicitaste este cambio, puedes ignorar este mensaje y tu contraseña seguirá siendo la misma.</p>
                            
                            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
                                <p style="margin-bottom: 5px; font-size: 14px; color: {secondary_color};">Saludos,</p>
                                <p style="margin-top: 0; font-weight: 600; font-size: 14px; color: {secondary_color};">El equipo de ProyectoUtez</p>
                            </div>
                        </div>
                        
                        <!-- Pie de página -->
                        <div style="text-align: center; padding: 20px; font-size: 12px; color: #777;">
                            <p style="margin-bottom: 10px;">© 2025 ProyectoUtez. Todos los derechos reservados.</p>
                            <p style="margin-bottom: 0;">Por favor no respondas a este correo electrónico, ya que es una dirección de envío automatizada.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
            )
            return JsonResponse({"message": "Correo de recuperación enviado."}, status=200)
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)


@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        token = request.POST.get("token")
        new_password = request.POST.get("password")
        user = Usuario.objects.filter(token=token).first()  

        if user:
            user.password = make_password(new_password)  
            user.token = ''  
            user.save()
            
            # URL de inicio de sesión
            login_url = "http://localhost:3000/login"
            
            # Colores basados en la misma paleta utilizada en los componentes frontend
            primary_color = "#FFD700"  # Amarillo/dorado del logo
            secondary_color = "#4A4A4A"  # Gris oscuro para contraste
            text_color = "#333333"  # Casi negro para texto
            bg_color = "#F8F9FA"  # Fondo suave
            accent_color = "#E6C200"  # Amarillo más oscuro para hover
        

            send_mail(
                subject="Contraseña restablecida con éxito - ErrorPages",
                message=f"Tu contraseña fue cambiada con éxito!",  
                from_email="no-reply@errorpages.com",
                recipient_list=[user.email],
                fail_silently=False,
                html_message=f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contraseña restablecida con éxito</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: {text_color}; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <!-- Cabecera -->
                        <div style="background-color: {primary_color}; text-align: center; padding: 15px; border-radius: 10px 10px 0 0;">
                            <img src="https://i.ibb.co/LDQm0hN9/logo.png" alt="ErrorPages Logo" style="max-width: 150px; height: auto;">
                        </div>
                        
                        <!-- Contenido principal -->
                        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #eee;">
                            <div style="text-align: center; margin-bottom: 25px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="{primary_color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            
                            <h2 style="color: {secondary_color}; margin-top: 0; margin-bottom: 20px; text-align: center; font-size: 24px; position: relative;">
                                ¡Tu contraseña ha sido restablecida con éxito!
                                <span style="display: block; width: 60px; height: 3px; background-color: {primary_color}; margin: 15px auto 0;"></span>
                            </h2>
                            
                            <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">Hola,</p>
                            <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.5;">Tu contraseña ha sido cambiada exitosamente. Ya puedes acceder a tu cuenta con tu nueva contraseña.</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{login_url}" 
                                   style="display: inline-block; padding: 14px 30px; background-color: {primary_color}; color: {text_color}; 
                                   text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px;
                                   box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3); transition: all 0.3s ease;">
                                    Iniciar sesión
                                </a>
                            </div>
                            
                            <div style="background-color: #FFF4E5; padding: 15px; border-left: 4px solid #FFB74D; border-radius: 4px; margin: 30px 0;">
                                <p style="margin: 0; font-size: 14px; line-height: 1.5;"><strong>Nota importante:</strong> Si no solicitaste este cambio de contraseña, tu cuenta podría estar comprometida. Por favor, ponte en contacto inmediatamente con nuestro equipo de soporte en <a href="mailto:admin@ProyectoUtez.com" style="color: {secondary_color}; font-weight: 600;">admin@errorpages.com</a>.</p>
                            </div>
                            
                            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
                                <p style="margin-bottom: 5px; font-size: 14px; color: {secondary_color};">Saludos,</p>
                                <p style="margin-top: 0; font-weight: 600; font-size: 14px; color: {secondary_color};">El equipo de ProyectoUtez</p>
                            </div>
                        </div>
                        
                        <!-- Pie de página -->
                        <div style="text-align: center; padding: 20px; font-size: 12px; color: #777;">
                            <p style="margin-bottom: 10px;">© 2025 ProyectoUtez. Todos los derechos reservados.</p>
                            <p style="margin-bottom: 0;">Por favor no respondas a este correo electrónico, ya que es una dirección de envío automatizada.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
            )

            return JsonResponse({"message": "Contraseña restablecida exitosamente."})
        return JsonResponse({"error": "Token inválido"}, status=400)