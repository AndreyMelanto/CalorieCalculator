from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import Http404
from .models import Recipes



def main_view(request):
    return render(request, 'main/main.html')



@login_required
def profile_view(request):
    return render(request, 'main/profile.html')



def recipes_view(request):
    return render(request, 'main/recipes.html')



def recipe_view(request, recipe_id):
    try:
        Recipes.objects.get(id=recipe_id)
        return render(request, 'main/recipe.html', {'recipe_id': recipe_id})
    except:
        raise Http404()



def table_view(request):
    return render(request, 'main/table.html',)



@login_required
def calculator_view(request):
    return render(request, 'main/calculator.html')