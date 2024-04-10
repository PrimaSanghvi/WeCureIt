from django.db import models


# Create your models here.
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone


# Create your models here.
class Patient(models.Model):
    patient_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    email = models.EmailField(max_length = 254)
    password = models.CharField(max_length=100)
    addressLine1 = models.CharField(max_length=254)
    addressLine2 = models.CharField(max_length=254, default = " ", null = True, blank = True)
    city = models.CharField(max_length=254)
    state = models.CharField(max_length=254)
    zipCode = models.IntegerField()
    phone_number = models.CharField(max_length=20)

class PatientCreditCard(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=19, primary_key = True)
    card_holder_name =  models.CharField(max_length=100)
    cvv =  models.IntegerField()
    addressLine1 = models.CharField(max_length=254)
    addressLine2 = models.CharField(max_length=254, default = " ", null = True, blank = True)
    city = models.CharField(max_length=254)
    state = models.CharField(max_length=254)
    zipCode = models.IntegerField()
    expiry_date = models.CharField(max_length=254)

class Patient_record(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    patient_rec_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    medicine_prescribed =  models.CharField(max_length=254)
    disease = models.CharField(max_length=254)
    comments = models.CharField(max_length=254,null = True, blank = True)

class PatientPreference(models.Model):
    patient_id = models.OneToOneField(Patient, on_delete=models.CASCADE, primary_key = True)
    doctor_pref_id = models.CharField(null=True, max_length=254)
    facility_pref_id = models.CharField(null=True, max_length=254)


class Facility(models.Model):
    facility_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    name = models.CharField(max_length=254)
    address = models.CharField(max_length=254)
    rooms_no = models.IntegerField()
    phone_number = models.BigIntegerField()
    speciality = ArrayField(models.CharField(max_length=254))
    is_active = models.BooleanField(default=True)


class Speciality(models.Model):
    speciality_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    name = models.CharField(max_length=254)

class Doctor(models.Model):
    doctor_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    speciality_id = models.ManyToManyField(Speciality)
    email = models.EmailField(max_length = 254)
    password = models.CharField(max_length=100) 
    phone_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)

class Doc_schedule(models.Model):
    schedule_id = models.BigAutoField(auto_created=True, primary_key=True, serialize=False)
    doctor_id = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    days_visiting = models.CharField(max_length=254)
    facility_id = models.ManyToManyField(Facility)
    visiting_hours_start = models.TimeField(null=True)
    visiting_hours_end = models.TimeField(null=True)
    speciality_id = models.ManyToManyField(Speciality)

class Appointments(models.Model):
    appointment_id =models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    facility_id = models.ForeignKey(Facility, on_delete=models.CASCADE)
    doctor_id = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    speciality_id = models.ForeignKey(Speciality, on_delete=models.CASCADE)
    schedule_id =  models.ForeignKey(Doc_schedule, on_delete=models.CASCADE)
    patient_rec_id = models.ForeignKey(Patient_record, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField(default=timezone.now)  # Add this line


class AdminTable(models.Model):
    admin_id  = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    email = models.EmailField(max_length = 254)
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=20)
