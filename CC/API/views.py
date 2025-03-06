from django.forms import model_to_dict
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from random import randint
from django.contrib.auth.models import User
from Main.models import NutritionalValue, Recipes
from . import serializers
from Main import models
from Account.models import AdvancedUser
from .parser import get_recipe


def POST_get_id(query):
    try:
        id = int(query['user_id'])
    except:
        try:
            tg_id = int(query['tg_id'])
            id = AdvancedUser.objects.get(tg_id=tg_id).user.id
        except:
            id = None
    return id

def GET_get_id(request):
    id = POST_get_id({'user_id': request.GET.get('user_id'), 'tg_id': request.GET.get('tg_id')})
    return id





class GetNutritionalValues(APIView):
    def get(self, request):
        product_ids = request.GET.get('id')

        if product_ids == None:
            return Response(models.NutritionalValue.objects.all().order_by('product').values())
        elif ' ' in product_ids:
            ids = product_ids.split(' ')
            products = []
            for product_id in ids:
                products.append(model_to_dict(models.NutritionalValue.objects.get(id=product_id)))
            return Response(products)
        else:
            try:
                return Response(model_to_dict(models.NutritionalValue.objects.get(id=int(product_ids))))
            except:
                return  Response({'error': 'Объект не найден'})



class GetSavedProducts(APIView):
    def get(self, request):
        id = GET_get_id(request)
        if id == None:
            return Response({'error': 'Объект не найден'})
        user = User.objects.get(id=id)
        return Response(models.SavedProducts.objects.filter(user=user).values())



class GetNormOfNutrients(APIView):
    def get(self, request):
        id = GET_get_id(request)
        if id == None:
            return Response({'error': 'Объект не найден'})
        norm_of_nutrients = AdvancedUser.objects.get(user=User.objects.get(id=id)).norm_of_nutrients

        return Response({'norm_of_nutrients': norm_of_nutrients})



class GetRecipes(APIView):
    def get(self, request):
        title_search = request.GET.get('title_search')
        products_search = request.GET.get('products_search')
        if (title_search is not None and title_search != '' and title_search.isspace() is False) or (products_search is not None and products_search != '' and products_search.isspace() is False):
            recipes = serializers.SearchRecipesSerializer(models.Recipes.objects.all(), many=True).data

            def search(text, field):
                valid_ids = []
                text = text.lower().replace(',', ' ').split(' ')
                i = 0
                for recipe in recipes:
                    if i > 100:
                        break
                    valid = True
                    for word in text:
                        if word not in recipe[field].lower():
                            valid = False
                            break
                    if valid:
                        valid_ids.append(recipe['id'])
                        i += 1
                return valid_ids

            if title_search is not None:
                ids = search(title_search, 'title')
            elif products_search is not None:
                ids = search(products_search, 'ingredients')
            else:
                return Response({'error': 'Входные данные не корректны'})

            recipes = serializers.GetRecipesSerializer(models.Recipes.objects.filter(id__in=ids), many=True).data
            for recipe in recipes:
                recipe['photos'] = recipe['photos'].split(';')[0]
        else:
            recipes = serializers.GetRecipesSerializer(models.Recipes.objects.all().order_by('id')[:30], many=True).data
            for recipe in recipes:
                recipe['photos'] = recipe['photos'].split(';')[0]

        return Response(recipes)



class GetRecipe(APIView):
    def get(self, request):
        recipe_id = int(request.GET.get('recipe_id'))
        return Response(model_to_dict(models.Recipes.objects.get(id=recipe_id)))



class GetSiteStatistics(APIView):
    def get(self, request):
        products_count = NutritionalValue.objects.filter(is_product=True).count()
        recipes_count = Recipes.objects.all().count()
        return Response({'products_count': products_count, 'recipes_count': recipes_count})







class Registration(APIView):
    def post(self, request):
        query = request.data
        status = True

        try:
            username = query['username']
            password = query['password']
            email = query['email']

            user = User.objects.create_user(username=username, email=email, password=password)
            AdvancedUser.objects.create(user=user)

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)

                response = 'Пользователь зарегистрирован и аутентифицирован'
            else:
                response = 'Пользователь зарегистрирован без аутентификации'
        except:
            response = 'Входные данные некорректны или имя пользователя занято'
            status = False
        return Response({'response': response, 'status': status})



