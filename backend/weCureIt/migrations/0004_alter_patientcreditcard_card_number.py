# Generated by Django 5.0.3 on 2024-05-06 19:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("weCureIt", "0003_alter_appointments_schedule_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="patientcreditcard",
            name="card_number",
            field=models.CharField(max_length=255, primary_key=True, serialize=False),
        ),
    ]
