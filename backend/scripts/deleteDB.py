# Delete the data stored in the database for each table
# Requirements:
# 1. Need psycopg2 installed
# 2. Need django-extensions installed
from weCureIt.models import Doctor, ManageRooms, Facility, AdminTable, Speciality

def run():
    # ################# DELETE ALL ITEMS FIRST FOR A CLEAN START #################
    ManageRooms.objects.all().delete()
    Facility.objects.all().delete()
    Doctor.objects.all().delete()
    AdminTable.objects.all().delete()
    Speciality.objects.all().delete()