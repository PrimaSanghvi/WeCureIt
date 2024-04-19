# Generated by Django 5.0.2 on 2024-04-11 17:57

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdminTable',
            fields=[
                ('admin_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=254)),
                ('last_name', models.CharField(max_length=254)),
                ('email', models.EmailField(max_length=254)),
                ('password', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(default=True)),
                ('phone_number', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Doctor',
            fields=[
                ('doctor_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=254)),
                ('last_name', models.CharField(max_length=254)),
                ('email', models.EmailField(max_length=254)),
                ('password', models.CharField(max_length=100)),
                ('phone_number', models.CharField(max_length=20)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('facility_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=254)),
                ('address', models.CharField(max_length=254)),
                ('rooms_no', models.IntegerField()),
                ('phone_number', models.BigIntegerField()),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('patient_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=254)),
                ('last_name', models.CharField(max_length=254)),
                ('email', models.EmailField(max_length=254)),
                ('password', models.CharField(max_length=100)),
                ('addressLine1', models.CharField(max_length=254)),
                ('addressLine2', models.CharField(blank=True, default=' ', max_length=254, null=True)),
                ('city', models.CharField(max_length=254)),
                ('state', models.CharField(max_length=254)),
                ('zipCode', models.IntegerField()),
                ('phone_number', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Speciality',
            fields=[
                ('speciality_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=254)),
            ],
        ),
        migrations.CreateModel(
            name='Doc_schedule',
            fields=[
                ('schedule_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('days_visiting', models.CharField(max_length=254)),
                ('visiting_hours_start', models.TimeField(null=True)),
                ('visiting_hours_end', models.TimeField(null=True)),
                ('doctor_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.doctor')),
                ('facility_id', models.ManyToManyField(to='weCureIt.facility')),
                ('speciality_id', models.ManyToManyField(to='weCureIt.speciality')),
            ],
        ),
        migrations.CreateModel(
            name='PatientPreference',
            fields=[
                ('patient_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='weCureIt.patient')),
                ('doctor_pref_id', models.CharField(max_length=254, null=True)),
                ('facility_pref_id', models.CharField(max_length=254, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Patient_record',
            fields=[
                ('patient_rec_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=254)),
                ('last_name', models.CharField(max_length=254)),
                ('medicine_prescribed', models.CharField(max_length=254)),
                ('disease', models.CharField(max_length=254)),
                ('comments', models.CharField(blank=True, max_length=254, null=True)),
                ('patient_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.patient')),
            ],
        ),
        migrations.CreateModel(
            name='PatientCreditCard',
            fields=[
                ('card_number', models.CharField(max_length=19, primary_key=True, serialize=False)),
                ('card_holder_name', models.CharField(max_length=100)),
                ('cvv', models.IntegerField()),
                ('addressLine1', models.CharField(max_length=254)),
                ('addressLine2', models.CharField(blank=True, default=' ', max_length=254, null=True)),
                ('city', models.CharField(max_length=254)),
                ('state', models.CharField(max_length=254)),
                ('zipCode', models.IntegerField()),
                ('expiry_date', models.CharField(max_length=254)),
                ('patient_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.patient')),
            ],
        ),
        migrations.AddField(
            model_name='facility',
            name='speciality_id',
            field=models.ManyToManyField(to='weCureIt.speciality'),
        ),
        migrations.AddField(
            model_name='doctor',
            name='speciality_id',
            field=models.ManyToManyField(to='weCureIt.speciality'),
        ),
        migrations.CreateModel(
            name='Appointments',
            fields=[
                ('appointment_id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('schedule_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.doc_schedule')),
                ('doctor_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.doctor')),
                ('facility_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.facility')),
                ('patient_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.patient')),
                ('patient_rec_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.patient_record')),
                ('speciality_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weCureIt.speciality')),
            ],
        ),
    ]