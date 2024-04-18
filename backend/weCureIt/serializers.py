from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import check_password
from django.db.models import Q,Subquery, OuterRef
from datetime import timedelta
import datetime


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
            if not check_password(data.get("password"), patient.password):
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
            if not check_password(data.get("password"), doctor.password):
                raise serializers.ValidationError("Invalid login credentials")
        except Patient.DoesNotExist:
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

class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = ('speciality_id','name')

class DoctorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('doctor_id','first_name','last_name','speciality','email','is_active')


class DoctorInfoSerializer(serializers.ModelSerializer):
    speciality_id = serializers.PrimaryKeyRelatedField(
        queryset=Speciality.objects.all(),
        many=True,
        write_only=True,
        source='speciality'
    )

    speciality = SpecialitySerializer(many=True, read_only=True,source='speciality_id') 

    class Meta:
        model = Doctor
        fields = ('doctor_id', 'first_name', 'last_name', 'speciality_id', 'password', 'speciality','phone_number', 'email', 'is_active')

    def create(self, validated_data):
        # `speciality` is now directly in validated_data thanks to `source='speciality'`
        specialities = validated_data.pop('speciality', [])
        doctor = Doctor.objects.create(**validated_data)
        doctor.speciality_id.set(specialities)  # Use set() for many-to-many relationships
        return doctor

    def update(self, instance, validated_data):
        specialities = validated_data.pop('speciality', [])
        # Update scalar fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # Update many-to-many fields
        instance.speciality_id.set(specialities)
        return instance

class AdminLoginSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            admin = AdminTable.objects.get(email=data.get("email"))
            print("Admin found: ", admin.email)
            if data.get("password") != admin.password:
                raise serializers.ValidationError("Invalid login credentials")
        except AdminTable.DoesNotExist:
            raise serializers.ValidationError("Invalid login credentials")
        
        # Optionally add the patient instance to the validated data if you need it later
        data['admin_id'] = admin.admin_id
        return data
 
    
class FacilitySerializer(serializers.ModelSerializer):
    speciality_id = serializers.PrimaryKeyRelatedField(
        queryset=Speciality.objects.all(),
        many=True,
        write_only=True,
        source='speciality'
    )
    speciality = SpecialitySerializer(many=True, read_only=True, source='speciality_id')

    class Meta:
        model = Facility
        fields = ['facility_id', 'name', 'addressLine1', 'addressLine2', 'state','city','zipCode','rooms_no', 'phone_number', 'is_active', 'speciality_id', 'speciality']

    def create(self, validated_data):
        # Extract specialties using the source argument 'speciality'
        specialties = validated_data.pop('speciality', [])
        facility = Facility.objects.create(**validated_data)
        facility.speciality_id.set(specialties)  # Set the many-to-many relation
        return facility

    def update(self, instance, validated_data):
        specialties = validated_data.pop('speciality', [])
        # Update scalar fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # Update many-to-many fields
        instance.speciality_id.set(specialties)
        return instance

