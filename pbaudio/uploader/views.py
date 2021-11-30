from django.shortcuts import render, redirect
from django.views.generic import TemplateView, ListView, CreateView
from django.core.files.storage import FileSystemStorage
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings

from .forms import AudioForm
from .models import Audio

import os
import json

class Home(TemplateView):
    template_name = 'home.html'

def splash(request):
    return render(request, 'splash.html')

def record(request):
    context = {"recorder": "active"}
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs = FileSystemStorage()
        fs.save(uploaded_file.name, uploaded_file)
    return render(request, 'record.html',context)

def audio_list(request):
    audios = Audio.objects.all()
    context = {"audios":audios,
    "audio_list": "active"}
    return render(request, 'audio_list.html', context)


def upload_audio(request):
    if request.method == 'POST':
        form = AudioForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('audio_list')
    else:
        form = AudioForm()
    return render(request, 'upload_audio.html', {
        'form': form
    })    


def delete_audio(request, pk):
    if request.method == 'POST':
        audio = Audio.objects.get(pk=pk)
        audio.delete()
    return redirect('audio_list')


@csrf_exempt
def pass_audio(request):
    context = {}
    if request.method == 'POST':
        form = AudioForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('audio_list')
    else:
        form = AudioForm()
    return render(request, 'record.html', {'form': form})  

def get_scenario(request):    
    file = os.path.join(settings.BASE_DIR, 'pbaudio/static/scenario.json' )
    json_data = json.load(open(file))
    return JsonResponse(json_data)