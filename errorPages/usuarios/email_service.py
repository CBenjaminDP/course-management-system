from django.conf import settings
import datetime
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, TemplateId
import traceback  # Add this import for better error tracking
import os

def enviar_correo_bienvenida(email_destinatario, nombre_usuario, rol, password=None):
    """
    Envía un correo de bienvenida al usuario recién creado
    
    Args:
        email_destinatario: Email del usuario
        nombre_usuario: Nombre de usuario
        rol: Rol del usuario (admin, profesor, estudiante)
        password: Contraseña (opcional, solo si quieres enviarla)
    """
    try:
        # Obtener la API key desde variables de entorno
        api_key = os.environ.get('SENDGRID_API_KEY')
        
        # Verificar si la API key existe
        if not api_key:
            print("Error: SENDGRID_API_KEY no está configurada en las variables de entorno")
            return {
                "success": False,
                "error": "API key no configurada",
                "message": "Error: SENDGRID_API_KEY no está configurada en las variables de entorno"
            }
            
        sg = SendGridAPIClient(api_key)  # Create the client properly
        
        # Configura el remitente
        from_email = Email("Soporte@speedasistencia.com")  # Cambia esto por tu email verificado en SendGrid
        to_email = To(email_destinatario)
        
        # Datos dinámicos para el template
        data = {
            "nombre_usuario": nombre_usuario,
            "rol": rol.capitalize(),
            "sistema_nombre": "Sistema de Gestión de Cursos",
            "login_url": "http://localhost:3000/login",  # Actualiza con tu URL real
            "current_year": datetime.datetime.now().year
        }
        
        # Si se proporciona contraseña, añadirla a los datos
        if password:
            data["password"] = password
        
        # Crear el mensaje
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
        )
        
        # Asignar el template ID de SendGrid (reemplaza con tu ID real)
        message.template_id = 'd-45ba94a40a8b4bdb932352f18b6d2131'  # Reemplaza con tu ID real
        
        # Asignar los datos dinámicos
        message.dynamic_template_data = data
        
        # Enviar el correo
        response = sg.send(message)
        
        return {
            "success": True,
            "status_code": response.status_code,
            "message": "Correo enviado exitosamente"
        }
        
    except Exception as e:
        # Get detailed error information
        error_details = traceback.format_exc()
        print(f"Error al enviar correo: {str(e)}")
        print(f"Detalles del error: {error_details}")
        
        return {
            "success": False,
            "error": str(e),
            "message": f"Error al enviar el correo: {str(e)}"
        }