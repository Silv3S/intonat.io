from django.shortcuts import render, redirect
from django.views.generic import TemplateView, ListView, CreateView
from django.core.files.storage import FileSystemStorage
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt

from .forms import AudioForm
from .models import Audio


class Home(TemplateView):
    template_name = 'home.html'


def record(request):
    context = {}
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        context['url'] = fs.url(name)
    return render(request, 'record.html', context)


def audio_list(request):
    audios = Audio.objects.all()
    return render(request, 'audio_list.html', {
        'audios': audios
    })


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


class AudioListView(ListView):
    model = Audio
    template_name = 'class_audio_list.html'
    context_object_name = 'audios'


class UploadAudioView(CreateView):
    model = Audio
    form_class = AudioForm
    success_url = reverse_lazy('class_audio_list')
    template_name = 'upload_audio.html'

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