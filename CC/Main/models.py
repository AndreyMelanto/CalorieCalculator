from django.core.validators import MinValueValidator
from django.db import models
from django.contrib.auth.models import User



class NutritionalValue(models.Model):
    class Meta:
        verbose_name = 'Пищевая ценность'
        verbose_name_plural = 'Пищевые ценности'

    product = models.CharField(max_length=100, verbose_name='Продукт')
    calories = models.FloatField(validators=[MinValueValidator(0)], verbose_name='Калорийность')
    proteins = models.FloatField(validators=[MinValueValidator(0)], verbose_name='Белки')
    fats = models.FloatField(validators=[MinValueValidator(0)], verbose_name='Жиры')
    carbohydrates = models.FloatField(validators=[MinValueValidator(0)], verbose_name='Углеводы')
    is_product = models.BooleanField(default=True, verbose_name='Является продуктом')

    def __str__(self):
        return self.product



class SavedProducts(models.Model):
    class Meta:
        verbose_name = 'Продукт пользователя'
        verbose_name_plural = 'Продукты пользователей'

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    product = models.ForeignKey(NutritionalValue, on_delete=models.CASCADE, verbose_name='Продукт')
    count = models.IntegerField(verbose_name='Масса продукта')

    def __str__(self):
        return f'{self.user.username}\'s {self.product}'



class Recipes(models.Model):
    class Meta:
        verbose_name = 'Рецепт'
        verbose_name_plural = 'Рецепты'

    title = models.CharField(max_length=70, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    count = models.IntegerField(verbose_name='Количество порций')
    time = models.CharField(max_length=30, verbose_name='Время пригтовления')  # хранит: общее;активное ИЛИ общее;None
    ingredients = models.TextField(verbose_name='Ингредиенты')   # хранит закодированные данные, декодер - API.parser.decode_products()
    nutritional_value = models.OneToOneField(NutritionalValue, on_delete=models.SET_NULL, null=True, verbose_name='Пищевая ценность')
    steps = models.TextField(verbose_name='Шаги приготовления') # хранит: первый шаг;второй шаг;
    photos = models.TextField(verbose_name='Фотографии') # хранит: фото к первому шагу;хранит: фото ко второму шагу;

    def __str__(self):
        return self.title