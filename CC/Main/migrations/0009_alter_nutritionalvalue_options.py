# Generated by Django 5.1.2 on 2024-12-21 11:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Main', '0008_alter_recipes_count'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='nutritionalvalue',
            options={'verbose_name': 'Пищевая ценность', 'verbose_name_plural': 'Пищевые ценности'},
        ),
    ]