class Calculator(APIView):
    def post(self, request):
        query = request.data
        id = None
        weight = None
        height = None
        age = None
        gender = None
        activity_coefficient = None
        goal = None
        status = True
        response = None

        try:
            weight = float(query['weight'])
            height = float(query['height'])
            age = int(query['age'])
            gender = query['gender']
            activity_coefficient = int(query['activity_coefficient'])
            goal = query['goal']
            id = POST_get_id(query)
            if id is None:
                status = False
                response = 'Входные данные некорректны'
        except:
            status = False
            response = 'Входные данные некорректны'

        if status:
            norm_of_calories = None
            norm_of_proteins = None
            norm_of_fats = None
            norm_of_carbohydrates = None

            bmi = weight/((height/100)**2)
            if activity_coefficient == 1: activity_coefficient = 1.2
            elif activity_coefficient == 2: activity_coefficient = 1.375
            elif activity_coefficient == 3: activity_coefficient = 1.55
            elif activity_coefficient == 4: activity_coefficient = 1.7
            elif activity_coefficient == 5: activity_coefficient = 1.9

            if gender == 'man':
                norm_of_calories = (10*weight + 6.25*height - 5*age + 5)*activity_coefficient
            elif gender == 'women':
                norm_of_calories = (10*weight + 6.25*height - 5*age - 161)*activity_coefficient

            if goal == '0':
                norm_of_proteins = (norm_of_calories*0.15)/4
                norm_of_fats = (norm_of_calories*0.3)/9
                norm_of_carbohydrates = (norm_of_calories*0.55)/4
            if goal == '-':
                norm_of_calories *= 0.8
                norm_of_proteins = (norm_of_calories * 0.2)/4
                norm_of_fats = (norm_of_calories * 0.3)/9
                norm_of_carbohydrates = (norm_of_calories * 0.5)/4
            if goal == '+':
                norm_of_calories *= 1.2
                norm_of_proteins = (norm_of_calories * 0.25) / 4
                norm_of_fats = (norm_of_calories * 0.3) / 9
                norm_of_carbohydrates = (norm_of_calories * 0.45) / 4

            norm_of_calories = round(norm_of_calories, 2)
            norm_of_proteins = round(norm_of_proteins, 2)
            norm_of_fats = round(norm_of_fats, 2)
            norm_of_carbohydrates = round(norm_of_carbohydrates, 2)

            norm_of_nutrients = AdvancedUser.objects.get(user=User.objects.get(id=id))
            norm_of_nutrients.norm_of_nutrients = f'{norm_of_calories};{norm_of_proteins};{norm_of_fats};{norm_of_carbohydrates}'
            norm_of_nutrients.save()

            response = {
                'norm_of_carbohydrates': norm_of_carbohydrates,
                'norm_of_fats': norm_of_fats,
                'norm_of_proteins': norm_of_proteins,
                'norm_of_calories': norm_of_calories,
                'bmi': bmi
                }
        return Response({'response': response, 'status': status})



class SaveProduct(APIView):
    def post(self, request):
        query = request.data
        id = None
        product_id = None
        count = None
        response = None
        status = True

        try:
            product_id = int(query['product_id'])
            count = float(query['count'])
            id = POST_get_id(query)
            if id is None:
                status = False
                response = 'Входные данные некорректны'
        except:
            status = False
            response = 'Входные данные некорректны'

        if status:
            models.SavedProducts.objects.create(
                user=User.objects.get(id=id),
                product=models.NutritionalValue.objects.get(id=product_id),
                count=count
                )
            response = 'Объект добавлен'
        print(query)
        print(response)

        return Response({'response': response, 'is_done': status})



