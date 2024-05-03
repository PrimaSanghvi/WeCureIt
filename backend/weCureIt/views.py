from django.shortcuts import render
from rest_framework import viewsets, generics
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
import datetime
from itertools import product
from django.utils.dateparse import parse_date
from datetime import datetime, timedelta
# Create your views here.


class PatientInfoView(viewsets.ModelViewSet):
    model = Patient
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()

    

class PatientLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PatientLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            print(serializer.validated_data)
            # Authentication successful
            patient_id = serializer.validated_data['patient_id']
            return Response({"patient_id": patient_id}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class PatientCreditCardView(viewsets.ModelViewSet):
    model = PatientCreditCard
    serializer_class = PatientCreditCardSerializer
    queryset = PatientCreditCard.objects.all()


class PatientDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            patient = Patient.objects.get(pk=pk)
            serializer = PatientSerializer(patient)
            return Response(serializer.data)
            
        except Patient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
       

class DoctorLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DoctorLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            print(serializer.validated_data)
            # Authentication successful
            doctor_id = serializer.validated_data['doctor_id']
            return Response({"doctor_id": doctor_id}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
class TodaysAppointmentsView(APIView):
    """
    View to get today's appointments for a specific doctor.
    """
    def get(self, request, doctor_id):
        # today = timezone.now().date()
        today = timezone.now().astimezone(timezone.get_default_timezone()).date()
        appointments = Appointments.objects.filter(
            doctor_id=doctor_id, 
            date=today  # Use the 'date' field for filtering
        ).select_related('patient_id', 'facility_id')
        serializer = AppointmentSerializer(appointments, many=True)
        print(today)
        return Response(serializer.data)
    
class UpcomingAppointmentsView(APIView):
    """
    View to get upcoming appointments for a specific doctor.
    """
    def get(self, request, doctor_id):
        # today = timezone.now().date()
        today = timezone.now().astimezone(timezone.get_default_timezone()).date()
        appointments = Appointments.objects.filter(
            doctor_id=doctor_id, 
            date__gt=today  # Use the 'date' field to filter for upcoming appointments
        ).select_related('patient_id', 'facility_id').order_by('date', 'start_time')  # Assuming you still want to sort by start time within each day
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

class DoctorScheduleView(APIView):
    def get(self, request, doctor_id, selected_date):
        try:
            selected_date_obj = datetime.datetime.strptime(selected_date, '%Y-%m-%d').date()
            day_of_week = selected_date_obj.strftime('%A')
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        # Get doctor's schedule for the selected day
        schedules = Doc_schedule.objects.filter(doctor_id=doctor_id, days_visiting__iexact=day_of_week)
        if not schedules.exists():
            return Response({'message': 'No schedule found for this day.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if there's any appointment on the selected date to decide whether to include facility info
        appointments = Appointments.objects.filter(doctor_id=doctor_id, date=selected_date_obj)
        facility_ids_with_appointments = appointments.values_list('facility_id', flat=True).distinct()

        # Modify the schedule queryset to annotate a flag indicating if there's an appointment at the facility
        schedules = schedules.annotate(
            has_appointment_at_facility=models.Case(
                models.When(facility_id__in=facility_ids_with_appointments, then=True),
                default=models.Value(False),
                output_field=models.BooleanField(),
            )
        )

        # Serialize and return the schedule, ensuring facility info is included based on the flag
        serializer = DocScheduleSerializer(schedules, many=True, context={'selected_date': selected_date_obj})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SpecialityView(viewsets.ModelViewSet):
    model = Speciality
    serializers_class = SpecialitySerializer
    queryset = Speciality.objects.all()

class SpecialtyListView(APIView):
    def get(self, request, format=None):
        specialties = Speciality.objects.all()
        serializer = SpecialitySerializer(specialties, many=True)
        return Response(serializer.data)

class DoctorView(viewsets.ModelViewSet):
    model = Doctor
    serializers_class = DoctorInfoSerializer
    queryset = Doctor.objects.all()

class DoctorListView(APIView):
    def get(self, request, format=None):
        doctor = Doctor.objects.all()
        serializer = DoctorInfoSerializer(doctor, many=True)
        return Response(serializer.data)

class DoctorInfoView(viewsets.ModelViewSet):
    model = Doctor
    serializer_class = DoctorInfoSerializer
    queryset = Doctor.objects.all()

class DoctorInactiveView(APIView):
    def get(self, request, pk):
        try: 
            doctor = Doctor.objects.get(pk=pk)
            serializer = DoctorInfoSerializer(doctor)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try: 
            # Retrieve the doctor object
            doctor = Doctor.objects.get(pk=pk)
            
            # Update the is_active field based on the data from the request
            doctor.is_active = request.data.get('is_active', False)  # Assuming is_active is a boolean field

            # Instantiate the serializer with the updated doctor object and data
            serializer = DoctorInfoSerializer(doctor, data=request.data)

            # Validate the serializer data
            if serializer.is_valid():
                # Save the updated doctor object
                serializer.save()
                return Response(serializer.data)
            else:
                # Return errors if the data is not valid
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Doctor.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
     


class AdminLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AdminLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            print(serializer.validated_data)
            # Authentication successful
            admin_id = serializer.validated_data['admin_id']
            return Response({"admin_id": admin_id}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class FacilityListView(APIView):
    def get(self, request, format=None):
        facilities = Facility.objects.all()  
        serializer = FacilitySerializer(facilities, many=True)  
        return Response(serializer.data) 

class FacilityCreateView(APIView):
    def post(self, request, format=None):
        serializer = FacilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FacilityUpdateView(APIView):
    def put(self, request, pk, format=None):
        try:
            facility = Facility.objects.get(pk=pk)
        except Facility.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = FacilitySerializer(facility, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class FacilityDeactivateView(APIView):
    def patch(self, request, pk, format=None):
        try:
            facility = Facility.objects.get(pk=pk)
        except Facility.DoesNotExist:
            return Response({'error': 'Facility not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Set the is_active field to False
        facility.is_active = False
        facility.save()
        
        # Serialize the facility to send back the updated data
        serializer = FacilitySerializer(facility)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AvailableDoctorsView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AvailableSlotsSerializer(data=request.data)
        if serializer.is_valid():
            available_doctors = serializer.get_available_doctors()
            return Response(available_doctors)
        return Response(serializer.errors, status=400)
    
class SlotRecommendationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SlotRecommendationSerializer(data=request.data)
        if serializer.is_valid():
            recommendations = serializer.save()
            return Response({'recommendations': recommendations}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class DocScheduleListView(generics.ListAPIView):
#     def get_queryset(self):
#         serializer_class = DocScheduleSerializerFilter
#         date_query = self.request.query_params.get('date')
#         doctor_name = self.request.query_params.get('doctor_name', None)
#         facility_name = self.request.query_params.get('facility_name', None)
#         speciality_name = self.request.query_params.get('speciality_name', None)
        
#         # Build initial queryset
#         queryset = Doc_schedule.objects.filter(facility_id__is_active=True)
        
#         # Filter by appointments existing for the specific date
#         if date_query:
#             date_query = datetime.strptime(date_query, '%Y-%m-%d').date()
#             appointments = Appointments.objects.filter(date=date_query)
#             if appointments.exists():
#                 if doctor_name:
#                     first_name, last_name = doctor_name.split()
#                     appointments = appointments.filter(doctor_id__first_name__icontains=first_name, doctor_id__last_name__icontains=last_name)
#                 if facility_name:
#                     appointments = appointments.filter(facility_id__name__icontains=facility_name)
#                 if speciality_name:
#                     appointments = appointments.filter(speciality_id__name__icontains=speciality_name)

#                 # Extracting distinct doctor_ids, facility_ids, and speciality_ids
#                 doctor_ids = appointments.values_list('doctor_id', flat=True).distinct()
#                 facility_ids = appointments.values_list('facility_id', flat=True).distinct()
#                 speciality_ids = appointments.values_list('speciality_id', flat=True).distinct()

#                 queryset = queryset.filter(
#                     Q(doctor_id__in=doctor_ids) & 
#                     Q(facility_id__in=facility_ids) &
#                     Q(speciality_id__in=speciality_ids)
#                 )
#             return queryset
#         else :
#             if doctor_name:
#                 first_name, last_name = doctor_name.split(' ')
#                 queryset = queryset.filter(
#                     Q(doctor_id__first_name__icontains=first_name) &
#                     Q(doctor_id__last_name__icontains=last_name)
#                 )
#             if date_query:
#                 day_of_week = datetime.strptime(date_query, '%Y-%m-%d').strftime('%A')
#                 queryset = queryset.filter(days_visiting__icontains=day_of_week)

#         return queryset
    
#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = DocScheduleSerializerFilter(queryset, many=True)
        
#         speciality_name = request.query_params.get('speciality_name', None)
#         facility_name = request.query_params.get('facility_name', None)
#         date_provided = request.query_params.get('date', None)

#         print(serializer.data)
#         unique_entries = set()
#         flattened_data = []
#         # Gather appointment data for the provided date
#         if date_provided:
#             appointments = Appointments.objects.filter(date=date_provided)
#             appointment_facilities = appointments.values_list('facility_id', flat=True).distinct()
#             appointment_specialities = appointments.values_list('speciality_id', flat=True).distinct()

       
#             if appointments.exists():
#                 for schedule in serializer.data:
#                     filtered_facilities = [f for f in schedule['facility'] if f['facility_id'] in appointment_facilities]
#                     if not speciality_name:
#                     # Include all associated specialties if no specific specialty is requested
#                         filtered_specialities = schedule['speciality']
#                     else:
#                     # Filter specialties based on the appointment data and the provided specialty name
#                         filtered_specialities = [s for s in schedule['speciality'] if s['speciality_id'] in appointment_specialities and s['name'] == speciality_name]

                    
#                     # Now we create entries only with the filtered facilities and specialities
#                     for facility in filtered_facilities:
#                         for specialty in filtered_specialities:
#                             entry = {
#                             'date': date_provided,
#                             'doctor': schedule['doctor']['first_name'] + ' ' + schedule['doctor']['last_name'],
#                             'specialty': specialty['name'],
#                             'facility': facility['name']
#                         }     
#                             entry_tuple = (entry['date'], entry['doctor'], entry['specialty'], entry['facility'])               
#                             if entry_tuple not in unique_entries:
#                                 unique_entries.add(entry_tuple)
#                                 flattened_data.append(entry)
#                     print(flattened_data)
#                 return Response(flattened_data)
        
#             else:
#                 for schedule in serializer.data:
#                     doctor_name = f"{schedule['doctor']['first_name']} {schedule['doctor']['last_name']}"
#                     date_provided = request.query_params.get('date', None)
#                     date_list = [datetime.strptime(date_provided, '%Y-%m-%d')] if date_provided else [datetime.now() + timedelta(days=i) for i in range(14)]

#                     for date in date_list:
#                         day_name = date.strftime('%A')
#                         if day_name in schedule['days_visiting']:
#                             specialties = [spec['name'] for spec in schedule['speciality']]
#                             facilities = [fac['name'] for fac in schedule['facility'] if fac['is_active']]
#                             for specialty, facility in product(specialties, facilities):
#                                 entry = (date.strftime('%Y-%m-%d'), doctor_name, specialty, facility)
#                                 if (speciality_name is None or specialty == speciality_name) and (facility_name is None or facility == facility_name) and entry not in unique_entries:
#                                     unique_entries.add(entry)
#                                     flattened_data.append({
#                                         'date': date.strftime('%Y-%m-%d'),
#                                         'doctor': doctor_name,
#                                         'specialty': specialty,
#                                         'facility': facility
#                                     })

#                 return Response(flattened_data)
            
        
#         else:
#             for schedule in serializer.data:
#                     doctor_name = f"{schedule['doctor']['first_name']} {schedule['doctor']['last_name']}"
#                     date_provided = request.query_params.get('date', None)
#                     date_list = [datetime.strptime(date_provided, '%Y-%m-%d')] if date_provided else [datetime.now() + timedelta(days=i) for i in range(14)]

#                     for date in date_list:
#                         day_name = date.strftime('%A')
#                         if day_name in schedule['days_visiting']:
#                             specialties = [spec['name'] for spec in schedule['speciality']]
#                             facilities = [fac['name'] for fac in schedule['facility'] if fac['is_active']]
#                             for specialty, facility in product(specialties, facilities):
#                                 entry = (date.strftime('%Y-%m-%d'), doctor_name, specialty, facility)
#                                 if (speciality_name is None or specialty == speciality_name) and (facility_name is None or facility == facility_name) and entry not in unique_entries:
#                                     unique_entries.add(entry)
#                                     flattened_data.append({
#                                         'date': date.strftime('%Y-%m-%d'),
#                                         'doctor': doctor_name,
#                                         'specialty': specialty,
#                                         'facility': facility
#                                     })

#             return Response(flattened_data)


# class DocScheduleListView(generics.ListAPIView):
#     serializer_class = DocScheduleSerializerFilter
    
#     def get_queryset(self):
#         # Basic filtering on active facilities and potential name based filtering
#         queryset = Doc_schedule.objects.filter(facility_id__is_active=True)
#         doctor_name = self.request.query_params.get('doctor_name', None)
#         if doctor_name:
#             first_name, last_name = doctor_name.split()
#             queryset = queryset.filter(
#                 Q(doctor_id__first_name__icontains=first_name) &
#                 Q(doctor_id__last_name__icontains=last_name)
#             )
#         return queryset
    
#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
        
#         speciality_name = request.query_params.get('speciality_name', None)
#         facility_name = request.query_params.get('facility_name', None)

#         date_provided = request.query_params.get('date')
#         appointments = Appointments.objects.filter(date=date_provided) if date_provided else None

#         # Build lists of doctor and facility restrictions based on appointments
#         doctor_restrictions = {}
#         if appointments:
#             for appointment in appointments:
#                 doctor_id = appointment.doctor_id_id
#                 facility_id = appointment.facility_id_id
#                 if doctor_id not in doctor_restrictions:
#                     doctor_restrictions[doctor_id] = []
#                 doctor_restrictions[doctor_id].append(facility_id)

#         unique_entries = set()
#         flattened_data = []

#         for schedule in serializer.data:
#             doctor_id = schedule['doctor']['doctor_id']
#             restricted_facilities = doctor_restrictions.get(doctor_id)

#             # Determine which facilities to include
#             if restricted_facilities:
#                 # Doctor has appointments: restrict facilities
#                 filtered_facilities = [f for f in schedule['facility'] if f['facility_id'] in restricted_facilities]
#             else:
#                 # No appointments for this doctor: include all active facilities
#                 filtered_facilities = schedule['facility']
            
#             # Include all specialities available to the doctor
#             filtered_specialities = schedule['speciality']

#             # Generate entries for each combination of doctor, facility, and speciality
#             for facility in filtered_facilities:
#                 for specialty in filtered_specialities:
#                     entry = {
#                         'date': date_provided,
#                         'doctor': f"{schedule['doctor']['first_name']} {schedule['doctor']['last_name']}",
#                         'specialty': specialty['name'],
#                         'facility': facility['name']
#                     }
#                     entry_tuple = (entry['date'], entry['doctor'], entry['specialty'], entry['facility'])
#                     if entry_tuple not in unique_entries:
#                         unique_entries.add(entry_tuple)
#                         flattened_data.append(entry)
#             print(flattened_data)
#         return Response(flattened_data)

class DocScheduleListView(generics.ListAPIView):
    serializer_class = DocScheduleSerializerFilter
    
    def get_queryset(self):
        queryset = Doc_schedule.objects.filter(facility_id__is_active=True)
        date_query = self.request.query_params.get('date', None)

        doctor_name = self.request.query_params.get('doctor_name', None)
        if doctor_name:
            first_name, last_name = doctor_name.split()
            queryset = queryset.filter(
                Q(doctor_id__first_name__icontains=first_name) &
                Q(doctor_id__last_name__icontains=last_name)
            )
        if date_query:
            day_of_week = datetime.strptime(date_query, '%Y-%m-%d').strftime('%A')
            queryset = queryset.filter(days_visiting__icontains=day_of_week)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        date_provided = request.query_params.get('date')
        speciality_name = request.query_params.get('speciality_name', None)
        facility_name = request.query_params.get('facility_name', None)
        appointments = Appointments.objects.filter(date=date_provided) if date_provided else None

        doctor_restrictions = {}
        if appointments:
            for appointment in appointments:
                doctor_id = appointment.doctor_id_id
                facility_id = appointment.facility_id_id
                if doctor_id not in doctor_restrictions:
                    doctor_restrictions[doctor_id] = []
                doctor_restrictions[doctor_id].append(facility_id)

        unique_entries = set()
        flattened_data = []

        for schedule in serializer.data:
            doctor_id = schedule['doctor']['doctor_id']
            restricted_facilities = doctor_restrictions.get(doctor_id)

            filtered_facilities = [f for f in schedule['facility'] if 
                                   (not restricted_facilities or f['facility_id'] in restricted_facilities) and
                                   (not facility_name or f['name'] == facility_name)]

            filtered_specialities = [s for s in schedule['speciality'] if
                                     (not speciality_name or s['name'] == speciality_name)]

            if not filtered_facilities or not filtered_specialities:
                continue  # Skip to next schedule if no valid facilities or specialities are available

            for facility in filtered_facilities:
                for specialty in filtered_specialities:
                    entry = {
                        'date': date_provided,
                        'doctor': f"{schedule['doctor']['first_name']} {schedule['doctor']['last_name']}",
                        'specialty': specialty['name'],
                        'facility': facility['name'],
                        'speciality_id' : specialty['speciality_id'],
                        'doctor_id' : schedule['doctor']['doctor_id']
                    }
                    entry_tuple = (entry['date'], entry['doctor'], entry['specialty'], entry['facility'], entry['speciality_id'],entry['doctor_id'])
                    if entry_tuple not in unique_entries:
                        unique_entries.add(entry_tuple)
                        flattened_data.append(entry)

        return Response(flattened_data)
    

class CreateAppointmentView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)