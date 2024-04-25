import React from 'react'
import LoginPage from "./Components/LoginPage/LoginPage";
import SignupPage from "./Components/LoginPage/SignupPage";
import SignupPage2 from "./Components/LoginPage/SignupPage2";
import {UserHomePage} from "./Components/Patient/UserHomePage";
import {UserEditProfile} from "./Components/Patient/UserEditProfile";
import AddDoctors from "./Components/admin/AddDoctors";
import EditDoctor from "./Components/admin/EditDoctor";
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import AddSchedule from "./Components/Doctor/AddSchedule";
import AddScheduleHome from "./Components/Doctor/AddScheduleHome";
import ViewMedicalRec from "./Components/Doctor/ViewMedicalRec";
import AddMedicalRec from "./Components/Doctor/AddMedicalRec";
import DoctorHomePage from "./Components/Doctor/DoctorHomePage";
import ReviewMedicalInfo from "./Components/Doctor/ReviewMedicalInfo";
import ViewAppointment from "./Components/Doctor/ViewAppointment";

const App = () => {
  return (
    <Router>
    <div>
        <Routes>
   
        <Route path="/" element={<LoginPage />}/>
        <Route path="/signUp" element={<SignupPage />}/>
        <Route path="/creditCardDetails" element={<SignupPage2 />}/>
        <Route path="/patientHomepage/:patientId" element={<UserHomePage />}/>
        <Route path="/editProfile/:patientId" element={<UserEditProfile />}/>
        <Route path="/addDoctors"element={<AddDoctors/>}/>
        <Route path="/editdoctors"element={<EditDoctor/>}/>
        <Route path="/addschedule"element={<AddSchedule/>}/>
        <Route path="/editschedule"element={<AddScheduleHome/>}/>
        <Route path="/viewpatientrec/:patientrecId"element={<ViewMedicalRec/>}/>
        <Route path="/addpatientrec/"element={<AddMedicalRec/>}/>
        <Route path ="/doctorHomepage/:doctorId" element = {<DoctorHomePage />}/>
        <Route path ="/doctorHomepage/:patientId/medical_info/" element = {<ReviewMedicalInfo />}/>
        <Route path ="/doctorHomepage/:doctorId/viewappointment" element = {<ViewAppointment />}/>
      </Routes>
    </div>
</Router>

  );
};

export default App;

// export default function App() {
//   return (
//     <div className='app'>
//       <main>
//       <LoginPage />
//       </main>
//     </div>
    
//   );
//}