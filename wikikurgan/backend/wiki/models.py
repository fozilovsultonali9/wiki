from django.db import models

class Article(models.Model):
    CATEGORY_CHOICES = [
        ('game', 'O\'yin'),
        ('character', 'Qahramon'),
        ('location', 'Joy'),
        ('item', 'Qurol / Artefakt'),
        ('faction', 'Tashkilot'),
        ('lore', 'Afsona'),
    ]

    slug = models.CharField(max_length=150, unique=True, db_index=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='character')
    game_name = models.CharField(max_length=200, default='CyberKurgan: Legend of Islom')
    default_language = models.CharField(max_length=10, default='uz')
    translations = models.JSONField(default=dict, help_text="JSON format multilingual translations")
    views = models.IntegerField(default=0)
    author = models.CharField(max_length=100, default='WikiKurgan Editor')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        uz_trans = self.translations.get('uz', {})
        title = uz_trans.get('title', self.slug)
        return f"{title} [{self.category}]"
