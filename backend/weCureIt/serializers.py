from rest_framework import serializers
from .models import *
from django.utils import timezone


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('patient_id', 'first_name','last_name','email','password','addressLine1','addressLine2','city','state','zipCode','phone_number')


class PatientLoginSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            patient = Patient.objects.get(email=data.get("email"))
            print("Patient found: ", patient.email)
            if data.get("password") != patient.password:
                raise serializers.ValidationError("Invalid login credentials")
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Invalid login credentials")
        
        # Optionally add the patient instance to the validated data if you need it later
        data['patient_id'] = patient.patient_id
        return data
    

class PatientCreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientCreditCard
        fields = ('patient_id','card_number', 'card_holder_name', 'cvv','addressLine1','addressLine2','city','state','zipCode', 'expiry_date')


class DoctorLoginSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            doctor = Doctor.objects.get(email=data.get("email"))
            print("Doctor found: ", doctor.email)
            if data.get("password") != doctor.password:
                raise serializers.ValidationError("Invalid login credentials")
        except Doctor.DoesNotExist:
            raise serializers.ValidationError("Invalid login credentials")
        
        # Optionally add the patient instance to the validated data if you need it later
        data['doctor_id'] = doctor.doctor_id
        return data
    

class AppointmentSerializer(serializers.ModelSerializer):
    PatientName = serializers.SerializerMethodField()
    Location = serializers.SerializerMethodField()
    DateTime = serializers.SerializerMethodField()
    # Assuming you will handle PatientMedicalInformation through a separate mechanism
    # since it might involve fetching or displaying more detailed records

    class Meta:
        model = Appointments
        fields = ('appointment_id', 'PatientName', 'DateTime', 'Location', 'patient_rec_id')

    def get_PatientName(self, obj):
        return f"{obj.patient_id.first_name} {obj.patient_id.last_name}"

    def get_Location(self, obj):
        return obj.facility_id.name
    
    def get_DateTime(self, obj):
    # Assuming 'date' is a DateField, 'start_time' and 'end_time' are TimeFields.
        appointment_date = obj.date.strftime("%m/%d/%Y")  # Correctly formats the date

    # Since start_time and end_time are TimeFields, they don't carry date information.
    # Formatting them should not include date formatting to avoid defaulting to 01/01/1900.
        start_time = obj.start_time.strftime("%I:%M %p")
        end_time = obj.end_time.strftime("%I:%M %p")

    # Concatenating the formatted date with the formatted start and end times.
        return f"{appointment_date} {start_time} - {end_time}"

class DocScheduleSerializer(serializers.ModelSerializer):
    facility_name = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    class Meta:
        model = Doc_schedule
        fields = ['days_visiting', 'visiting_hours_start', 'visiting_hours_end', 'facility_name', 'address']

    def get_facility_name(self, instance):
        # Check if there's an appointment at the facility for the selected date
        if getattr(instance, 'has_appointment_at_facility', False):
            return instance.facility_id.name
        return None

    def get_address(self, instance):
        if getattr(instance, 'has_appointment_at_facility', False):
            return instance.facility_id.address
        return None

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('first_name', 'last_name', 'email', 'phone_number','speciality')