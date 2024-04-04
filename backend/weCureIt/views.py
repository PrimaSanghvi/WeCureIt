from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

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
        
class PatientPreferenceView(viewsets.ModelViewSet):
    model = PatientPreference
    serializer_class = PatientPreferenceSerializer
    queryset = PatientPreference.objects.all()
       
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
            doctor = Doctor.objects.all()
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