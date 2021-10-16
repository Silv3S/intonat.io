from django.db import models

class Audio(models.Model):
    speaker = models.CharField(max_length = 100, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    sex = models.CharField(max_length = 1, null=True, blank=True)
    recording = models.FileField(upload_to='recordings/')

    def __str__(self):
        return self.speaker

    def delete(self, *args, **kwargs):
        self.recording.delete()
        super().delete(*args,**kwargs)