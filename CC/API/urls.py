from django.urls import path
from . import views

urlpatterns = [
    path('get_nutritional_values/', views.GetNutritionalValues.as_view()),
    path('get_saved_products/', views.GetSavedProducts.as_view()),
    path('get_norm_of_nutrients/', views.GetNormOfNutrients.as_view()),
    path('get_recipes/', views.GetRecipes.as_view()),
    path('get_recipe/', views.GetRecipe.as_view()),
    path('get_site_statistics/', views.GetSiteStatistics.as_view()),

    path('registration/', views.Registration.as_view()),
    path('save_product/', views.SaveProduct.as_view()),
    path('delete_saved_product/', views.DeleteSavedProduct.as_view()),
    path('calculator/', views.Calculator.as_view()),
    path('add_recipe/', views.AddRecipe.as_view()),
    path('add_product/', views.AddProduct.as_view()),
    path('generate_telegram_token/', views.GenerateTelegramToken.as_view()),
    path('link_telegram/', views.LinkTelegram.as_view()),
]