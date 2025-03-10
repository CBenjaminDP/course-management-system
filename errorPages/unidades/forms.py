from django import forms
from .models import Unidad

class UnidadForm(forms.ModelForm):
    class Meta:
        model = Unidad
        fields = ['nombre', 'curso', 'orden']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre de la unidad'}),
            'curso': forms.Select(attrs={'class': 'form-control'}),
            'orden': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Orden de la unidad'}),
        }

        labels = {
            'nombre': 'Nombre de la unidad',
            'curso': 'Curso',
            'orden': 'Orden de la unidad',
        }

        error_messages = {
            'nombre': {
                'required': 'Este campo es requerido',
                'max_length': 'La longitud máxima es de 100 caracteres',
            },
            'curso': {
                'required': 'Este campo es requerido',
            },
            'orden': {
                'required': 'Este campo es requerido',
            }
        }


