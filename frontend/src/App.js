import React from 'react'
import LoginPage from "./Components/LoginPage/LoginPage";
import SignupPage from "./Components/LoginPage/SignupPage";
import SignupPage2 from "./Components/LoginPage/SignupPage2";
import {UserHomePage} from "./Components/Patient/UserHomePage";
import {UserEditProfile} from "./Components/Patient/UserEditProfile";
import DoctorHomePage from "./Components/Doctor/DoctorHomePage";
import AddDoctors from "./Components/Admin/AddDoctors";
import EditDoctor from "./Components/Admin/EditDoctor";
import FacilityHome from './Components/Admin/FacilityHome';
import FacilityEdit from './Components/Admin/FacilityEdit';
import { UserEditPayment } from './Components/Patient/UserEditPayment';
import { UserEditPreference } from './Components/Patient/UserEditPreference';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import AddSchedule from "./Components/Doctor/AddSchedule";
import AddScheduleHome from "./Components/Doctor/AddScheduleHome";
import ViewMedicalRec from "./Components/Doctor/ViewMedicalRec";
import AddMedicalRec from "./Components/Doctor/AddMedicalRec";
import ReviewMedicalInfo from "./Components/Doctor/ReviewMedicalInfo";

const App = () => {
  return (
    <Router>
    <div>
        <Routes>
   
        <Route path="/" element={<LoginPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signUp" element={<SignupPage />}/>
        <Route path="/creditCardDetails" element={<SignupPage2 />}/>
        <Route path="/patientHomepage/:patientId" element={<UserHomePage />}/>
        <Route path="/editProfile/:patientId" element={<UserEditProfile />}/>
        <Route path ="/doctorHomepage/:doctorId" element = {<DoctorHomePage />}/>
        <Route path="/addDoctors/:adminId"element={<AddDoctors/>}/>
        <Route path="/editdoctors"element={<EditDoctor/>}/>
        <Route path="/admin/facility/:adminId" element={<FacilityHome />}/>
        <Route path="/admin/editFacility/:facilityId" element={<FacilityEdit />}/>
        <Route path="/editPreference/:patientId" element={<UserEditPreference />}/>
        <Route path="/editPayment/:patientId" element={<UserEditPayment />}/>
        <Route path="/addschedule"element={<AddSchedule/>}/>
        <Route path="/editschedule"element={<AddScheduleHome/>}/>
        <Route path="/viewpatientrec/:patientrecId"element={<ViewMedicalRec/>}/>
        <Route path="/addpatientrec/"element={<AddMedicalRec/>}/>
        <Route path ="/doctorHomepage/:doctorId" element = {<DoctorHomePage />}/>
        <Route path ="/doctorHomepage/:patientId/medical_info/" element = {<ReviewMedicalInfo />}/>
      </Routes>
    </div>
</Router>

  );
};

export default App;
