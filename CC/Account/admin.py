from django.contrib import admin
from Account import models

@admin.register(models.AdvancedUser)
class AdvancedUserSettings(admin.ModelAdmin):
    list_display = ('id', 'user__username', 'tg_id')
    list_display_links = ('id', 'user__username', 'tg_id')
    readonly_fields = ['user']