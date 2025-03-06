from django.db import models
from django.contrib.auth.models import User



class AdvancedUser(models.Model):
    class Meta:
        verbose_name = 'Расширенный пользователь'
        verbose_name_plural = 'Расширенные пользователи'

    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    tg_id = models.IntegerField(blank=True, verbose_name='Telegram')
    norm_of_nutrients = models.CharField(max_length=30, blank=True, null=True, verbose_name='Норма нутриентов')

    def __str__(self):
        return self.user.username