// import React from "react";

import styles from './UserEditProfile.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export const  UserEditProfile = () => {
  const { patientId } = useParams();

  console.log("This is a line written to the console.");
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [repassword, setrepassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address1, setaddress1] = useState('');
  const [address2, setaddress2] = useState('');
  const [city, setcity] = useState('');
  const [state, setstate] = useState('');
  const [zipcode, setzipcode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, such as sending the data to your backend
    console.log("Form submitted!");
    console.log("First Name:", firstname);
    console.log("Last Name:", lastname);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Re-entered Password:", repassword);
    console.log("Address Line 1:", address1);
    console.log("Address Line 2:", address2);
    console.log("City:", city);
    console.log("State:", state);
    console.log("Zip Code:", zipcode);
};
const [userData, setUserData] = useState(null);

useEffect(() => {
  const fetchUserData = async () => {
    // try {
    //   const response = await axios.get(`http://127.0.0.1:8000/api/patientDetail/${patientId}`);
    //   if (response.status === 200) {
    //     setUserData(response.data);
    //   } else {
    //     console.error("Failed to fetch data with status:", response.status);
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
    axios.get(`http://127.0.0.1:8000/api/patientDetail/${patientId}`)
     .then(response => {
         console.log(response.data);
     })
     .catch(error => {
         console.error('There was an error!', error);
     });
  };

  fetchUserData();
}, [patientId]); 
useEffect(() => {
  console.log(userData); // This will log userData when it updates
}, [userData]);
  return (
    
    <div className={styles["user-edit-profile"]}>
      <div className={styles["div-2"]}>
        <div className={styles["edit-profile"]}>
          <div className={styles["edit-profile-2"]}>
            <div className={styles["text-wrapper-4"]}>Edit Profile</div>
            <img className={styles["edit"]} alt="Edit" src="/img/edit.svg" />
          </div>
        </div>
        <div className={styles["edit-payment-method"]}>
          <div className={styles["div-3"]}>
            <div className={styles["text-wrapper-5"]} onClick={editpayment}>Edit Payment Method</div>
            <img className={styles["edit"]} alt="Edit" src="/img/edit-1.svg" />
          </div>
        </div>
        <div className={styles["edit-saved"]}>
          <div className={styles["div-3"]}>
            <div className={styles["text-wrapper-5"]} onClick={editsavedpreference}>Edit Saved Preferences</div>
            <img className={styles["edit"]} alt="Edit" src="/img/edit-2.svg" />
          </div>
        </div>
        <div className={styles["edit-profile-3"]}>
          <form onSubmit={handleSubmit}>
          <div className={styles["group"]}>
            <div className={styles["overlap-group-2"]}>
              <div className={styles["div-wrapper"]}>
                <div className={styles["text-wrapper-6"]}>Edit Profile</div>
              </div>
              <div className={styles["frame-3"]}>
                <div className={styles["input"]}>First Name</div>
                <div className={styles["frame-4"]}>
                  <input className={styles["frame-5" ]}
                  type='text'
                  value={"Prima"}
                  onChange={(e) => setfirstname(e.target.value)}
                  placeholder="Enter your First Name" />
                </div>
              </div>
              <div className={styles["frame-6"]}>
                <div className={styles["input"]}>Last Name</div> 
                <div className={styles["frame-7"]}>
                  <input className={styles["frame-8"]} 
                  value={"Sanghvi"}
                  onChange={(e) => setlastname(e.target.value)}
                  placeholder="Enter your Last Name" type="text" />
                </div>
              </div>
            </div>
            
            <div className={styles["frame-55"]}>
              <div className={styles["name-wrapper"]}>
                <div className={styles["name"]}>Re-enter a password</div>
              </div>
              <div className={styles["framewrapper"]}>
                  <input className={styles["text-wrapper-8" ]}
                  value={repassword}
                  onChange={(e) => setrepassword(e.target.value)}
                  type="text"/>
              </div>
            </div>
            
            <div className={styles["frame frame-instance"]}>
              <div className={styles["frame name-wrapper"]}>
                <div className={styles["name"]}>Reset Password</div>
              </div>
              <div className={styles["framewrapper"]}>
                  <input className={styles["text-wrapper-8" ]}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"/>
              </div>
            </div>

            <div className={styles["frame frame-55-instance"]}>
              <div className={styles["frame name"]}>
                <div className={styles["name"]}>Enter your email</div>
              </div>
              <div className={styles["framewrapper"]}>
                  <input className={styles["text-wrapper-8" ]}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"/>
              </div>
            </div>

            
            <div className={styles["frame-9"]}>
              <div className={styles["frame-10"]}>
                <div className={styles["text-wrapper-7"]}>Address</div>
              </div>
              <div className={styles["frame-11"]}>
                
                 <input className={styles["text-wrapper-8" ]}
                 value={address1}
                 onChange={(e) => setaddress1(e.target.value)}
                 
                 placeholder=" Address Line 1" type="text" />
                
              </div>
              <div className={styles["frame-13"]}>
                <input className={styles["text-wrapper-8" ]}
                value={address2}
                onChange={(e) => setaddress2(e.target.value)}
                placeholder=" Address Line 2" type="text" />
              </div>
              <div className={styles["frame-14"]}>
                <div className={styles["text-wrapper-7"]}>City</div>
              </div>
              <div className={styles["frame-15"]}>
                <div className={styles["frame-12"]}>
                <input className={styles["text-wrapper-8"]} 
                value={city}
                onChange={(e) => setcity(e.target.value)}
                placeholder=" City Name" type="text" />
                </div>
              </div>
              <div className={styles["frame-16"]}>
                <div className={styles["text-wrapper-7"]}>State</div>
              </div>
              <div className={styles["frame-17"]}>
                <div className={styles["frame-12"]}>
                <input className={styles["text-wrapper-8"]} 
                value={state}
                onChange={(e) => setstate(e.target.value)}
                placeholder=" State Name" type="text" />
                </div>
              </div>
              <div>
              <div  className={styles["zipcode"]}> Zipcode</div>
              </div>
              
              <div className={styles["frame-18"]}>
                <div className={styles["frame-12"]}>
                <input className={styles["text-wrapper-8"]} 
                value={zipcode}
                onChange={(e) => setzipcode(e.target.value)}
                placeholder="Zip-Code" type="text" />
                </div>
              </div>
            </div>
            
          </div>
          

          <div className={styles["buttons-instance"]}>
          <div className={styles["overlap-group"]}>
            <div className={styles["savediv"]} onClick ={handleSubmit}>
              <div className={styles["divwrapper"]} onClick ={handleSubmit}>Save Changes</div>
            </div>
          </div>
          </div>
          
          </form>
        </div>
        <div className={styles["top-bar"]}>
          <div className={styles["top-bar-background"]} />
          <div className={styles["frame-19"]}>
          
            <div className={styles["company-name-icon-instance"]}>
            <div className={styles["text-wrapper-3"]}>WeCureIt</div>
      <div className={styles["vector"]}></div>
    </div>
            <div className={styles["profile"]} />
            <div className={styles["create-appointment"]}>
              <div className={styles["login-instance"]}> 
                  <div className={styles["class-6"]} onClick={handleClick}>Log Out</div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
const handleClick = () => {
  //change the address to the actual homepage or login page to redirect
  window.location.href = "/login";
};
const editpayment = () => {
  //change the code to the real page of edit payment 
  window.location.href = "/editpayment";
  console.log("transfer to edit payment")
};

const editsavedpreference = () =>{
  //change the code to redirect to the real page of edit saved preference
  window.location.href = "/editpreference";
  console.log("transfer to editpayment")
}

