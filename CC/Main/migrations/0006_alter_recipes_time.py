# Generated by Django 5.1.2 on 2024-11-30 21:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Main', '0005_recipes_recommended'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipes',
            name='time',
            field=models.CharField(max_length=30),
        ),
    ]
