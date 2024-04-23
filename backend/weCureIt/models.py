# Create your models here.
from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.contrib.postgres.fields import ArrayField

# Create your models here.
# updated on 4.21
class Patient(models.Model):
    patient_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    email = models.EmailField(max_length = 254, unique=True)
    password = models.CharField(max_length=100)
    addressLine1 = models.CharField(max_length=254)
    addressLine2 = models.CharField(max_length=254, default = " ", null = True, blank = True)
    city = models.CharField(max_length=254)
    state = models.CharField(max_length=254)
    zipCode = models.IntegerField()
    phone_number = models.CharField(max_length=20)

    def save(self, *args, **kwargs):
        if self.password:
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

class PatientCreditCard(models.Model):
    patient_id = models.OneToOneField(Patient, on_delete=models.CASCADE, primary_key=True)
    card_number = models.CharField(max_length=19)
    card_holder_name =  models.CharField(max_length=100)
    cvv =  models.IntegerField()
    addressLine1 = models.CharField(max_length=254)
    addressLine2 = models.CharField(max_length=254, default = " ", null = True, blank = True)
    city = models.CharField(max_length=254)
    state = models.CharField(max_length=254)
    zipCode = models.IntegerField()
    expiry_date = models.CharField(max_length=254)

class PatientPreference(models.Model):
    patient_id = models.OneToOneField(Patient, on_delete=models.CASCADE, primary_key = True)
    doctor_pref_id = models.CharField(null=True, max_length=254)
    facility_pref_id = models.CharField(null=True, max_length=254)


class Speciality(models.Model):
    speciality_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    name = models.CharField(max_length=254)
# updated on 4.21
class Facility(models.Model):
    facility_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    name = models.CharField(max_length=254)
    addressLine1 = models.CharField(max_length=254)
    addressLine2 = models.CharField(max_length=254, default = " ", null = True, blank = True)
    city = models.CharField(max_length=254)
    state = models.CharField(max_length=254)
    zipCode = models.IntegerField()
    rooms_no = models.IntegerField()
    phone_number = models.CharField(max_length=254)
    speciality_id = models.ManyToManyField(Speciality)
    is_active = models.BooleanField(default=True)

class Doctor(models.Model):
    doctor_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    speciality_id = models.ManyToManyField(Speciality)
    email = models.EmailField(max_length = 254, unique=True)
    password = models.CharField(max_length=100) 
    phone_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.password:
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

class Doc_schedule(models.Model):
    schedule_id = models.BigAutoField(auto_created=True, primary_key=True, serialize=False)
    doctor_id = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    days_visiting = models.CharField(max_length=254)
    facility_id = models.ManyToManyField(Facility)
    visiting_hours_start = models.TimeField(null=True)
    visiting_hours_end = models.TimeField(null=True)
    speciality_id = models.ManyToManyField(Speciality)


class Patient_record(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    patient_rec_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    medical_diagnosis = models.CharField(max_length=254,null = True, blank = True)
    diagnosis_date = models.DateField(default=timezone.now) 
    symptoms = models.CharField(max_length=254,null = True, blank = True)
    temperature = models.CharField(max_length=254,null = True, blank = True)
    blood_pressure = models.CharField(max_length=254,null = True, blank = True)
    heart_rate = models.CharField(max_length=254,null = True, blank = True)
    respiratory_rate = models.CharField(max_length=254,null = True, blank = True)
    current_medications = models.CharField(max_length=254,null = True, blank = True)
    doctor_id = models.ForeignKey(Doctor, on_delete=models.CASCADE)

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
    date = models.DateField(default=timezone.now)  


class AdminTable(models.Model):
    admin_id  = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    email = models.EmailField(max_length = 254, unique=True)
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=20)

    def save(self, *args, **kwargs):
        if self.password:
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

class ManageRooms(models.Model):
    room_id = models.BigAutoField(auto_created = True,
                  primary_key = True,
                  serialize = False)
    facility_id = models.ForeignKey(Facility, on_delete=models.CASCADE)
    unavailable_room = ArrayField(models.IntegerField())
    date =  models.DateField(default=timezone.now)