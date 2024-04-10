# Generated by Django 5.0.3 on 2024-04-10 17:17

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("weCureIt", "0002_rename_admin_admintable"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="facility",
            name="speciality",
        ),
        migrations.AddField(
            model_name="facility",
            name="speciality_id",
            field=models.ManyToManyField(to="weCureIt.speciality"),
        ),
    ]