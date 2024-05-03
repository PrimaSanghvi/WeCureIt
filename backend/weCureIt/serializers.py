from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import check_password
from django.db.models import Q,Subquery, OuterRef
from datetime import timedelta
import datetime
from django.db.models import Sum

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

class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    validEmail = serializers.BooleanField()

    def validate(self, data):
        try:
            patient = Patient.objects.get(email=data.get("email"))
            data["validEmail"] = True
        except Patient.DoesNotExist:
            try:
                doctor = Doctor.objects.get(email=data.get("email"))
                data["validEmail"] = True
            except Doctor.DoesNotExist:
                try:
                    admin = AdminTable.objects.get(email=data.get("email"))
                    data["validEmail"] = True
                except:
                    data["validEmail"] = False
        return data

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
    DoctorName = serializers.SerializerMethodField()
    SpecialityType = serializers.SerializerMethodField()
    Address = serializers.SerializerMethodField()
    DateOnly = serializers.SerializerMethodField()
    TimeOnly = serializers.SerializerMethodField()
    # Assuming you will handle PatientMedicalInformation through a separate mechanism
    # since it might involve fetching or displaying more detailed records

    class Meta:
        model = Appointments
        fields = ('appointment_id', 'PatientName', 'DateTime', 'Location', 'patient_rec_id','patient_id',
                  'speciality_id','facility_id', 'DoctorName', 'SpecialityType', 'Address', 'start_time', 'end_time', 'date',
                  'DateOnly', 'TimeOnly')

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
    
    def get_DoctorName(self, obj):
        return f"{obj.doctor_id.first_name} {obj.doctor_id.last_name}"
    
    def get_SpecialityType(self, obj):
        return obj.speciality_id.name
    
    def get_Address(self, obj):
        return f"{obj.facility_id.addressLine1} {obj.facility_id.city} {obj.facility_id.state}, {obj.facility_id.zipCode}"
    
    def get_DateOnly(self, obj):
        appointment_date = obj.date.strftime("%m/%d/%Y")  # Correctly formats the date

        return f"{appointment_date}"

    def get_TimeOnly(self, obj):
        start_time = obj.start_time.strftime("%I:%M %p")
        end_time = obj.end_time.strftime("%I:%M %p")

        return f"{start_time} - {end_time}"

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
            if not check_password(data.get("password"), admin.password):
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
        fields = ('facility_id', 'name', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'rooms_no', 'phone_number', 'is_active')

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
            work_start = schedule.visiting_hours_start
            work_end = schedule.visiting_hours_end
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
                        slots = self.calculate_time_slots(date, facility.facility_id, work_start, work_end,  appointments, appointment_length)
                        #slots = self.calculate_time_slots(date, facility.facility_id, schedule.doctor_id_id, appointments, appointment_length)
                        print("doctor_id_id", schedule.doctor_id_id)
                        if any_appointments_booked:
                            if appointments.exists():
                                added_doctor_ids = set()
                                for appointment in appointments:
                                    doctor_id = appointment.doctor_id_id
                                    if doctor_id not in added_doctor_ids and doctor_id == schedule.doctor_id.doctor_id:
                                        added_doctor_ids.add(doctor_id)
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
                    print("check")
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
                        slots = self.calculate_time_slots(date, facility.facility_id, work_start, work_end, appointments, appointment_length)
                        # slots = self.calculate_time_slots(date, self.validated_data.get('facility_id'), schedule.doctor_id_id, appointments, appointment_length)
                        if any_appointments_booked:
                            if appointments.exists():
                                added_doctor_ids = set()
                                for appointment in appointments:
                                    doctor_id = appointment.doctor_id_id
                                    if doctor_id not in added_doctor_ids and doctor_id == schedule.doctor_id.doctor_id:
                                        added_doctor_ids.add(doctor_id)
                                        available_doctors.append({
                    'doctor_id': schedule.doctor_id.doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': specialty_ids,
                    'available_slots': slots
                })
                                    elif doctor_id not in added_doctor_ids :

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
                if 'speciality_id' in self.validated_data:
                    print("last condition")
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
                        slots = self.calculate_time_slots(date, facility.facility_id, work_start, work_end, appointments, appointment_length) 
                        # slots = self.calculate_time_slots(date, facility.facility_id, doctor_id, appointments, appointment_length)
                        if any_appointments_booked:
                            if appointments.exists():
                                added_doctor_ids = set() 
                                for appointment in appointments:
                                    doctor_id = appointment.doctor_id_id
                                    if doctor_id not in added_doctor_ids and doctor_id == schedule.doctor_id.doctor_id:
                                        added_doctor_ids.add(doctor_id)
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


    # def calculate_time_slots(self, date, appointments, duration):
    #     work_start = datetime.time(9, 0)
    #     work_end = datetime.time(17, 0)
    #     start_datetime = datetime.datetime.combine(date, work_start)
    #     end_datetime = datetime.datetime.combine(date, work_end)

    #     current_time = start_datetime
    #     available_slots = []

    #     while current_time + datetime.timedelta(minutes=duration) <= end_datetime:
    #         end_time = current_time + datetime.timedelta(minutes=duration)
    #         next_possible_start = end_time + datetime.timedelta(minutes=10)  # Next possible start time including buffer

    #         # Check for appointment overlaps, ensuring a 10-minute break between end of last appointment and start of new one.
    #         if not any((app.start_time <= current_time.time() < app.end_time) or (app.start_time < next_possible_start.time() <= app.end_time) for app in appointments):
    #             available_slots.append({'start': current_time.time().strftime('%H:%M'), 'end': end_time.time().strftime('%H:%M')})
            
    #         # Move to the next time slot, trying to align as closely as possible with end times of existing appointments
    #         if appointments:
    #             # Finding the closest next start time after the last appointment and buffer period
    #             last_appointment_end = max((app.end_time for app in appointments if app.end_time <= next_possible_start.time()), default=None)
    #             if last_appointment_end:
    #                 # Adjust current time to be after the last appointment ends plus buffer
    #                 adjusted_start_time = datetime.datetime.combine(date, last_appointment_end) + datetime.timedelta(minutes=10)
    #                 if adjusted_start_time.time() > current_time.time():
    #                     current_time = adjusted_start_time
    #                 else:
    #                     current_time += datetime.timedelta(minutes=duration + 10)
    #             else:
    #                 current_time += datetime.timedelta(minutes=duration + 10)
    #         else:
    #             current_time += datetime.timedelta(minutes=duration + 10)

    #     return available_slots

    def calculate_time_slots(self, date, facility_id, work_start, work_end, appointments, duration):
        # work_start = datetime.time(9, 0)
        # work_end = datetime.time(17, 0)
        start_datetime = datetime.datetime.combine(date, work_start)
        end_datetime = datetime.datetime.combine(date, work_end)

        total_rooms = Facility.objects.get(facility_id=facility_id).rooms_no
        unavailable_rooms = ManageRooms.objects.filter(facility_id=facility_id, date=date).aggregate(sum_unavailable_rooms=Sum('unvailable_room'))['sum_unavailable_rooms'] or 0
        available_rooms = total_rooms - unavailable_rooms

        current_time = start_datetime
        available_slots = []

        # while current_time + datetime.timedelta(minutes=duration) <= end_datetime:
        #     end_time = current_time + datetime.timedelta(minutes=duration)
        #     if not any(app.start_time <= current_time.time() < app.end_time or app.start_time < end_time.time() <= app.end_time for app in appointments):
        #         available_slots.append({'start': current_time.time().strftime('%H:%M'), 'end': end_time.time().strftime('%H:%M')})
        #     current_time += datetime.timedelta(minutes=duration + 10)  # Assuming a 10-minute buffer between appointments

        # return available_slots
        while current_time + datetime.timedelta(minutes=duration) <= end_datetime:
            end_time = current_time + datetime.timedelta(minutes=duration)
            next_start_time = current_time + datetime.timedelta(minutes=duration + 10)  # Include buffer

            # Check for overlapping appointments
            overlapping_appointments = Appointments.objects.filter(
                facility_id=facility_id,
                date=date,
                start_time__lt=end_time.time(),
                end_time__gt=current_time.time()
            ).count()

            # Check for room availability and no overlapping appointments
            if overlapping_appointments < available_rooms and not any(
                app.start_time <= current_time.time() < app.end_time or 
                app.start_time < end_time.time() <= app.end_time for app in appointments):
                available_slots.append({'start': current_time.time().strftime('%H:%M'), 'end': end_time.time().strftime('%H:%M')})

            current_time += datetime.timedelta(minutes=duration + 10)  # Proceed to the next potential time slot

        return available_slots
    
class AllDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('doctor_id', 'first_name', 'last_name', 'speciality_id', 'email', 'password', 'phone_number', 'is_active')
## here i update the address => addressLine1
class AllFacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ('facility_id', 'name', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'rooms_no', 'phone_number', 'is_active')

    
class DocScheduleSerializerFilter(serializers.ModelSerializer):
    doctor = AllDoctorSerializer(source='doctor_id', read_only=True)
    facility = AllFacilitySerializer(source='facility_id', many=True, read_only=True)
    speciality = SpecialitySerializer(source='speciality_id', many=True, read_only=True)

    class Meta:
        model = Doc_schedule
        fields = ('schedule_id', 'doctor', 'facility', 'speciality', 'days_visiting', 'visiting_hours_start', 'visiting_hours_end')

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointments
        fields = ['appointment_id','patient_id', 'facility_id', 'doctor_id', 'speciality_id', 'schedule_id', 'patient_rec_id', 'start_time', 'end_time', 'date']

    def to_internal_value(self, data):
        time_range = data.get('start_time', '')
        start, end = [datetime.datetime.strptime(t.strip(), '%I:%M %p').time() for t in time_range.split('-')]
        data['start_time'] = start
        data['end_time'] = end
        return super().to_internal_value(data)

    def validate_date(self, value):
        # You can include date validation here if needed
        if value < datetime.datetime.now().date():
            raise serializers.ValidationError("Date cannot be in the past.")
        return value
    
