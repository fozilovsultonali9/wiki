from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='pk', read_only=True)
    gameName = serializers.CharField(source='game_name', required=False)
    defaultLanguage = serializers.CharField(source='default_language', required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Article
        fields = [
            'id',
            'slug',
            'category',
            'gameName',
            'defaultLanguage',
            'translations',
            'views',
            'author',
            'createdAt',
            'updatedAt'
        ]

    def create(self, validated_data):
        slug = validated_data.get('slug')
        article, created = Article.objects.update_or_create(
            slug=slug,
            defaults=validated_data
        )
        return article
