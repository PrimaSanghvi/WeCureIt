# Populate the database for each table
# Requirements:
# 1. Need psycopg2 installed
# 2. Need django-extensions installed

# Steps:
# 1. python3 manage.py runscript deleteDB
# 2. python3 manage.py sqlsequencereset weCureIt | python3 manage.py dbshell
# 3. python3 manage.py runscript populateDB
from weCureIt.models import Doctor, ManageRooms, Facility, AdminTable, Speciality, Patient, PatientCreditCard, PatientPreference, Doc_schedule, Patient_record, Appointments
import datetime
from cryptography.fernet import Fernet 
import configparser
import base64
from base64 import urlsafe_b64encode, urlsafe_b64decode

def run():
    ############## SPECIALTY: ##############
    # Specialty Types:
    specialities = ["Cardiology", "Dentist", "Pediatrics", "Psychiatry", "Obstetrics & Gynaecology"]

    spCardio = Speciality(name = specialities[0])
    spCardio.save()

    spDentist = Speciality(name = specialities[1])
    spDentist.save()

    spPediatrics = Speciality(name = specialities[2])
    spPediatrics.save()

    spPsychiatry = Speciality(name = specialities[3])
    spPsychiatry.save()

    spOBGY = Speciality(name = specialities[4])
    spOBGY.save()
    
    ############## FACILITY: ##############
    # Facility:
    facA = Facility(name = "The George Washington University Hospital",
                    addressLine1 = "900 23rd St. NW",
                    city = "Washington",
                    state = "D.C.",
                    zipCode = 20037,
                    rooms_no = 5,
                    phone_number = "2027154000",
                    is_active = True,
                    start_time = "00:00",
                    end_time = "23:00")
    facA.save()
    facA.speciality_id.add(spCardio, spDentist, spOBGY, spPediatrics, spPsychiatry)
    facARoom = ManageRooms(unavailable_room = [1, 3, 5],
                               facility_id = facA,
                               date = "2024-05-11")
    facARoom.save()

    facB = Facility(name = "Holy Cross Hospital", 
                    addressLine1 = "1500 Forest Glen Rd",
                    city = "Silver Spring",
                    state = "MD",
                    zipCode = 20910,
                    rooms_no = 4,
                    phone_number = "3017547000",
                    is_active = True,
                    start_time = "00:00",
                    end_time = "23:00")
    facB.save()
    facB.speciality_id.add(spCardio, spDentist, spOBGY, spPediatrics, spPsychiatry)
    facBRoom = ManageRooms(unavailable_room = [2, 3],
                               facility_id = facB,
                               date = "2024-05-07")
    facBRoom.save()


    facC = Facility(name = "MedStar Washington Hospital Center", 
                    addressLine1 = "110 Irving St NW",
                    city = "Washington",
                    state = "D.C.",
                    zipCode = 20010,
                    rooms_no = 4,
                    phone_number = "2028777000",
                    is_active = True,
                    start_time = "00:00",
                    end_time = "23:00")
    facC.save()
    facC.speciality_id.add(spCardio, spDentist, spOBGY, spPediatrics, spPsychiatry)

    ############## DOCTOR: ##############
    # Doctor Users:
    docA = Doctor(first_name = "Fern",
                  last_name = "Moyer",
                  email = "FMOYER@GMAIL.COM",
                  password = "111",
                  phone_number = 1111111111,
                  is_active = True)
    docA.save()
    docA.speciality_id.add(spCardio, spOBGY, spPediatrics)

    docB = Doctor(first_name = "Tia",
                  last_name = "McKnight",
                  email = "TMCKNIGHT@GMAIL.COM",
                  password = "111",
                  phone_number = 1111111111,
                  is_active = True)
    docB.save()
    docB.speciality_id.add(spCardio, spDentist, spPediatrics, spPsychiatry, spOBGY)

    docC = Doctor(first_name = "Gordon",
                  last_name = "Ortiz",
                  email = "GORTIZ@GMAIL.COM",
                  password = "111",
                  phone_number = 1111111111,
                  is_active = True)
    docC.save()
    docC.speciality_id.add(spOBGY, spPediatrics)

    # Doctor Schedule:
    docASched = Doc_schedule(doctor_id = docA,
                             days_visiting = "Monday",
                             visiting_hours_start = "10:30",
                             visiting_hours_end = "22:30",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docASched.save()
    docASched.speciality_id.add(spCardio, spOBGY, spPediatrics)
    docASched.facility_id.add(facA, facB)

    docASched2 = Doc_schedule(doctor_id = docA,
                             days_visiting = "Wednesday",
                             visiting_hours_start = "10:30",
                             visiting_hours_end = "22:30",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docASched2.save()
    docASched2.speciality_id.add(spCardio, spOBGY, spPediatrics)
    docASched2.facility_id.add(facA, facB)

    docASched3 = Doc_schedule(doctor_id = docA,
                             days_visiting = "Friday",
                             visiting_hours_start = "10:30",
                             visiting_hours_end = "22:30",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docASched3.save()
    docASched3.speciality_id.add(spCardio, spOBGY, spPediatrics)
    docASched3.facility_id.add(facA, facB)

    docBSched = Doc_schedule(doctor_id = docB,
                             days_visiting = "Tuesday",
                             visiting_hours_start = "9:00",
                             visiting_hours_end = "22:00",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docBSched.save()
    docBSched.speciality_id.add(spCardio, spOBGY, spPediatrics)
    docBSched.facility_id.add(facB, facC)

    docBSched2 = Doc_schedule(doctor_id = docB,
                             days_visiting = "Thursday",
                             visiting_hours_start = "9:00",
                             visiting_hours_end = "22:00",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docBSched2.save()
    docBSched2.speciality_id.add(spCardio, spOBGY, spPediatrics)
    docBSched2.facility_id.add(facB, facC)

    docBSched3 = Doc_schedule(doctor_id = docB,
                             days_visiting = "Monday",
                             visiting_hours_start = "9:00",
                             visiting_hours_end = "22:00",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docBSched3.save()
    docBSched3.speciality_id.add(spCardio, spOBGY, spPediatrics)
    docBSched3.facility_id.add(facA, facB)

    docBSched4 = Doc_schedule(doctor_id = docB,
                             days_visiting = "Wednesday",
                             visiting_hours_start = "9:00",
                             visiting_hours_end = "22:00",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docBSched4.save()
    docBSched4.speciality_id.add(spCardio, spOBGY, spPediatrics)
    docBSched4.facility_id.add(facA, facB)

    docCSched = Doc_schedule(doctor_id = docC,
                             days_visiting = "Monday",
                             visiting_hours_start = "9:30",
                             visiting_hours_end = "17:30",
                             from_date = "2024-05-01",
                             to_date = "2024-05-25"
                             )
    docCSched.save()
    docCSched.speciality_id.add(spOBGY, spPediatrics)
    docCSched.facility_id.add(facC)

    ############## ADMIN: ##############
    # Admin Users:
    admins = [["Majorie", "Turner", "MTURNER@GMAIL.COM", "111", True, 1111111111]
            ]
    
    for admin in admins:
        adm = AdminTable(first_name = admin[0],
                         last_name = admin[1],
                         email = admin[2],
                         password = admin[3],
                         is_active = admin[4],
                         phone_number = admin[5])
        
        adm.save()

    ############## PATIENT: ##############
    # Patient Users:
    patientA = Patient(first_name = "Isa",
                       last_name = "Jeana",
                       email = "IJ@GMAIL.COM",
                       password = "111",
                       addressLine1 = "1163 Goldcliff Circle",
                       city = "Washington",
                       state = "DC",
                       zipCode = 20009,
                       phone_number = "2063428631")
    patientA.save()

    patientB = Patient(first_name = "Nia",
                       last_name = "Avi",
                       email = "NAVI@GMAIL.COM",
                       password = "111",
                       addressLine1 = "3936 Hickory Lane",
                       city = "Washington",
                       state = "DC",
                       zipCode = 20009,
                       phone_number = "2126583916")
    patientB.save()

    patientC = Patient(first_name = "Sabrina",
                       last_name = "Porter",
                       email = "SPORTER@GMAIL.COM",
                       password = "111",
                       addressLine1 = "3150 Massachusetts Avenue",
                       city = "Washington",
                       state = "DC",
                       zipCode = 20004,
                       phone_number = "2341096666")
    patientC.save()

    # Patient Credit Card:
    config = configparser.ConfigParser()
    config.read('config.ini')
    key = config['Encryption']['KEY']
    f = Fernet(key)
    ec = f.encrypt("4230556564069228".encode())
    encryptedCard = base64.urlsafe_b64encode(ec).decode()
    patientCreditA = PatientCreditCard(patient_id = patientA,
                                       card_number = encryptedCard,
                                       card_holder_name = "Isa",
                                       cvv = 111,
                                       addressLine1 = "1163 Goldcliff Circle",
                                       city = "Washington",
                                       state = "DC", 
                                       zipCode = 20009,
                                       expiry_date = "11/25")
    patientCreditA.save()

    ec = f.encrypt("7054223079877113".encode())
    encryptedCard = base64.urlsafe_b64encode(ec).decode()
    patientCreditB = PatientCreditCard(patient_id = patientB,
                                       card_number = encryptedCard,
                                       card_holder_name = "Nia",
                                       cvv = 111,
                                       addressLine1 = "3936 Hickory Lane",
                                       city = "Washington",
                                       state = "DC", 
                                       zipCode = 20009,
                                       expiry_date = "02/26")
    patientCreditB.save()

    ec = f.encrypt("3230531592444268".encode())
    encryptedCard = base64.urlsafe_b64encode(ec).decode()
    patientCreditC = PatientCreditCard(patient_id = patientC,
                                       card_number = encryptedCard,
                                       card_holder_name = "Sabrina",
                                       cvv = 111,
                                       addressLine1 = "3150 Massachusetts Avenue",
                                       city = "Washington",
                                       state = "DC", 
                                       zipCode = 20004,
                                       expiry_date = "11/27")
    patientCreditC.save()

    # Patient Preference:
    patientPrefA = PatientPreference(patient_id = patientA)
    patientPrefA.save()

    patientPrefB = PatientPreference(patient_id = patientB)
    patientPrefB.save()

    patientPrefC = PatientPreference(patient_id = patientC)
    patientPrefC.save()

    # Patient Record:
    # -- Patient A --
    patientRecA1 = Patient_record(patient_id = patientA,
                                 doctor_id = docA,
                                 medical_diagnosis = "Healthy",
                                 diagnosis_date = "2024-05-01",
                                 symptoms = "Frequent heart pain",
                                 temperature = "90",
                                 blood_pressure = "120/80",
                                 heart_rate = "120",
                                 respiratory_rate = "20",
                                 current_medications = "None"
                                )
                                 
    patientRecA1.save()

    # patientRecB = Patient_record(patient_id = patientB,
    #                              doctor_id = docB,
    #                              medical_diagnosis = "Healthy",
    #                              diagnosis_date = "2024-05-01",
    #                              symptoms = "N/A",
    #                              temperature = "90",
    #                              blood_pressure = "120/80",
    #                              heart_rate = "120",
    #                              respiratory_rate = "20",
    #                              current_medications = "None"
    #                              )
    # patientRecB.save()

    # Patient Appointments:
    # -- Patient A --
    # Past:
    startTime = datetime.time(20, 0, 0)
    endTime = datetime.time(21, 0, 0)
    appDate = datetime.date(2024, 5, 1)
    patientAppAFuture = Appointments(patient_id = patientA,
                               facility_id = facA,
                               doctor_id = docA,
                               speciality_id = spCardio,
                               schedule_id = docASched2,
                               patient_rec_id = patientRecA1,
                               start_time = startTime,
                               end_time =endTime,
                               date = appDate)
    patientAppAFuture.save()