class AvailableSlotsSerializer(serializers.Serializer):
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
            work_start = schedule.visiting_hours_start
            work_end = schedule.visiting_hours_end

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
                        slots = self.calculate_time_slots(date, facility.facility_id, work_start, work_end, appointments, appointment_length)
                        if any_appointments_booked:
                            if appointments.exists():
                                added_doctor_ids = set()
                                for appointment in appointments:
                                    doctor_id = appointment.doctor_id_id
                                    if doctor_id not in added_doctor_ids and doctor_id == schedule.doctor_id.doctor_id:
                                        added_doctor_ids.add(doctor_id)
                                        available_doctors.append({
                    'doctor_id': schedule.doctor_id.doctor_id,
                    'doctor_name': f"{schedule.doctor_id.first_name} {schedule.doctor_id.last_name}",
                    'facility_id': facility.facility_id,
                    'facility_name': facility.name,
                    'speciality_ids': specialty_ids,
                    'available_slots': slots
                })
                                    elif doctor_id not in added_doctor_ids :

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
        return available_doctors
                    
                    
    def calculate_time_slots(self, date, facility_id, work_start, work_end, appointments, duration):
        start_datetime = datetime.datetime.combine(date, work_start)
        end_datetime = datetime.datetime.combine(date, work_end)

        total_rooms = Facility.objects.get(facility_id=facility_id).rooms_no
        unavailable_rooms = ManageRooms.objects.filter(facility_id=facility_id, date=date).aggregate(sum_unavailable_rooms=Sum('unvailable_room'))['sum_unavailable_rooms'] or 0
        available_rooms = total_rooms - unavailable_rooms

        current_time = start_datetime
        available_slots = []

        while current_time + datetime.timedelta(minutes=duration) <= end_datetime:
            end_time = current_time + datetime.timedelta(minutes=duration)
            next_start_time = current_time + datetime.timedelta(minutes=duration + 10)  # Include buffer

            # Check for overlapping appointments
            overlapping_appointments = Appointments.objects.filter(
                facility_id=facility_id,
                date=date,
                start_time__lt=end_time.time(),
                end_time__gt=current_time.time()
            ).count()

            # Check for room availability and no overlapping appointments
            if overlapping_appointments < available_rooms and not any(
                app.start_time <= current_time.time() < app.end_time or 
                app.start_time < end_time.time() <= app.end_time for app in appointments):
                available_slots.append({'start': current_time.time().strftime('%H:%M'), 'end': end_time.time().strftime('%H:%M')})

            current_time += datetime.timedelta(minutes=duration + 10)  # Proceed to the next potential time slot

        return available_slots

class ManageRoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageRooms
        fields = ['room_id', 'facility_id', 'unavailable_room', 'date']
    
class PatientMedicalRecSerialier(serializers.ModelSerializer):
    class Meta:
        model = Patient_record
        fields = '__all__'

# to handle the doctor schedule filter
class DocScheduleSerializerFilter(serializers.ModelSerializer):
    doctor = AllDoctorSerializer(source='doctor_id', read_only=True)
    facility = AllFacilitySerializer(source='facility_id', many=True, read_only=True)
    speciality = SpecialitySerializer(source='speciality_id', many=True, read_only=True)

    class Meta:
        model = Doc_schedule
        fields = ('schedule_id', 'doctor', 'facility', 'speciality', 'days_visiting', 'visiting_hours_start', 'visiting_hours_end')

