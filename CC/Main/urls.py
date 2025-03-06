from django.urls import path
from . import views

urlpatterns = [
    path('', views.main_view, name='main'),
    path('profile/', views.profile_view, name='profile'),
    path('recipes/<int:recipe_id>/', views.recipe_view, name='recipe'),
    path('recipes/', views.recipes_view, name='recipes'),
    path('products/', views.table_view, name='table'),
    path('calculator/', views.calculator_view, name='calculator'),
]