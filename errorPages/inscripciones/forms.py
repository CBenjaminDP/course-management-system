from django import forms
from .models import Inscripcion

class InscripcionForm(forms.ModelForm):
    class Meta:
        model = Inscripcion
        fields = ['usuario', 'curso']

        widgets = {
            'usuario': forms.Select(attrs={'class': 'form-control'}),
            'curso': forms.Select(attrs={'class': 'form-control'}),
        }

        labels = {
            'usuario': 'Usuario',
            'curso': 'Curso',
        }

        error_messages = {
            'usuario': {
                'required': 'Este campo es requerido'
            },
            'curso': {
                'required': 'Este campo es requerido'
            }
        }

        
