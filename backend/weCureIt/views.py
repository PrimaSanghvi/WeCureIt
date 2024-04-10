from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
import datetime

# Create your views here.
################## PATIENT ##################
class PatientInfoView(viewsets.ModelViewSet):
    model = Patient
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()

class PatientLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PatientLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            # print(serializer.validated_data)
            # Authentication successful
            patient_id = serializer.validated_data['patient_id']
            return Response({"patient_id": patient_id}, status=status.HTTP_200_OK)
        else:
            # print(serializer.errors)
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
        
class PatientPreferenceView(viewsets.ModelViewSet):
    model = PatientPreference
    serializer_class = PatientPreferenceSerializer
    queryset = PatientPreference.objects.all()

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
    

# class DoctorDetailView(APIView):
#     """
#     Retrieve a doctor's details by doctor_id.
#     """
#     def get(self, request, doctor_id):
#         try:
#             doctor = Doctor.objects.get(pk=doctor_id)
#             serializer = DoctorSerializer(doctor)
#             return Response(serializer.data)
#         except Doctor.DoesNotExist:
#             return Response({'message': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

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

class PatientPreferenceDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            patient = PatientPreference.objects.get(pk=pk)
            serializer = PatientPreferenceSerializer(patient)
            return Response(serializer.data)
        
        except PatientPreference.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
################## DOCTOR ##################
class AllDoctorDetail(APIView):
    def get(self, request,*args, **kwarg):
        try:
            # Only retrieving doctors whose 'is_active' is True
            doctor = Doctor.objects.filter(is_active = True)
            serializer = AllDoctorSerializer(doctor, many=True)
            return Response(serializer.data)
        
        except Doctor.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
################## FACILITY ##################
class AllFacilityDetail(APIView):
    def get(self, request,*args, **kwarg):
        try:
            facility = Facility.objects.all()
            serializer = AllFacilitySerializer(facility, many=True)
            return Response(serializer.data)
        
        except Facility.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
