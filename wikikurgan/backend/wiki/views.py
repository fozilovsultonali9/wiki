from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all().order_by('-updated_at')
    serializer_class = ArticleSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        qs = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        category_filter = self.request.query_params.get('category', None)

        if category_filter and category_filter != 'all':
            qs = qs.filter(category=category_filter)

        if search_query:
            qs = qs.filter(slug__icontains=search_query) | qs.filter(game_name__icontains=search_query)

        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
