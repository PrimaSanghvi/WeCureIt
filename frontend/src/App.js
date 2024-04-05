import React from 'react'
import LoginPage from "./Components/LoginPage/LoginPage";
import SignupPage from "./Components/LoginPage/SignupPage";
import SignupPage2 from "./Components/LoginPage/SignupPage2";
import {UserHomePage} from "./Components/Patient/UserHomePage";
import {UserEditProfile} from "./Components/Patient/UserEditProfile";
import DoctorHomePage from "./Components/Doctor/DoctorHomePage";
import AddDoctor from "./Components/Admin/AddDoctor";

import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';


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
        <Route path ="/doctorHomepage/:doctorId" element = {<DoctorHomePage />}/>
        <Route path ="/addDoctor/:doctorId" element = {<AddDoctor />}/>
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