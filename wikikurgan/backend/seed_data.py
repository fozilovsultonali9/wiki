import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wikibackend.settings')
django.setup()

from wiki.models import Article

INITIAL_ARTICLES_DATA = [
    {
        'slug': 'cyberkurgan',
        'category': 'game',
        'game_name': 'CyberKurgan: Legend of Islom',
        'default_language': 'uz',
        'translations': {
            'uz': {
                'title': 'CyberKurgan: Legend of Islom',
                'summary': "CyberKurgan - kelajakdagi kiber-olamda kechuvchi sarguzashtli va jangovar RPG o'yini bo'lib, uning bosh qahramoni afsonaviy jangchi Islom hisoblanadi.",
                'content': """== O'yin haqida umumiy ma'lumot ==
'''CyberKurgan: Legend of Islom''' - bu 2077-yildagi post-apokaliptik Toshkent hududida bo'lib o'tadigan ochiq dunyoli harakatli va rolli o'yin (RPG). O'yinda kiber-neyron texnologiyalar, plazma qurollari va qadimgi jang san'ati uyg'unlashgan. 

O'yinning asosiy sarguzashti kiber-jangchi [[Islom]] va uning hamrohi [[Aleksey]] atrofida kechadi. Ular [[Toshkent Zonaviy Markaz]] hududidagi yovuz kiber-korporatsiyalarga qarshi kurashadilar.

== Syujet va Qahramonlar ==
O'yin voqealari bio-kiber urushlardan so'ng boshlanadi. Bosh qahramon [[Islom]] - afsonaviy jangchi va kiber-neyron texnikasi ustasi bo'lib, u xalqni zulmdan ozod qilish uchun kurashga otlanadi. [[Islom]] o'zining noyob [[Plazma Qilichi]] va plazma qobiliyatlari bilan tanilgan.

Safarda unga tajribali xaker va muhandis [[Aleksey]] yordam beradi. Ular birgalikda kiber-hukmdorlarning sirli rejasini barbod qilishlari kerak.""",
                'infobox': {
                    'title': 'CyberKurgan: Legend of Islom',
                    'subtitle': 'Kiber-RPG oʻyini',
                    'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
                    'details': {
                        'Janr': 'Action RPG, Cyberpunk',
                        'Dasturchi': 'Kurgan Interactive',
                        'Platformalar': 'PC, PS5, Xbox Series X'
                    },
                    'stats': {
                        'Reyting': '9.8 / 10',
                        'O\'yin vaqti': '45+ soat'
                    }
                }
            }
        }
    },
    {
        'slug': 'islom',
        'category': 'character',
        'game_name': 'CyberKurgan: Legend of Islom',
        'default_language': 'uz',
        'translations': {
            'uz': {
                'title': 'Islom (Qahramon)',
                'summary': "Islom - CyberKurgan o'yinining bosh qahramoni, kiber-neyron texnologiyalari va Plazma Qilichi ustasi.",
                'content': """== Biografiya ==
'''Islom''' - CyberKurgan kiber-olamidagi bosh qahramon va ozodlik jangchisi. U 2052-yilda tug'ilgan bo'lib, yoshligidanoq jang san'ati va neyro-kiber texnologiyalarni mukammal egallagan.

[[Toshkent Zonaviy Markaz]] dagi bio-laboratoriya halokatidan so'ng, Islom o'zining neyron implantlarini faollashtirdi va adolat uchun kurashga kirdi. U o'zining yaqin do'sti [[Aleksey]] bilan birgalikda o'yin tarixidagi eng murakkab topshiriqlarni bajaradi.

== Qurollari va Qobiliyatlari ==
Islom jangda o'ziga xos taktikani qo'llaydi:
* '''[[Plazma Qilichi]]:''' 1000°C haroratli plazma poyasiga ega bo'lib, har qanday kiber-zirhni kesib o'tadi.
* '''Kiber-Neyron Zarbasi:''' Dushmanlarning raqamli tizimlarini masofadan turib falaj qilish va ularning harakatini to'xtatish.

== Iqtiboslar ==
<blockquote>"Haqiqiy kuch zirhda yoki chipda emas, balki erkinlik uchun urayotgan yurakdadir." — '''Islom'''</blockquote>""",
                'infobox': {
                    'title': 'Islom',
                    'subtitle': 'CyberKurgan Bosh Qahramoni',
                    'image': 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=600&q=80',
                    'details': {
                        'To\'liq ismi': 'Islomiddin Kiber-Jangchi',
                        'Rol': 'Bosh Qahramon (Protagonist)',
                        'Asosiy qurol': 'Plazma Qilichi',
                        'Hamrohi': 'Aleksey'
                    },
                    'stats': {
                        'Sog\'liq (HP)': '1500 / 1500',
                        'Daraja (Level)': '75 Max'
                    }
                }
            }
        }
    }
]

def seed():
    print("Database seeding initializing...")
    for item in INITIAL_ARTICLES_DATA:
        article, created = Article.objects.update_or_create(
            slug=item['slug'],
            defaults=item
        )
        status = "Created" if created else "Updated"
        print(f"[{status}] Article: {article.slug}")
    print("Seeding finished successfully!")

if __name__ == '__main__':
    seed()