class AppointmentSerializer2(serializers.ModelSerializer):
    name = serializers.CharField(source='facility_id.name')
    addressLine1 = serializers.CharField(source='facility_id.addressLine1')
    city = serializers.CharField(source='facility_id.city')
    state = serializers.CharField(source='facility_id.state')
    zipCode = serializers.IntegerField(source='facility_id.zipCode')
    first_name = serializers.CharField(source='patient_id.first_name')
    last_name = serializers.CharField(source='patient_id.last_name')
    patient_id = serializers.CharField(source='patient_id.patient_id')
    
    class Meta:
        model = Appointments
        fields = ('start_time', 'end_time', 'name', 'addressLine1',
                  'city', 'state', 'zipCode', 'first_name', 'last_name', 'patient_id')
    

class SlotRecommendationSerializer(serializers.Serializer):
    date = serializers.DateField(format="%d/%m/%Y", input_formats=["%d/%m/%Y"])
    time_slot = serializers.CharField()  # Expected format 'HH:MM-HH:MM'
    speciality_id = serializers.IntegerField()
    facility_id = serializers.IntegerField()
    doctor_id = serializers.IntegerField()

    def validate_time_slot(self, value):
        try:
            start_time, end_time = value.split('-')
            datetime.datetime.strptime(start_time, '%H:%M')
            datetime.datetime.strptime(end_time, '%H:%M')
            return value
        except ValueError:
            raise serializers.ValidationError("Incorrect time slot format, expected 'HH:MM-HH:MM'.")

    def validate(self, attrs):
        # Validate if the slot is available at the selected facility
        start_time, end_time = attrs['time_slot'].split('-')
        appointment_exists = Appointments.objects.filter(
            doctor_id=attrs['doctor_id'],
            facility_id=attrs['facility_id'],
            date=attrs['date'],
            start_time__lte=start_time,
            end_time__gte=end_time
        ).exists()
        
        if appointment_exists:
            raise serializers.ValidationError("The slot is not available at the selected facility.")

        return attrs

    def save(self, **kwargs):
        validated_data = self.validated_data
        date = validated_data['date']
        start_time, end_time = validated_data['time_slot'].split('-')
        speciality_id = validated_data['speciality_id']
        selected_facility_id = validated_data['facility_id']
        selected_doctor_id = validated_data['doctor_id']

        # Filter facilities where any appointments are already booked (not necessarily by the selected doctor)
        facilities_with_appointments = Facility.objects.filter(
            appointments__date=date,
            appointments__facility_id__is_active=True
        ).distinct()

        recommendations = []
        for facility in facilities_with_appointments:
            # Exclude the initially selected facility and check for other doctors with the right specialty
            available_doctors = Doctor.objects.exclude(doctor_id=selected_doctor_id).filter(
                doc_schedule__facility_id=facility.facility_id,
                doc_schedule__speciality_id=speciality_id,
                doc_schedule__days_visiting__icontains=date.strftime("%A").lower(),
            ).distinct()

            for doctor in available_doctors:
                # Check if the selected time slot is available at these facilities
                if not Appointments.objects.filter(
                    doctor_id=doctor.doctor_id,
                    facility_id=facility.facility_id,
                    date=date,
                    start_time__lte=start_time,
                    end_time__gte=end_time
                ).exists():
                    recommendations.append({
                        'doctor_id': doctor.doctor_id,
                        'doctor_name': f"{doctor.first_name} {doctor.last_name}",
                        'facility_id': facility.facility_id,
                        'facility_name': facility.name,
                        'recommended_slot': validated_data['time_slot']
                    })

        return recommendations

    # def save(self, **kwargs):
    #     validated_data = self.validated_data
    #     date = validated_data['date']
    #     start_time, end_time = validated_data['time_slot'].split('-')
    #     speciality_id = validated_data['speciality_id']
    #     selected_facility_id = validated_data['facility_id']
    #     doctor_id = validated_data['doctor_id']

    #     # Correct query handling for many-to-many relationships
    #     other_facilities = Facility.objects.exclude(facility_id=selected_facility_id).filter(
    #     doc_schedule__doctor_id=doctor_id,  # Using the correct related field name
    #     doc_schedule__speciality_id=speciality_id,  # Assuming ManyToMany relationship access
    #     doc_schedule__days_visiting__icontains=date.strftime("%A").lower(),
    #     is_active=True
    #     )

    #     print(other_facilities.query)
    #     recommendations = []
    #     for facility in other_facilities:
    #         # Check if the slot is available at these facilities
    #         if not Appointments.objects.filter(
    #             doctor_id=doctor_id,
    #             facility_id=facility.facility_id,  # Use 'id', not 'facility_id'
    #             date=date,
    #             start_time__lte=start_time,
    #             end_time__gte=end_time
    #         ).exists():
    #             recommendations.append({
    #                 'facility_id': facility.facility_id,
    #                 'facility_name': facility.name,
    #                 'recommended_slot': validated_data['time_slot']
    #             })

    #     return recommendations
