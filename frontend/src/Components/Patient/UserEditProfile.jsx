import React, { useState, useEffect } from 'react';
import styles from './UserEditProfile.module.css';
import axios from 'axios';
import {  useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export const UserEditProfile = () => {
  const { patientId } = useParams();

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  //set several new state to handle control submit when invalid password input
  const [password, setPassword] = useState('');
  const [originalPass, setOrigPass] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  // eslint-disable-next-line
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  // eslint-disable-next-line


  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const [updateError, setUpdateError] =  useState('');
  const [userData, setUserData] = useState(null);
  const [formErrors, setFormErrors] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    first_name: '',
    last_name: '',
  });

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email address is required.");
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
// ***modify: fix the bug: warning popup of zipCode.trim()
  const validateAddress = () => {
    let errors = {};

  // Ensure variables are strings by converting them (null and undefined become empty strings)
  let addressLine1Str = String(addressLine1);
  let cityStr = String(city);
  let stateStr = String(state);
  let zipCodeStr = String(zipCode);

  // Validate fields, now safely using the trim() method
  if (!addressLine1Str.trim()) errors.addressLine1 = "Street Address is required.";
  // AddressLine2 is optional
  if (!cityStr.trim()) errors.city = "City is required.";
  if (!stateStr.trim()) errors.state = "State is required.";
  if (!zipCodeStr.trim()) {
    errors.zipCode = "Zip-Code is required.";
  } else if (!/^\d{5}(-\d{4})?$/.test(zipCodeStr)) {
    errors.zipCode = "Invalid Zip-Code format.";
  }

  setFormErrors(errors); // Assuming you have a state to handle form-wide errors
  return Object.keys(errors).length === 0;
  };
  
  const validatePassword = () => {
    let isValid = true; // Assume the form is valid unless proven otherwise

    if (password.length !== 0) {
      if (password !== reenteredPassword) {
        setConfirmPasswordError("Passwords do not match.");
        isValid = false;
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validatePassword();
    if(isValid){
      setUpdateError(''); 
      // Here you can handle the form submission, such as sending the data to your backend
      const phone_number = "1234567890";
          
      let formData = {};
      if (password.length !== 0) {
        formData = {
            first_name,
            last_name,
            email,
            password,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            phone_number, // Include static phone number in the form data
        };
      } else {
        formData = {
          first_name,
          last_name,
          email,
          originalPass,
          addressLine1,
          addressLine2,
          city,
          state,
          zipCode,
          phone_number, // Include static phone number in the form data
        };
      }
  
      // console.log("userData:", userData); // Debugging log
      // console.log("formData:", formData); // Debugging log
      
      const normalizeUserData = {
        ...userData,
        phone_number: userData.phone_number.toString(), // Ensure phone_number is a string
        // Exclude patient_id or any other irrelevant properties as needed
      };
      delete normalizeUserData.patient_id; // Remove patient_id from comparison
      
    const hasChanges = Object.keys(formData).some(key => 
      formData[key] !== normalizeUserData[key]
    );
    if (!hasChanges) {
        // No changes detected, set an error message and exit the function
        setUpdateError('No changes detected, nothing to update.');
        return;
      }
      axios.patch(`http://127.0.0.1:8000/api/patientRegister/${patientId}/`, formData)
      .then(response => {
          // console.log('Patient updated successfully!', response.data);
          navigate(`/patientHomepage/${patientId}`,{ state: { message: "Details Updated Successfully!" } });
        })
        .catch(error => {
          console.error('Error submitting form:', error);
      });  
    }else{
     console.log('form can not be submitted!');
    }
   
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/patientDetail/${patientId}`);
        if (response.status === 200) {
          const data = response.data;
          // Set state, checking for null values and providing defaults as necessary
          setUserData(data);
          setFirstName(data.first_name  === null ? '' : data.first_name);
          setLastName(data.last_name === null? '' : data.last_name);
          setEmail(data.email === null? '' : data.email);
          // Avoid setting passwords directly from fetched data
          setAddressLine1(data.addressLine1 === null? '': data.addressLine1);
          setAddressLine2(data.addressLine2 === null? '': data.addressLine2);
          setCity(data.city === null ? '' : data.city); // Explicit check for null
          setState(data.state === null ? '' : data.state); // Explicit check for null
          setZipCode(data.zipCode === null? '' : data.zipCode);
          setOrigPass(data.password === null? '' : data.password);
          // setPassword(data.password === null? '' : data.password)
          // Additional fields as necessary
        } else {
          console.error("Failed to fetch data with status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [patientId]);

  useEffect(() => {
    // console.log(userData); // This will log userData when it updates
  }, [userData]);

  const handleClick = () => {
    //change the address to the actual homepage or login page to redirect
    window.location.href =`/patientHomepage/${patientId}`;
  };

  const editpayment = () => {
    //change the code to the real page of edit payment 
    window.location.href = `/editPayment/${patientId}`;
    // console.log("transfer to edit payment")
  };
    
  const editsavedpreference = () =>{
    //change the code to redirect to the real page of edit saved preference
    window.location.href = `/editPreference/${patientId}`;
    // console.log("transfer to edit preference")
  }

  return (
    // TOP BAR/HEADER:
    <div className={styles['main-container']}>        
      <div  className={styles['top-bar']}>
        <div  className={styles['frame']}>      
          <div className={styles['main-container2']}>
            <span className={styles['we-cure-it']}>WeCureIt</span>
              <div className={styles['vector']} />
          </div>
          <div className={styles['create-appointment-button']}>
            <button  className={styles['create-appointment-btn']} onClick={handleClick}>
              <div  className={styles['frame-1']}>
                <span  className={styles['create-new-appointment']}>
                  HomePage           
                </span>
              </div>
            </button>
          </div>
          <div  className={styles['profile']}>
            {/* <div  className={styles['unsplash-ctagwpbqg']} /> */}
            <div className={styles['dropdown']}>
              <FontAwesomeIcon icon={faUserCircle} size="3x"/>
              <div className={styles['dropdown-content']}>
                <a href="/">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* UPDATE ERROR: */}
      {updateError && <div style={{ color: 'red', textAlign: 'center' }}>{updateError}</div>}
      {confirmPasswordError && <div style={{ color: 'red', textAlign: 'center' }}>{confirmPasswordError}</div>}
      {formErrors.zipCode && <div style={{ color: 'red', textAlign: 'center' }}>{formErrors.zipCode}</div>}
      {emailError && <div style={{ color: 'red', textAlign: 'center' }}>{emailError}</div>}
      {/* EDIT PROFILE INFORMATION: */}
      <div className={styles['edit-profile-information']}>
        <div className={styles['group-2']}>
          <div className={styles['frame-3']}>
            <div className={styles['frame-4']}>
              <span className={styles['address']}>Address</span>
            </div>

            <div className={styles['frame-5']}>
              
                <input className={styles["input" ]}
                 value={addressLine1}
                 onChange={(e) => setAddressLine1(e.target.value)}
                 onBlur = {validateAddress}
                 placeholder=" Address Line 1" type="text" />
                {formErrors.zipCode && <div style={{ color: 'red' }}>{formErrors.zipCode}</div>}
              
            </div>
            <div className={styles['frame-7']}>
              <input className={styles["input" ]}
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                onBlur = {validateAddress}
                placeholder=" Address Line 2" type="text" />
                 {/* {formErrors.zipCode && <div style={{ color: 'red' }}>{formErrors.zipCode}</div>} */}
            </div>
            <div className={styles['frame-a']}>
              <span className={styles['city']}>City</span>
            </div>
            <div className={styles['frame-b']}>
              
              <input className={styles["input"]} 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur = {validateAddress}
                placeholder=" City Name" type="text" />
                 {formErrors.zipCode && <div style={{ color: 'red' }}>{formErrors.zipCode}</div>}
              
            </div>
            <div className={styles['frame-d']}>
              <span className={styles['state']}>State</span>
            </div>
            <div className={styles['frame-e']}>
              
              <input className={styles["input"]} 
                value={state}
                onChange={(e) => setState(e.target.value)}
                onBlur = {validateAddress}
                placeholder=" State Name" type="text" />
                {formErrors.zipCode && <div style={{ color: 'red' }}>{formErrors.zipCode}</div>}
              
            </div>
            <div className={styles['frame-10']}>
              <span className={styles['zip-code']}>Zip-Code</span>
            </div>
            <div className={styles['frame-11']}>
              
              <input className={styles["input"]} 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onBlur = {validateAddress}
                placeholder="Zip-Code" type="text" />
                {formErrors.zipCode && <div style={{ color: 'red' }}>{formErrors.zipCode}</div>}
              
            </div>
          </div>
          <div className={styles['frame-14']}>
            <div className={styles['frame-15']}>
              <span className={styles['email-address']}>Email address</span>
            </div>
            <div className={styles['frame-16']}>
              
              <input className={styles["input" ]}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail} 
                  placeholder="Enter your email"
                  type="text"/>
                   {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
              
            </div>
          </div>
          <div className={styles['frame-18']}>
            <div className={styles['frame-19']}>
              <span className={styles['reset-password']}>Reset Password</span>
            </div>
            <div className={styles['frame-1a']}>
              
              <input className={styles["input" ]}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Reset password"
                  onBlur = {validatePassword}
                  type="text"/>
               {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}     
              
            </div>
          </div>
          <div className={styles['frame-1d']}>
            <div className={styles['frame-1e']}>
              <span className={styles['name']}>Re-enter a Password</span>
            </div>
            <div className={styles['frame-1f']}>
              
              <input className={styles["input" ]}
                  value={reenteredPassword}
                  onChange={(e) => setReenteredPassword(e.target.value)}
                  placeholder="Re-enter password"
                  onBlur={validatePassword}
                  type="text"/>
                     {confirmPasswordError && <div style={{ color: 'red' }}>{confirmPasswordError}</div>}
              
            </div>
            
          </div>
          <div className={styles['buttons']}>
            <span className={styles['next']}>Save </span>
            <div className={styles['arrow']} />
          </div>
          <div className={styles['frame-21']}>
            <span className={styles['edit-profile']}>Edit Profile</span>
          </div>
          <div className={styles['frame-22']}>
            <div className={styles['frame-23']}>
              <span className={styles['name-24']}>Last Name</span>
            </div>
            <div className={styles['frame-25']}>
              <input className={styles["input"]} 
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your Last Name" type="text" />
            </div>
          </div>
          <div className={styles['frame-28']}>
            <div className={styles['frame-29']}>
              <span className={styles['first-name']}>First Name</span>
            </div>
            <input className={styles['frame-2a']}
                  type='text'
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your First Name" 
              
            />
          </div>
        </div>
        <div className={styles['buttons-2c']} >
          <button className={styles['frame-2d']} onClick ={handleSubmit} >
            <div className={styles['frame-2e']}>
              <div className={styles['frame-2f']} />
            </div>
          </button>
          <span className={styles['save-changes']} onClick ={handleSubmit}>Save Changes</span>
        </div>
      </div>

      {/* SIDE MENU OPTIONS: */}
      <span className={styles['edit-profile-30']}>Edit Profile</span>
      <div className={styles['edit']}  />
      <span className={styles['edit-payment-method']} onClick={editpayment} >Edit Payment Method</span>
      <div className={styles['edit-31']}/>
      <span className={styles['edit-saved-preferences']} onClick={editsavedpreference}>Edit Saved Preferences</span>
      <div className={styles['edit-32']} />
    </div>
  );
}


