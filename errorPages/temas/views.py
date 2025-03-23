import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Tema
from .forms import TemaForm
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


#Metodo que devuelve el JSON
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_temas(request):
    #Obtener todas la instancias del objeto de la BD
    temas = Tema.objects.all()
    #Crear una variable en formato de diccionario por que le JSONResponse necesita un diccionario

    data = [
        {
            'id': tema.id,
            'nombre': tema.nombre,
            'unidad': tema.unidad.nombre,
            'descripcion': tema.descripcion,
            'orden': tema.orden,
        } for tema in temas
    ]
    #Retornar la respuesta en formato JSON
    return JsonResponse(data, safe=False)



#Funcion que registre sin recaragar la pagina osea sin hacer render 
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_tema(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            #Crear una instancia del modelo 
            tema = Tema.objects.create(
                #basicamente es un constructor de objetos
                nombre=data['nombre'],
                unidad_id=data['unidad'],
                descripcion=data['descripcion'],
                orden=data['orden'],
            )#la funcion create directamente guarda el objeto en la BD
            #Retornar un JSON
            return JsonResponse({'mensaje': 'Tema registrado correctamente', 'id':tema.id}, status=201)
        except:
            #Si hay un error retornar un JSON
            return JsonResponse({'mensaje': 'Error al registrar el tema'}, status=400)
        #Si el metodo no es POST retornar un JSON
    return JsonResponse({'mensaje': 'Método no permitido'}, status=405)


#Funcion que actualiza sin recargar la pagina
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_tema(request, id):
    if request.method == 'PUT':
        tema = get_object_or_404(Tema, id=id)
        try:
            data = json.loads(request.body)
            tema.nombre = data['nombre']
            tema.unidad_id = data['unidad']  # Use unidad_id instead of unidad
            tema.descripcion = data['descripcion']
            tema.orden = data['orden']
            tema.save()
            return JsonResponse({'mensaje': 'Tema actualizado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al actualizar el tema'}, status=400)
    return JsonResponse({'mensaje': 'Método no permitido'}, status=405)


#Funcion que elimina sin recargar la pagina
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_tema(request, id):
    if request.method == 'DELETE':
        tema = get_object_or_404(Tema, id=id)
        try:
            tema.delete()
            return JsonResponse({'mensaje': 'Tema eliminado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al eliminar el tema'}, status=400)
    return JsonResponse({'mensaje': 'Método no permitido'}, status=405)
         

#Funcion que obtiene un objeto por su id
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_tema(request, id):
   if request.method == 'GET':
        #Intentar obtener el objeto
        #1) Obtener la entidad a obtener
        #Parametros: modelo y id o identificador del objeto
        tema = get_object_or_404(Tema, id=id)
        try:
            #Crear un diccionario con los datos del objeto
            data = {
                'id': tema.id,
                'nombre': tema.nombre,
                'unidad': tema.unidad.id,
                'descripcion': tema.descripcion,
                'orden': tema.orden,
            }
            #Retornar un JSON
            return JsonResponse(data, status=200)
        except Exception as e:
            #Si hay un error retornar un JSON
            return JsonResponse({'mensaje': 'Error al obtener el tema'}, status=400)
   return JsonResponse({'mensaje': 'Método no permitido'}, status=405)
   

            