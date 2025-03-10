import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Tarea
from .forms import TareaForm
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404

#Metodo que devuelve el JSON
def listar_tareas(request):
    #Obtener todas la instancias del objeto de la BD
    tareas = Tarea.objects.all()
    #Crear una variable en formato de diccionario por que le JSONResponse necesita un diccionario
    data = [
        {
            'id': tarea.id,
            'titulo': tarea.titulo,
            'descripcion': tarea.descripcion,
            'fecha_entrega': tarea.fecha_entrega,
            'tema': tarea.tema.nombre,
        } for tarea in tareas
    ]
    #Retornar el JSON
    return JsonResponse(data, safe=False)

#Funcion que registre sin recaragar la pagina osea sin hacer render 
def registrar_tarea(request):
    #Si el metodo es POST
    if request.method == 'POST':
        #aqui se puede validar si hay sesion antes de hacer el registro
        try :
            #intentar obtener los datos del body request 
            data = json.loads(request.body)# hace que el parametro que se recibe se convierta en un json
            #Crear una instancia del modelo 
            tarea = Tarea.objects.create(
                titulo=data['titulo'],
                descripcion=data['descripcion'],
                fecha_entrega=data['fecha_entrega'],
                tema_id=data['tema']
            )#la funcion create directamente guarda el objeto en la BD
            #Retornar un JSON
            return JsonResponse({'message': 'Tarea registrada correctamente', 'id':tarea.id}, status=201)
        except Exception as e:
            #Si hay un error retornar un JSON con el mensaje de error
            return JsonResponse({'message': str(e)}, status=400)
    return JsonResponse({'message': 'No se ha podido registrar la tarea'}, status=400)


#Funcion que actualiza sin recargar la pagina
def actualizar_tarea(request, id):
    if request.method == 'PUT':
        #Intentar actualizar el objeto
        #1) Obtener la entidad a actualizar
        #Parametros: modelo y id o identificador del objeto
        tarea = get_object_or_404(Tarea, id=id)

        try:
            #2) Obtener los datos del body request
            data = json.loads(request.body)
            #3) Actualizar los campos del objeto
            tarea.titulo = data['titulo']
            tarea.descripcion = data['descripcion']
            tarea.fecha_entrega = data['fecha_entrega']
            tarea.tema = data['tema']
            #4) Guardar los cambios
            tarea.save()
            #Retornar un JSON con el mensaje de exito
            return JsonResponse({'message': 'Tarea actualizada correctamente'}, status=200)
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Metodo no permitido'}, status=405)


#Funcion que elimina sin recargar la pagina
def eliminar_tarea(request, id):
    if request.method == 'DELETE':
        #Intentar eliminar el objeto
        #1) Obtener la entidad a eliminar
        #Parametros: modelo y id o identificador del objeto
        tarea = get_object_or_404(Tarea, id=id)

        try:
            #2) Eliminar el objeto
            tarea.delete()
            #Retornar un JSON con el mensaje de exito
            return JsonResponse({'message': 'Tarea eliminada correctamente'}, status=200)
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Metodo no permitido'}, status=405)


#Funcion que obtiene un objeto sin recargar la pagina
def obtener_tarea(request, id):
    if request.method == 'GET':
        #Intentar obtener el objeto
        #1) Obtener la entidad a obtener
        #Parametros: modelo y id o identificador del objeto
        tarea = get_object_or_404(Tarea, id=id)

        try:
            #2) Crear un diccionario con los datos del objeto
            data = {
                'id': tarea.id,
                'titulo': tarea.titulo,
                'descripcion': tarea.descripcion,
                'fecha_entrega': tarea.fecha_entrega,
                'tema': tarea.tema.nombre,
            }
            #Retornar un JSON con los datos del objeto
            return JsonResponse(data, status=200)
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Metodo no permitido'}, status=405)


        
