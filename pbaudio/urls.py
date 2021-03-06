"""pbaudio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from pbaudio.uploader import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.splash, name='splash'),
    path('home', views.Home.as_view(), name='home'),
    path('get_scenario/', views.get_scenario, name='get_scenario'),
    path('record/', views.record, name='record'),

    path('audios/', views.audio_list, name='audio_list'),
    path('audios/upload/', views.upload_audio, name='upload_audio'),
    path('audios/<int:pk>/', views.delete_audio, name='delete_audio'),
    
    path('pass_audio/', views.pass_audio, name='pass_audio'),
]

if settings.DEBUG:
    urlpatterns +=static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)