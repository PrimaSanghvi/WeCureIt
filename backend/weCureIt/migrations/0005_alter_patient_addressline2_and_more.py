# Generated by Django 5.0.3 on 2024-04-02 01:33

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("weCureIt", "0004_rename_zipcode_patient_zipcode_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="patient",
            name="addressLine2",
            field=models.CharField(blank=True, default="", max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name="patientcreditcard",
            name="addressLine2",
            field=models.CharField(blank=True, default="", max_length=254, null=True),
        ),
    ]