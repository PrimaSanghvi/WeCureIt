"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework import routers
from weCureIt import views

router = routers.DefaultRouter()
router.register(r'patientRegister', views.PatientInfoView, 'patientRegister')
router.register(r'patientCardDetails', views.PatientCreditCardView, 'patientCardDetails')
router.register(r'DoctorRegister', views.DoctorInfoView, 'DoctorRegister')
router.register(r'patientPreference', views.PatientPreferenceView, 'patientPreference')
router.register(r'updateRooms', views.UpdateRoomsView, 'updateRooms')

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include(router.urls)),
    path('api/patientLogin/', views.PatientLoginView.as_view(), name='patientLogin'),
    path('api/patientDetail/<int:pk>/', views.PatientDetail.as_view(), name='patientDetail'),
    path('api/patientPayment/<int:pk>/', views.PatientPaymentView.as_view(), name='patientPaymentView'),
    path('api/doctorLogin/', views.DoctorLoginView.as_view(), name='doctorLogin'),
    path('api/doctors/<int:doctor_id>/appointments/today/', views.TodaysAppointmentsView.as_view(), name='todays-appointments'),
    path('api/doctors/<int:doctor_id>/appointments/upcoming/', views.UpcomingAppointmentsView.as_view(), name='upcoming-appointments'),
    path('api/doctors/<int:doctor_id>/schedule/<str:selected_date>/', views.DoctorScheduleView.as_view(), name = 'doctor-schedule'),
    # path('api/editDoctors/<int:doctor_id>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('api/specialties/', views.SpecialtyListView.as_view(), name='specialty-list'),
    path('api/doctorlist/', views.DoctorListView.as_view(), name='doctor-list'),
    path('api/removedoctor/<int:pk>/', views.DoctorInactiveView.as_view(), name='doctor-remove'),
    path('api/adminLogin/', views.AdminLoginView.as_view(), name='adminLogin'),
    path('api/patientPreferenceDetail/<int:pk>/', views.PatientPreferenceDetail.as_view(), name='patientPreferenceDetail'),
    path('api/allDoctorDetail/', views.AllDoctorDetail.as_view(), name='allDoctorDetail'),
    path('api/allFacilityDetail/', views.AllFacilityDetail.as_view(), name='allFacilityDetail'),

    ###### add the doctor schedule, add the schedule repeatedly for the same doctor will only update according data
    # POST request body: {
    #     "doctor_id": 1,
    #     "days_visiting": "Monday, Wednesday, Thursday, Friday",
    #     "facility_id": [1, 2],
    #     "visiting_hours_start": "09:00",
    #     "visiting_hours_end": "17:00",
    #     "speciality_id": [1, 2]
    # }
    path('api/doctorSchedule/add/', views.DocScheduleCreateAPI.as_view(), name = 'add_DoctorSchedule'),

    ###### remove day, this api will update the charField in the doc_schedule table
    # POST request body: {
    #     "doctor_id": 1,
    #     "day_to_remove": "Monday"
    # }
    path('api/doctorSchedule/deleteDay/', views.UpdateScheduleDaysAPI.as_view(), name='delete_DoctorSchedule_day'),

    ###### remove Facility 
    # DELETE request body: {
    #     "doctor_id": 1,
    #     "facility_id": 2
    # }
    path('api/doctorSchedule/deleteFacility/', views.UnlinkFacilityAPIView.as_view(), name='remove_facility'),

    ###### remove Specialty
    # DELETE request body: {
    #     "doctor_id": 1,
    #     "speciality_id": 2
    # }
    path('api/doctorSchedule/deleteSpeciality/', views.UnlinkSpecialtyAPIView.as_view(), name = 'remove_speciality'),
    path('api/facilities/', views.FacilityListView.as_view(), name='facility-list'),
    path('api/facilities/create/', views.FacilityCreateView.as_view(), name='facility-create'),
    path('api/facilities/update/<int:pk>/',views.FacilityUpdateView.as_view(), name='facility-update'),
    path('api/allEmails/', views.AllEmailsView.as_view(), name = 'allEmails'),
    path('api/facilities/deactivate/<int:pk>/', views.FacilityDeactivateView.as_view(), name='deactivate-facility'),
    path('api/available-doctors/', views.AvailableDoctorsView.as_view(), name='available-doctors'),
    path('api/rooms/', views.ManageRoomsView.as_view(), name = 'manage_rooms'),
    path('api/patientmedicalrec/<int:pk>/',views.PatientRecView.as_view(), name='medical-review'),
    path('api/patientmedicalcreate/<int:pk>/',views.PatientRecView.as_view(), name='medical-review'),
    path('api/patientmedicalcreate/medical_info/<int:pk>/', views.PatientAllRecView.as_view(), name='all-medical'),
    path('api/patientmedicalcheck/', views.NewRecView.as_view(), name='medical_check'),
    path('api/doctorinfo/<int:pk>/', views.DoctorDetail.as_view(), name='doctor-info'),
    path('api/facilityinfo/<int:pk>/', views.FacilityDetail.as_view(), name='doctor-info'),
    path('api/specialtyinfo/<int:pk>/', views.SpecialtyDetail.as_view(), name='doctor-info'),
    path('api/patientmedicalcreate/', views.PatientRecCreateView.as_view(), name='doctor-info'),
    ###### get doc schedule List
    # GET request
    # 
    path('api/findAvailableSchedule/', views.DocScheduleListView.as_view(), name='search_available_schedule'),
    path('api/patientUpcomingAppointment/<int:patient_id>/', views.PatientUpcomingAppointmentsView.as_view(), name='patient_upcoming_appointment'),
    path('api/patientPastAppointment/<int:patient_id>/', views.PatientPastAppointmentsView.as_view(), name='patient_past_appointment'),
    path('api/patientCancelAppointment/<int:pk>/', views.PatientCancelAppointmentView.as_view(), name='cancel_appointment'),
    path('api/doctorAppointments/', views.DoctorAppointmentsView.as_view(), name = 'doctor-appointments'),

    path('api/available-appointment/', views.AvailableDoctorsView.as_view(), name='available-doctors'),
    path('api/book-appointments/', views.CreateAppointmentView.as_view(), name='create-appointment'),
    path('api/recommend-slot/', views.SlotRecommendationView.as_view(), name='recommend-slot'),
]
