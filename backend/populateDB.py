# Populate the database for each table
# Requirements:
# 1. Need psycopg2 installed

import psycopg2

# Define the database connection parameters:
db_params = {
        'host': 'localhost',
        'database': 'WeCureITDB',
        'user': 'laurenhahn',
        'password': '54321',
        'port': 5432
}

# Create connection to the PostgresSQL server
conn = psycopg2.connect(
    host     = db_params['host'],
    database = db_params['database'],
    user     = db_params['user'],
    password = db_params['password'],
    port     = db_params['port']
)

# Create a cursor object
cur = conn.cursor()

################# DELETE ALL ITEMS FIRST FOR A CLEAN START #################
# Facility:
cur.execute('ALTER SEQUENCE "weCureIt_facility_facility_id_seq" RESTART WITH 1') # Reset facility id
conn.commit()

cur.execute('DELETE FROM "weCureIt_facility"')
conn.commit()

# Doctor:
cur.execute('ALTER SEQUENCE "weCureIt_doctor_doctor_id_seq" RESTART WITH 1') # Reset doctor id
conn.commit()

cur.execute('DELETE FROM "weCureIt_doctor"')
conn.commit()


################# FETCH/SELECT #################
# All Tables:
# cur.execute("""SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'""")
# for table in cur.fetchall():
#     print(table)

# Patient Preference:
# cur.execute('SELECT * FROM "weCureIt_patientpreference"')
# rows = cur.fetchall()

# Doctor:
# cur.execute('SELECT * FROM "weCureIt_doctor"')
# rows = cur.fetchall()

# Facility:
# cur.execute('SELECT * FROM "weCureIt_facility"')

# rows = cur.fetchall()
# for row in rows:
#     print(row)

################# INSERT #################
# Facility:
facilities = [["The George Washington University Hospital", "900 23rd St. NW, Washington, D.C. 20037", 5, 2027154000, ["Cardiology"]],
              ["Holy Cross Hospital", "1500 Forest Glen Rd, Silver Spring, MD 20910", 4, 3017547000, ["Cardiology"]],
              ["Howard University Hospital", "2041 Georgia Ave NW, Washington, D.C. 20060", 5, 2028656100, ["Cardiology", "Pediatrics"]]
             ]

for facility in facilities:
    cur.execute('INSERT INTO "weCureIt_facility" (name, address, rooms_no, phone_number, speciality) VALUES (%s, %s, %s, %s, %s)', (facility[0], facility[1], facility[2], facility[3], facility[4]))
    conn.commit()

# Doctor:
doctors = [["Fern", "Moyer", ["Cardiology"], "fmoyer@gmail.com", "12345", 1111111111, True],
           ["Tia", "McKnight", ["Cardiology", "Pediatrics"], "tmcknight@gmail.com", "12345", 1111111111, True]
          ]

for doctor in doctors:
    cur.execute('INSERT INTO "weCureIt_doctor" (first_name, last_name, speciality, email, password, phone_number, is_active) VALUES (%s, %s, %s, %s, %s, %s, %s)', (doctor[0], doctor[1], doctor[2], doctor[3], doctor[4], doctor[5], doctor[6]))
    conn.commit()

# Close everything
cur.close()
conn.close()