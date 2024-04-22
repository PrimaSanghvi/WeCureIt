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
    
class PatientPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientPreference
        fields = ('patient_id', 'doctor_pref_id', 'facility_pref_id')

class AllDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('doctor_id', 'first_name', 'last_name', 'speciality_id', 'email', 'password', 'phone_number', 'is_active')
## here i update the address => addressLine1
class AllFacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ('facility_id', 'addressLine1','addressLine2','city' , 'state', 'zipCode', 'name', 'rooms_no', 'phone_number', 'is_active')

# add doctor schedule to the database(handle repeated adding cases)
# to distinguish from another DocSchedule Serializer
class DocScheduleSerializerAdd(serializers.ModelSerializer):
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    facility_id = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), many=True)
    speciality_id = serializers.PrimaryKeyRelatedField(queryset=Speciality.objects.all(), many=True)

    class Meta:
        model = Doc_schedule
        fields = '__all__'

    def create(self, validated_data):
        # Extract facilities and specialties to handle them after instance creation
        facilities = validated_data.pop('facility_id', [])
        specialties = validated_data.pop('speciality_id', [])
        instance, created = Doc_schedule.objects.update_or_create(
            doctor_id=validated_data.get('doctor_id'),
            defaults=validated_data
        )
        # Handling ManyToMany fields
        if facilities:
            instance.facility_id.set(facilities)
        if specialties:
            instance.speciality_id.set(specialties)
        return instance

    def update(self, instance, validated_data):
        instance.days_visiting = validated_data.get('days_visiting', instance.days_visiting)
        instance.visiting_hours_start = validated_data.get('visiting_hours_start', instance.visiting_hours_start)
        instance.visiting_hours_end = validated_data.get('visiting_hours_end', instance.visiting_hours_end)
        facilities = validated_data.get('facility_id')
        specialties = validated_data.get('speciality_id')
        if facilities:
            instance.facility_id.set(facilities)
        if specialties:
            instance.speciality_id.set(specialties)
        instance.save()
        return instance
    
# handle the doctor_schedule facility delete
class FacilityUnlinkSerializer(serializers.Serializer):
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    facility_id = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all())

    def save(self):
        doctor_id = self.validated_data['doctor_id']
        facility_id = self.validated_data['facility_id']
        
        # Directly manipulating the through table
        schedules = Doc_schedule.objects.filter(doctor_id=doctor_id)
        for schedule in schedules:
            schedule.facility_id.remove(facility_id)  # This removes the relationship not the facility itself

# handle the doctor_schedule speciality delete
class SpecialtyUnlinkSerializer(serializers.Serializer):
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    speciality_id = serializers.PrimaryKeyRelatedField(queryset=Speciality.objects.all())

    def save(self):
        doctor_id = self.validated_data['doctor_id']
        speciality_id = self.validated_data['speciality_id']
        
        # Get all schedules for the given doctor
        schedules = Doc_schedule.objects.filter(doctor_id=doctor_id)
        for schedule in schedules:
            # Remove the specialty from the schedule
            schedule.speciality_id.remove(speciality_id)

# to handle the doctor schedule filter
class DocScheduleSerializerFilter(serializers.ModelSerializer):
    doctor = AllDoctorSerializer(source='doctor_id', read_only=True)
    facility = AllFacilitySerializer(source='facility_id', many=True, read_only=True)
    speciality = SpecialitySerializer(source='speciality_id', many=True, read_only=True)

    class Meta:
        model = Doc_schedule
        fields = ('schedule_id', 'doctor', 'facility', 'speciality', 'days_visiting', 'visiting_hours_start', 'visiting_hours_end')
        