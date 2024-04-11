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

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include(router.urls)),
    path('api/patientLogin/', views.PatientLoginView.as_view(), name='patientLogin'),
    path('api/patientDetail/<int:pk>/', views.PatientDetail.as_view(), name='patientDetail'),
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
    path('api/addDoctorSchedule/', views.DocScheduleCreateAPI.as_view(), name = 'addDoctorSchedule'),
]
