from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('slug', 'category', 'game_name', 'views', 'created_at', 'updated_at')
    list_filter = ('category', 'game_name', 'default_language')
    search_fields = ('slug', 'game_name')
