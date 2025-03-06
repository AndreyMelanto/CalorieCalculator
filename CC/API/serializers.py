from rest_framework.serializers import ModelSerializer
from Main.models import Recipes



class GetRecipesSerializer(ModelSerializer):
    class Meta:
        model = Recipes
        fields = ('id', 'title', 'photos')



class SearchRecipesSerializer(ModelSerializer):
    class Meta:
        model = Recipes
        fields = ('id', 'title', 'ingredients')