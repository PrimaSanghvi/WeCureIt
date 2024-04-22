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

class PatientPaymentView(APIView):
    def get(self, request, pk, format=None):
        try:
            patient = PatientCreditCard.objects.get(patient_id = pk)
            serializer = PatientCreditCardSerializer(patient)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            

class PatientDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            patient = Patient.objects.get(pk=pk)
            serializer = PatientSerializer(patient)
            return Response(serializer.data)
            
        except Patient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class AllEmailsView(APIView):
    def post(self, request, format=None):
        serializer = EmailSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.data)
        else:
            return Response(serializer.data)
        
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
        
class AllDoctorDetail(APIView):
    def get(self, request,*args, **kwarg):
        try:
            # Only retrieving doctors whose 'is_active' is True
            doctor = Doctor.objects.filter(is_active = True)
            serializer = AllDoctorSerializer(doctor, many=True)
            return Response(serializer.data)
        
        except Doctor.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class AllFacilityDetail(APIView):
    def get(self, request,*args, **kwarg):
        try:
            # Only retrieving facility whose 'is_active' is True
            facility = Facility.objects.filter(is_active = True)
            serializer = AllFacilitySerializer(facility, many=True)
            return Response(serializer.data)
        
        except Facility.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class DocScheduleCreateAPI(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DocScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateScheduleDaysAPI(APIView):
    def post(self, request, *args, **kwargs):
        doctor_id = request.data.get('doctor_id')
        day_to_remove = request.data.get('day_to_remove')

        if not doctor_id or not day_to_remove:
            return Response({'error': 'Both doctor_id and day_to_remove are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Fetch the schedule for the given doctor where the days include the day to remove
            schedules = Doc_schedule.objects.filter(
                doctor_id=doctor_id, 
                days_visiting__icontains=day_to_remove
            )
            
            if not schedules:
                return Response({'error': 'No schedule found for the given criteria'}, status=status.HTTP_404_NOT_FOUND)

            updated_schedules = []
            for schedule in schedules:
                # Split the days, remove the specified day, and join them back into a string
                days = schedule.days_visiting.split(', ')
                if day_to_remove in days:
                    days.remove(day_to_remove)
                schedule.days_visiting = ', '.join(days)
                schedule.save()
                updated_schedules.append(schedule.schedule_id)

            return Response({'message': 'Updated schedules successfully', 'schedules': updated_schedules}, status=status.HTTP_200_OK)

        except Doc_schedule.DoesNotExist:
            return Response({'error': 'Schedule not found'}, status=status.HTTP_404_NOT_FOUND)
        
class UnlinkFacilityAPIView(APIView):
    def delete(self, request, *args, **kwargs):
        serializer = FacilityUnlinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Facility unlinked from doctor\'s schedule successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UnlinkSpecialtyAPIView(APIView):
    def delete(self, request, *args, **kwargs):
        serializer = SpecialtyUnlinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Specialty unlinked from doctor\'s schedule successfully'}, status=status.HTTP_204_NO_CONTENT)
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
        serializer = AvailableDoctorsSerializer(data=request.data)
        if serializer.is_valid():
            available_doctors = serializer.get_available_doctors()
            return Response(available_doctors)
        return Response(serializer.errors, status=400)
    
class ManageRoomsView(APIView):
    def get(self, request, format=None):
        rooms = ManageRooms.objects.all()
        serializer = ManageRoomsSerializer(rooms, many=True)
        return Response(serializer.data)
    
class UpdateRoomsView(viewsets.ModelViewSet):
    model = ManageRooms
    serializer_class = ManageRoomsSerializer
    queryset = ManageRooms.objects.all()

class PatientRecView(APIView):
    def get(self, request, pk, format=None):
        try:
            rec = Patient_record.objects.get(patient_rec_id=pk)
            
            # Serialize the Patient_record data
            serializer = PatientMedicalRecSerialier(rec)
            data = serializer.data
            
            # Get the associated Patient object
            patient_id = rec.patient_id_id
            patient_info = Patient.objects.get(patient_id=patient_id)
            
            # Serialize the Patient data
            serializer2 = PatientSerializer(patient_info)
            doctor_info = Doctor.objects.get(doctor_id=rec.doctor_id_id)
            serializer3 = DoctorInfoSerializer(doctor_info)
            
            # Merge patient data into the response data
            data['patient_firstname'] = serializer2.data['first_name']
            data['patient_lastname'] = serializer2.data['last_name']
            data['patient_address'] = serializer2.data['addressLine1']
            data['patient_city'] = serializer2.data['city']
            data['patient_state'] = serializer2.data['state']
            data['patient_zip'] = serializer2.data['zipCode']
            data['doctor_firstname'] = serializer3.data['first_name']
            data['doctor_lastname'] = serializer3.data['last_name']
            
            return Response(data)
            
        except Patient_record.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class  PatientRecCreateView(APIView):
    def post(self, request, format=None):
        serializer = PatientMedicalRecSerialier(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PatientAllRecView(APIView):
    def get(self, request, pk, format=None):
        records = Patient_record.objects.filter(patient_id=pk)
        serializer = PatientMedicalRecSerialier(records, many=True)
        data = serializer.data
        for record in data:

            doctor_id = record['doctor_id']
            doctor_info = Doctor.objects.get(doctor_id=doctor_id)
            serializer3 = DoctorInfoSerializer(doctor_info)
            appoint = Appointments.objects.get(patient_id=pk,doctor_id=doctor_id,date=record['diagnosis_date'])
            serializer2 = AppointmentSerializer(appoint)
            record['doctor_firstname'] = serializer3.data['first_name']
            record['doctor_lastname'] = serializer3.data['last_name']
            s4 = SpecialitySerializer(Speciality.objects.get(speciality_id=serializer2.data['speciality_id']))
            s5 = FacilitySerializer(Facility.objects.get(facility_id=serializer2.data['facility_id']))
            record['specialty'] = s4.data['name']
            record['locname'] = s5.data['name']
            record['locadd'] = s5.data['addressLine1']+" "+s5.data['addressLine2']
            record['locCSZ'] = s5.data['city']+", "+s5.data['state'] +", "+str(s5.data['zipCode'])
            
        return Response(data, status=status.HTTP_200_OK)


class NewRecView(APIView):
    def get(self, request):
        # Access query parameters
        diagnosis_date = request.query_params.get('diagnosis_date')
        doctor_id = request.query_params.get('doctor_id')
        patient_id = request.query_params.get('patient_id')
        
        # Filter records based on the query parameters
        records = Patient_record.objects.filter(
            diagnosis_date=diagnosis_date,
            doctor_id=doctor_id,
            patient_id=patient_id
        )
        
        # Check if records are found
        if not records.exists():
            return Response({'detail': 'No data found'}, status=status.HTTP_200_OK)
        
        # Serialize the records
        serializer = Patient_record(records, many=True)
        
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)

class DoctorDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            patient = Doctor.objects.get(pk=pk)
            serializer = DoctorInfoSerializer(patient)
            return Response(serializer.data)
            
        except Patient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class FacilityDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            facility = Facility.objects.get(pk=pk)
            serializer = FacilitySerializer(facility)
        
            return Response(serializer.data)
        except Facility.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SpecialtyDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            sp = Speciality.objects.get(pk=pk)
            serializer = SpecialitySerializer(sp)
        
            return Response(serializer.data)
        except Facility.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

       
