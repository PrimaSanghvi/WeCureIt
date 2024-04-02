from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import check_password



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