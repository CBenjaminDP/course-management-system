from django import forms
from .models import Tarea

class TareaForm(forms.ModelForm):
    class Meta:
        model = Tarea
        fields = ['titulo', 'descripcion', 'fecha_entrega', 'tema']
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Título de la tarea'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Descripción de la tarea', 'rows': 4}),
            'fecha_entrega': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'tema': forms.Select(attrs={'class': 'form-control'}),
        }

        labels = {
            'titulo': 'Título',
            'descripcion': 'Descripción',
            'fecha_entrega': 'Fecha de entrega',
            'tema': 'Tema',
        }

        help_texts = {
            'titulo': 'Ingrese un título para la tarea',
            'descripcion': 'Ingrese una descripción para la tarea',
            'fecha_entrega': 'Seleccione la fecha de entrega de la tarea',
            'tema': 'Seleccione el tema al que pertenece la tarea',
        }

        error_messages = {
            'titulo': {
                'required': 'Este campo es obligatorio',
            },
            'fecha_entrega': {
                'required': 'Este campo es obligatorio',
            },
            'tema': {
                'required': 'Este campo es obligatorio',
            },
        }