class AvailableDoctorsSerializer(serializers.Serializer):
    speciality_id = serializers.IntegerField(required=False, allow_null=True)
    facility_id = serializers.IntegerField(required=False, allow_null=True)
    doctor_id = serializers.IntegerField(required=False, allow_null=True)
    date = serializers.DateField(format="%d/%m/%Y", input_formats=["%d/%m/%Y"])
    appointment_length = serializers.ChoiceField(choices=[15, 30, 60])

    def get_available_doctors(self):
        date = self.validated_data.get('date')
        weekday = date.strftime("%A").lower()
        appointment_length = int(self.validated_data.get('appointment_length'))

        # Start building the query
        query = Q(days_visiting__icontains=weekday)

        # Specialty-based doctor filtering
        if 'speciality_id' in self.validated_data:
            specialty_id = self.validated_data['speciality_id']
            doctor_ids = Doc_schedule.objects.filter(
                speciality_id=specialty_id
            ).values_list('doctor_id', flat=True)
            query &= Q(doctor_id__in=doctor_ids)


        if 'doctor_id' in self.validated_data:
            doctor_id = self.validated_data['doctor_id']
            doctor_ids = Doc_schedule.objects.filter(
                doctor_id=doctor_id
            ).values_list('doctor_id', flat=True)
            query &= Q(doctor_id=self.validated_data['doctor_id'])

        if 'facility_id' in self.validated_data:
            facility_id = self.validated_data['facility_id']
            doctor_ids = Doc_schedule.objects.filter(
                facility_id=facility_id
            ).values_list('doctor_id', flat=True)
            query &= Q(doctor_id__in=doctor_ids)

        any_appointments_booked = False
        # Fetch schedules that match the dynamic query
        schedules = Doc_schedule.objects.filter(query).distinct()
        available_doctors = []
       

        for schedule in schedules:
            if 'speciality_id' in self.validated_data and 'facility_id' not in self.validated_data and 'doctor_id' not in self.validated_data:
                    speciality_id = self.validated_data['speciality_id']
                    facilities = schedule.facility_id.filter(
                    is_active=True, 
                    speciality_id=speciality_id  # Ensure facility is linked to the specified specialty
                    )
    
                    for facility in facilities:
                        if Appointments.objects.filter(
                        doctor_id=schedule.doctor_id_id,
                        facility_id=facility.facility_id,
                        date=date
        ).exists() :
                            any_appointments_booked = True
                            break

                        if any_appointments_booked:
                            break
                        
                    for facility in facilities:
                        appointments = Appointments.objects.filter(
                        doctor_id=schedule.doctor_id_id,
                        facility_id=facility.facility_id,
                        date=date
        )
                        slots = self.calculate_time_slots(date, appointments, appointment_length)
                        if any_appointments_booked:
                            if appointments.exists():
                                for appointment in appointments:
                                    if appointment.doctor_id_id == schedule.doctor_id.doctor_id:  
                                        available_doctors.append({
                    'doctor_id': schedule.doctor_id.doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': self.validated_data.get('speciality_id'),
                    'available_slots': slots
                    })
                        else:   
                                available_doctors.append({
                    'doctor_id': schedule.doctor_id.doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': self.validated_data.get('speciality_id'),
                    'available_slots': slots
                    })

            if 'facility_id' in self.validated_data:
                if 'speciality_id' in self.validated_data:
                    facilities = Facility.objects.filter(facility_id=self.validated_data['facility_id'],speciality_id = self.validated_data['speciality_id'], is_active=True)  
                    specialty_ids = [self.validated_data.get('speciality_id')]               
                elif 'doctor_id' in self.validated_data :
                    facilities = schedule.facility_id.filter(facility_id=self.validated_data['facility_id'],is_active=True)
                    specialty_ids = list(schedule.speciality_id.values_list('speciality_id', flat=True))  
                else: 
                    facilities = Facility.objects.filter(facility_id=self.validated_data['facility_id'], is_active=True)
                    specialty_ids = list(schedule.speciality_id.values_list('speciality_id', flat=True))
                for facility in facilities:
                    if Appointments.objects.filter(
                    doctor_id=self.validated_data.get('doctor_id') if self.validated_data.get('doctor_id') else schedule.doctor_id_id,
                    facility_id=self.validated_data.get('facility_id'),
                    date=date
                ).exists() :
                        any_appointments_booked = True
                        break

                    if any_appointments_booked:
                        break

                    
                for facility in facilities:
                        appointments = Appointments.objects.filter(
                    doctor_id=self.validated_data.get('doctor_id') if self.validated_data.get('doctor_id') else schedule.doctor_id_id,
                    facility_id=self.validated_data.get('facility_id'),
                    date=date
                )
                        slots = self.calculate_time_slots(date, appointments, appointment_length)
                        if any_appointments_booked:
                            if appointments.exists():
                                for appointment in appointments:
                                    if(appointment.doctor_id_id == schedule.doctor_id.doctor_id):
                                        available_doctors.append({
                    'doctor_id': schedule.doctor_id.doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': specialty_ids,
                    'available_slots': slots
                })
                            
                        else:
                        
                            available_doctors.append({
                    'doctor_id': schedule.doctor_id.doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': specialty_ids,
                    'available_slots': slots
                })
                    
                    
            if 'doctor_id' in self.validated_data and'facility_id' not in  self.validated_data:
                print("3")
                if 'speciality_id' in self.validated_data:
                    facilities = schedule.facility_id.filter(is_active=True, speciality_id = self.validated_data['speciality_id'])  
                    specialty_ids = self.validated_data.get('speciality_id')
                else : 
                    facilities = schedule.facility_id.filter(is_active=True)
                    specialty_ids = list(schedule.speciality_id.values_list('speciality_id', flat=True))
                    

                for facility in facilities:
                    if Appointments.objects.filter(
                    doctor_id=doctor_id,  # Ensure this uses the specific doctor_id
                    facility_id=facility.facility_id,
                    date=date   
                ).exists():
                              
                        any_appointments_booked = True
                        break

                    if any_appointments_booked:
                        break

                for facility in facilities:
                        appointments = Appointments.objects.filter(
                    doctor_id=doctor_id,  # Ensure this uses the specific doctor_id
                    facility_id=facility.facility_id,
                    date=date    
                )     
                        slots = self.calculate_time_slots(date, appointments, appointment_length) 
                        if any_appointments_booked:
                            if appointments.exists():
                                for appointment in appointments:
                                    if appointment.doctor_id_id == schedule.doctor_id.doctor_id:  
                                        available_doctors = [] 
                                available_doctors.append({
                    'doctor_id': schedule.doctor_id.doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': specialty_ids,
                    'available_slots': slots
                })
                            
                            
                        else:
                            
                            available_doctors.append({
                    'doctor_id': doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': specialty_ids,
                    'available_slots': slots
                })
            
        return available_doctors

    def calculate_time_slots(self, date, appointments, duration):
        work_start = datetime.time(9, 0)
        work_end = datetime.time(17, 0)
        start_datetime = datetime.datetime.combine(date, work_start)
        end_datetime = datetime.datetime.combine(date, work_end)

        current_time = start_datetime
        available_slots = []

        while current_time + datetime.timedelta(minutes=duration) <= end_datetime:
            end_time = current_time + datetime.timedelta(minutes=duration)
            if not any(app.start_time <= current_time.time() < app.end_time or app.start_time < end_time.time() <= app.end_time for app in appointments):
                available_slots.append({'start': current_time.time().strftime('%H:%M'), 'end': end_time.time().strftime('%H:%M')})
            current_time += datetime.timedelta(minutes=duration + 10)  # Assuming a 10-minute buffer between appointments

        return available_slots
