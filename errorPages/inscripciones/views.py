import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Inscripcion
from .forms import InscripcionForm
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404

#Metodo que devuelve el JSON
def listar_inscripciones(request):
    #Obtener todas la instancias del objeto de la BD
    inscripciones = Inscripcion.objects.all()
    #Crear una variable en formato de diccionario por que le JSONResponse necesita un diccionario
    data = [
        {
            'id': inscripcion.id,
            'id_curso': inscripcion.id_curso,
            'id_usuario': inscripcion.id_usuario,
            'fecha_inscripcion': inscripcion.fecha_inscripcion
        } 
        for inscripcion in inscripciones
    ]
    return JsonResponse(data, safe=False)

#Funcion que registre sin recargar la pagina osea sin hacer render 
def registrar_inscripcion(request):
    #checar que estemos manejando un metodo POST
    if request.method == 'POST':
        #aqui se puede validar si hay sesion antes de hacer el registro
        try:
            #Obtener los datos del request
            data = json.loads(request.body)
            #Crear una instancia de la clase Inscripcion
            inscripcion = Inscripcion.objects.create(
                id_curso=data['id_curso'],
                id_usuario=data['id_usuario'],
                fecha_inscripcion=data['fecha_inscripcion']
            )
            #Retornar un mensaje de exito
            return JsonResponse({'mensaje': 'Inscripcion creada correctamente', 'id': inscripcion.id}, status=201)
        except Exception as e:
            #Retornar un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que actualiza sin recargar la pagina osea sin hacer render 
def actualizar_inscripcion(request, id):
    #checar que estemos manejando un metodo PUT
    if request.method == 'PUT':
        #Intentar actualizar el objeto
        #1) Obtener la entidad a actualizar
        #Parametros: modelo y id o identificador del objeto
        inscripcion = get_object_or_404(Inscripcion, id=id)
        try:
            #2) Obtener los datos del body request
            data = json.loads(request.body)
            #3) Actualizar cada campo disponible de la entidad 
            inscripcion.id_curso = data['id_curso']
            inscripcion.id_usuario = data['id_usuario']
            inscripcion.fecha_inscripcion = data['fecha_inscripcion']
            #4) Guardar los cambios
            inscripcion.save()  # Se agregó para asegurar que los cambios se guarden en la BD

            #5)Retornar un JSON
            return JsonResponse({'mensaje': 'Inscripcion actualizada correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


#Funcion que elimina sin recargar la pagina osea sin hacer render
def eliminar_inscripcion(request, id):
    #checar que estemos manejando un metodo DELETE
    if request.method == 'DELETE':
        #Intentar eliminar el objeto
        #1) Obtener la entidad a eliminar
        #Parametros: modelo y id o identificador del objeto
        inscripcion = get_object_or_404(Inscripcion, id=id)
        try:
            #2) Eliminar la entidad
            inscripcion.delete()
            #3) Retornar un mensaje de exito
            return JsonResponse({'mensaje': 'Inscripcion eliminada correctamente'}, status=200)
        except Exception as e:
            #4) Retornar un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que obtiene un objeto sin recargar la pagina osea sin hacer render
def obtener_inscripcion(request, id):
    #checar que estemos manejando un metodo GET
    if request.method == 'GET':
        #Intentar obtener el objeto
        #1) Obtener la entidad a obtener
        #Parametros: modelo y id o identificador del objeto
        inscripcion = get_object_or_404(Inscripcion, id=id)
        try:
            #2) Crear un diccionario con los datos de la entidad
            data = {
                'id': inscripcion.id,
                'id_curso': inscripcion.id_curso,
                'id_usuario': inscripcion.id_usuario,
                'fecha_inscripcion': inscripcion.fecha_inscripcion
            }
            #3) Retornar un JSON
            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

