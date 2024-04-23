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

def run():
    ############## SPECIALTY: ##############
    # Specialty Types:
    specialities = ["Cardiology", "Dentist"]

    spCardio = Speciality(name = specialities[0])
    spCardio.save()

    spDentist = Speciality(name = specialities[1])
    spDentist.save()
    
    ############## FACILITY: ##############
    # Facility:
    facA = Facility(name = "The George Washington University Hospital",
                    addressLine1 = "900 23rd St. NW",
                    city = "Washington",
                    state = "D.C.",
                    zipCode = 20037,
                    rooms_no = 5,
                    phone_number = "2027154000",
                    is_active = True)
    facA.save()
    facARoom = ManageRooms(unavailable_room = [1, 3, 5],
                               facility_id = facA,
                               date = "2024-04-24")
    facARoom.save()

    facB = Facility(name = "Holy Cross Hospital", 
                    addressLine1 = "1500 Forest Glen Rd",
                    city = "Silver Spring",
                    state = "MD",
                    zipCode = 20910,
                    rooms_no = 4,
                    phone_number = "3017547000",
                    is_active = True)
    facB.save()
    facBRoom = ManageRooms(unavailable_room = [2, 3],
                               facility_id = facB,
                               date = "2024-04-24")
    facBRoom.save()


    facC = Facility(name = "MedStar Washington Hospital Center", 
                    addressLine1 = "110 Irving St NW",
                    city = "Washington",
                    state = "D.C.",
                    zipCode = 20010,
                    rooms_no = 4,
                    phone_number = "2028777000",
                    is_active = False)
    facC.save()

    ############## DOCTOR: ##############
    # Doctor Users:
    docA = Doctor(first_name = "Fern",
                  last_name = "Moyer",
                  email = "FMOYER@GMAIL.COM",
                  password = "111",
                  phone_number = 1111111111,
                  is_active = True)
    docA.save()
    docA.speciality_id.add(spCardio)

    docB = Doctor(first_name = "Tia",
                  last_name = "McKnight",
                  email = "TMCKNIGHT@GMAIL.COM",
                  password = "111",
                  phone_number = 1111111111,
                  is_active = True)
    docB.save()
    docB.speciality_id.add(spCardio, spDentist)

    docC = Doctor(first_name = "Gordon",
                  last_name = "Ortiz",
                  email = "GORTIZ@GMAIL.COM",
                  password = "111",
                  phone_number = 1111111111,
                  is_active = False)
    docC.save()
    docC.speciality_id.add(spDentist)

    # Doctor Schedule:
    docASched = Doc_schedule(doctor_id = docA,
                             days_visiting = "M"
                             )
    docASched.save()
    docASched.speciality_id.add(spCardio)
    docASched.facility_id.add(facA, facB)

    docBSched = Doc_schedule(doctor_id = docB,
                             days_visiting = "M, W, F"
                             )
    docBSched.save()
    docBSched.speciality_id.add(spCardio, spDentist)
    docBSched.facility_id.add(facB)

    ############## ADMIN: ##############
    # Admin Users:
    admins = [["Majorie", "Turner", "MTURNER@GMAIL.COM", "12345", True, 1111111111]
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
                       addressLine1 = "testing",
                       city = "Washington",
                       state = "DC",
                       zipCode = 11111,
                       phone_number = "1111111111")
    patientA.save()

    patientB = Patient(first_name = "Nia",
                       last_name = "Avi",
                       email = "NAVI@GMAIL.COM",
                       password = "111",
                       addressLine1 = "testing",
                       city = "Washington",
                       state = "DC",
                       zipCode = 11111,
                       phone_number = "1111111111")
    patientB.save()

    # Patient Credit Card:
    patientCreditA = PatientCreditCard(patient_id = patientA,
                                       card_number = "111",
                                       card_holder_name = "Isa",
                                       cvv = 111,
                                       addressLine1 = "testing",
                                       city = "Washington",
                                       state = "DC", 
                                       zipCode = 11111,
                                       expiry_date = "11/25")
    patientCreditA.save()

    patientCreditB = PatientCreditCard(patient_id = patientB,
                                       card_number = "111",
                                       card_holder_name = "Isa",
                                       cvv = 111,
                                       addressLine1 = "testing",
                                       city = "Washington",
                                       state = "DC", 
                                       zipCode = 11111,
                                       expiry_date = "11/25")
    patientCreditB.save()

    # Patient Preference:
    patientPrefA = PatientPreference(patient_id = patientA)
    patientPrefA.save()

    patientPrefB = PatientPreference(patient_id = patientB)
    patientPrefB.save()

    # Patient Record:
    # -- Patient A --
    patientRecA1 = Patient_record(patient_id = patientA,
                                 doctor_id = docA)
    patientRecA1.save()

    patientRecA2 = Patient_record(patient_id = patientA,
                                 doctor_id = docA)
    patientRecA2.save()

    # -- Patient B --
    patientRecB = Patient_record(patient_id = patientB,
                                 doctor_id = docB)
    patientRecB.save()

    # Patient Appointments:
    # -- Patient A --
    startTime = datetime.time(10, 0, 0)
    endTime = datetime.time(11, 0, 0)
    appDate = datetime.date(2024, 4, 29)
    patientAppAFuture = Appointments(patient_id = patientA,
                               facility_id = facA,
                               doctor_id = docA,
                               speciality_id = spCardio,
                               schedule_id = docASched,
                               patient_rec_id = patientRecA1,
                               start_time = startTime,
                               end_time =endTime,
                               date = appDate)
    patientAppAFuture.save()

    appDate = datetime.date(2024, 4, 15)
    patientAppAPast = Appointments(patient_id = patientA,
                               facility_id = facA,
                               doctor_id = docA,
                               speciality_id = spCardio,
                               schedule_id = docASched,
                               patient_rec_id = patientRecA2,
                               start_time = startTime,
                               end_time =endTime,
                               date = appDate)
    patientAppAPast.save()

    # -- Patient B --
    startTime = datetime.time(9, 0, 0)
    endTime = datetime.time(9, 30, 0)
    appDate = datetime.date(2024, 4, 29)
    patientAppBFuture = Appointments(patient_id = patientB,
                               facility_id = facB,
                               doctor_id = docB,
                               speciality_id = spDentist,
                               schedule_id = docBSched,
                               patient_rec_id = patientRecB,
                               start_time = startTime,
                               end_time =endTime,
                               date = appDate)
    patientAppBFuture.save()