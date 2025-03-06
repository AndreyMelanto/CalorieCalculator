from django.contrib import admin
from Main import models



@admin.register(models.NutritionalValue)
class NutritionValueSettings(admin.ModelAdmin):
    list_display = ('id', 'product', 'is_product')
    list_display_links = ('id', 'product')
    search_fields = ['product', 'id']
    list_filter = ['is_product']



@admin.register(models.SavedProducts)
class SavedProductsSettings(admin.ModelAdmin):
    list_display = ('id', 'product', 'user__username')
    list_display_links = ('id', 'product', 'user__username')
    search_fields = ['id', 'user__username']



@admin.register(models.Recipes)
class RecipesSettings(admin.ModelAdmin):
    list_display = ('id', 'title')
    list_display_links = ('id', 'title')
    readonly_fields = ['nutritional_value']