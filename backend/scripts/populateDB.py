# Populate the database for each table
# Requirements:
# 1. Need psycopg2 installed
# 2. Need django-extensions installed

# Steps:
# 1. python3 manage.py runscript deleteDB
# 2. python3 manage.py sqlsequencereset weCureIt | python3 manage.py dbshell
# 3. python3 manage.py runscript populateDB
from weCureIt.models import Doctor, ManageRooms, Facility, AdminTable, Speciality

def run():
    ################# INSERT #################
    # Facility:
    facilities = [["The George Washington University Hospital", "900 23rd St. NW", "", "Washington", "D.C.", 20037,  5, "2027154000", True],
                ["Holy Cross Hospital", "1500 Forest Glen Rd", "", "Silver Spring", "MD", 20910, 4, "3017547000", True],
                ["Howard University Hospital", "2041 Georgia Ave NW", "", "Washington", "D.C.", 20060, 5, "2028656100", True],
                ["MedStar Washington Hospital Center", "110 Irving St NW", "", "Washington", "D.C.", 20010, 5, "2028777000", False]
                ]
    for facility in facilities:
        fac = Facility(name = facility[0],
                       addressLine1 = facility[1],
                       addressLine2 = facility[2],
                       city = facility[3], 
                       state = facility[4],
                       zipCode = facility[5],
                       rooms_no = facility[6],
                       phone_number = facility[7],
                       is_active = facility[8])
        fac.save()

        # Manage rooms:
        if (facility[0] == "The George Washington University Hospital"):
            room = ManageRooms(unavailable_room = [1, 3, 5],
                               facility_id = fac,
                               date = "2024-04-24")
            room.save()
        elif (facility[0] == "Holy Cross Hospital"):
            room = ManageRooms(unavailable_room = [2, 3],
                               facility_id = fac,
                               date = "2024-04-28")
            room.save()

    # Doctor:
    doctors = [["Fern", "Moyer", "FMOYER@GMAIL.COM", "12345", 1111111111, True],
            ["Tia", "McKnight", "TMCKNIGHT@GMAIL.COM", "12345", 1111111111, True],
            ["Gordon", "Ortiz", "GORTIZ@GMAIL.COM", "12345", 1111111111, False]
            ]

    for doctor in doctors:
        doc = Doctor(first_name = doctor[0],
                     last_name = doctor[1],
                     email = doctor[2],
                     password = doctor[3],
                     phone_number = doctor[4],
                     is_active = doctor[5])
        doc.save()

    # Admin:
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

    # Specialty:
    specialities = ["Cardiology", "Dentist"]

    for specialty in specialities:
        sp = Speciality(name = specialty)
        sp.save()