class DeleteSavedProduct(APIView):
    def post(self, request):
        query = request.data
        id = None
        saved_product_id = None
        response = None
        status = True

        try:
            saved_product_id = query['saved_product_id']
            id = POST_get_id(query)
            if id is None:
                status = False
                response = 'Входные данные некорректны'
        except:
            status = False
            response = 'Входные данные некорректны'

        if status:
            if saved_product_id == 'all':
                models.SavedProducts.objects.filter(user=User.objects.get(id=id)).delete()
                response = 'Удалены все элементы'
            else:
                try:
                    saved_product_id = int(saved_product_id)
                    models.SavedProducts.objects.get(id=saved_product_id).delete()
                    response = f'Удален объект {saved_product_id}'
                except:
                    status = False
                    response = 'Входные данные некорректны'
        return Response({'response': response, 'status': status})



class AddRecipe(APIView):
    def post(self, request):
        query = request.data
        status = True

        try:
            url = query['url']

            def add_recipe(recipe):
                nutrients = models.NutritionalValue.objects.create(
                    product=recipe['name'],
                    calories=recipe['nutrients']['calories'],
                    proteins=recipe['nutrients']['proteins'],
                    fats=recipe['nutrients']['fats'],
                    carbohydrates=recipe['nutrients']['carbohydrates'],
                    is_product=False
                )
                models.Recipes.objects.create(
                    title=recipe['name'],
                    description=recipe['description'],
                    count=int(recipe['count']),
                    time=recipe['time'],
                    ingredients=recipe['ingredients'],
                    nutritional_value=nutrients,
                    steps=recipe['steps'],
                    photos=recipe['photos']
                )

            if get_recipe(url.split(' ')[0]) is not None:
                print(url)
                if ' ' in url:
                    urls = url.split(' ')
                    for url in urls:
                        recipe = get_recipe(url)
                        if models.Recipes.objects.filter(title=recipe['name']).exists() is False:
                            add_recipe(recipe)
                        else:
                            response = 'Рецепт уже был добавлен'
                else:
                    recipe = get_recipe(url)
                    if models.Recipes.objects.filter(title=recipe['name']).exists() is False:
                        add_recipe(recipe)
                    else:
                        print(f'{recipe["name"]} уже добавлен')
                        response = 'Рецепт уже был добавлен'
                response = 'Рецепт успешно добавлен'
            else:
                status = False
                response = 'Входные данные некорректны'
        except:
            status = False
            response = 'Входные данные некорректны'

        return Response({'response': response, 'status': status})



class AddProduct(APIView):
    def post(self, request):
        query = request.data

        try:
            try:
                title = query['product']
                calories = query['calories']
                proteins = query['proteins']
                fats = query['fats']
                carbohydrates = query['carbohydrates']
                models.NutritionalValue.objects.create(
                    product = title,
                    calories = calories,
                    proteins = proteins,
                    fats = fats,
                    carbohydrates = carbohydrates,
                    is_product = True
                )
            except:
                return Response({'response': f'Продукт {query["product"]} не добавлен', 'status': True})
            return Response({'response': 'Продукт добавлен', 'status': True})
        except:
            status = False
            response = 'Входные данные некорректны'

        return Response({'response': response, 'status': status})



class GenerateTelegramToken(APIView):
    def post(self, request):
        query = request.data
        id = None
        token = None
        response = None
        status = True

        try:
            id = POST_get_id(query)
            if id is None:
                status = False
                response = 'Входные данные некорректны'
        except:
            status = False
            response = 'Входные данные некорректны'

        if status:
            token = randint(1000000, 9999999)
            while AdvancedUser.objects.filter(tg_id=token).exists():
                token = randint(1000000, 9999999)
            user = AdvancedUser.objects.get(user=id)
            user.tg_id = token
            user.save()
            response = 'Уникальный токен создан'

        return Response({
            'response': response,
            'status': status,
            'link': f'https://t.me/melanto_CalorieCalculator_bot?start={token}'})



class LinkTelegram(APIView):
    def post(self, request):
        try:
            token = int(request.data['token'])
            tg_id = request.data['tg_id']
            if AdvancedUser.objects.filter(tg_id=tg_id).exists():
                return Response({'status': False})
            else:
                user = AdvancedUser.objects.get(tg_id=token)
                user.tg_id = tg_id
                user.save()
                return Response({'status': True, 'username': user.user.username})
        except:
            return Response({'status': False})