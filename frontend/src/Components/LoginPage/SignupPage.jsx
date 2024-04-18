import React, { useEffect, useState } from 'react';
import styles from './SignupPage.module.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios, { all } from 'axios';

export default function SignupPage() {
  const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenteredPassword, setReenteredPassword] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confrimPasswordError, setconfrimPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      first_name: '',
      last_name: '',
    });
    const [allFilled, setAllFilled] = useState(false);

    const validateEmail = () => {
      if (!email.trim()) {
        setEmailError("Email address is required.");
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    };

    const validateAddress = () => {
      let errors = {};
      if (!addressLine1.trim()) errors.addressLine1 = "Street Address is required.";
      // AddressLine2 is optional
      setFormErrors(errors); // Assuming you have a state to handle form-wide errors
      return Object.keys(errors).length === 0;
    };
    
    const validateCity = () => 
    {
      let errors = {};
      if (!city.trim()) errors.city = "City is required.";
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    }

    const validateState = () =>
    {
      let errors = {};
      if (!state.trim()) errors.state = "State is required.";
      setFormErrors(errors); // Assuming you have a state to handle form-wide errors
      return Object.keys(errors).length === 0;
    }

    const validateZipcode = () =>
    {
      let errors = {};
      if (!zipCode.trim()) {
        errors.zipCode = "Zip-Code is required.";
      } else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
        errors.zipCode = "Invalid Zip-Code format.";
      }
    
      setFormErrors(errors); // Assuming you have a state to handle form-wide errors
      return Object.keys(errors).length === 0;
    }

  useEffect(() => {
    const handleAllFilled = () => {
      if ((emailError == "") && (passwordError == "") && (confrimPasswordError == "")) {
        if (first_name && last_name) {
          if (addressLine1 && city && state && zipCode && phone_number) {
            setAllFilled(true);
          } else {
            setAllFilled(false);
          }
        } else {
          setAllFilled(false);
        }
      } else {
        setAllFilled(false);
      }
    };

    handleAllFilled();
  }, [passwordError, confrimPasswordError, emailError, formErrors]);

    const validatePassword = () => {
      console.log(reenteredPassword);
      if (!password) {
        setPasswordError("Password is required.");
      } else {
        setPasswordError("");
      }
      if (!reenteredPassword) {
        setconfrimPasswordError("Re-entering the password is required.");
      } else {
        setconfrimPasswordError("");
      }
      
      if (password && reenteredPassword) {
        if (password !== reenteredPassword) {
          setconfrimPasswordError("Passwords do not match.");
        } else {
          setPasswordError("");
          setconfrimPasswordError("");
        }
      }

    };
  
    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure that email is unique:
        console.log(email);

        const payload = {
          email: email.toUpperCase(),
          validEmail: false
        };

        // Get all emails to see if the patient can use the email:
        axios.post(`http://127.0.0.1:8000/api/allEmails/`, payload)
        .then(response => {
          console.log('Response data:', response.data);

          // Email taken:
          if (response.data["validEmail"]) {
            setEmailError("Email is already taken! Please login or use a different email.")
          } else {
            const formData = {
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
        
          navigate('/creditCardDetails', { state: {formData}});
          }
        })
        .catch(error => {
          console.error('Error retrieving all emails:', error);
        });
    };
    
    return (
<div className={styles['main-container']}>
  <form onSubmit={handleSubmit}>
    <div className={styles.wrapper}>
      <div className={styles.section} />
      <div className={styles.box}>
        <div className={styles['wrapper-2']}>
          <span className={styles.text}>WeCureIt</span>
          <div className={styles['section-2']}>
            <div className={styles['box-2']}>
              <div className={styles.pic} />
            </div>
          </div>
        </div>
        <div className={styles['box-3']}>
          <div className={styles['box-4']}>
            <div className={styles['wrapper-3']}>
              <span className={styles['text-2']}>Login / Sign-Up</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.group}>
      <div className={styles['pic-2']} />
      <div className={styles['wrapper-4']}>
        <div className={styles['section-3']}>
          <div className={styles['box-5']}>
            <div className={styles['wrapper-5']}>
              <span className={styles['text-3']}>Address</span>
            </div>
            <div>
              <input
                className={styles['box-b']}
                type='text'
                value={addressLine1}
                placeholder='Street Address'
                onChange={(e) => setAddressLine1(e.target.value)}
                onBlur = {validateAddress}
              />
              {formErrors.addressLine1 && <div style={{ color: 'red' }}>{formErrors.addressLine1}</div>}
            </div>
            <div>
              <input
                className={styles['box-b1']}
                type='text'
                value={addressLine2}
                placeholder='Apt/Unit Number'
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>
            <div className={styles['box-6']}>
              <span className={styles['text-6']}>City</span>
            </div>
            <div>
              <input
                className={styles['section-5']}
                type='text'
                value={city}
                placeholder='City'
                onChange={(e) => setCity(e.target.value)}
                onBlur = {validateCity}
              />
               {formErrors.city && <div style={{ color: 'red' }}>{formErrors.city}</div>}
            </div>
            <div className={styles['section-6']}>
              <span className={styles['text-8']}>State</span>
            </div>
            <div>
              <input
                className={styles['box-8']}
                type='text'
                value={state}
                placeholder='State'
                onChange={(e) => setState(e.target.value)}
                onBlur = {validateState}
              />
              {formErrors.state && <div style={{ color: 'red' }}>{formErrors.state}</div>}
            </div>
            <div className={styles['group-4']}>
              <span className={styles['text-a']}>Zip-Code</span>
            </div>
            <div>
              <input
                className={styles['box-9']}
                type='number'
                value={zipCode}
                placeholder='Zipcode'
                onChange={(e) => setZipCode(e.target.value)}
                onBlur = {validateZipcode}
              />
              {formErrors.zipCode && <div style={{ color: 'red' }}>{formErrors.zipCode}</div>}
            </div>
          </div>
          <div className={styles['box-a']}>
          <div className={styles['wrapper-51']}>
                                <span className={styles['text-3']}>Contact Number</span>
                            </div>
                            <div>
                                <div>
                                <input 
                                className={styles['box-b']}
                                type='number'
                                value={phone_number}
                                placeholder='Contact Number'
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                </div>
                            </div>
            <div className={styles['wrapper-8']}>
              <span className={styles['text-c']}>Email address</span>
            </div>
            <div className={styles.inputemail}>
              <input
                className={styles['box-b']}
                type='email'
                value={email}
                placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value ? e.target.value.toUpperCase() : '')}
                onBlur={validateEmail} 
                required
              />
              {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
            </div>
          </div>
          <div className={styles['group-5']}>
            <div className={styles['section-8']}>
              <span className={styles['text-e']}>Create a Password</span>
            </div>
            <div className={styles.newpassword}>
              <input
                className={styles['box-b']}
                type='password'
                value={password}
                placeholder='Create a new password'
                onChange={(e) => setPassword(e.target.value)}
                onBlur = {validatePassword}
                required
              />
              {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
            </div>
          </div>
          <div className={styles['section-9']}>
            <div className={styles['section-a']}>
              <span className={styles['text-10']}>Re-enter a Password</span>
            </div>
            <div className={styles.reenterpassword}>
              <input
                className={styles['box-b']}
                type='password'
                value={reenteredPassword}
                placeholder='Re-enter a password'
                onChange={(e) => setReenteredPassword(e.target.value)}
                onBlur={validatePassword}
                required
              />
               {confrimPasswordError && <div style={{ color: 'red' }}>{confrimPasswordError}</div>}
            </div>
          </div>
          {/* Change 'Next' depending on if all components are filled: */}
          {allFilled ? (
            <div className={styles['section-b']}>
              <div className={styles['group-9']}>
                  <button className={styles['box-d']} onClick={handleSubmit} disabled={!allFilled}>
                    <label className={styles['text-12']}>Next</label>
                  </button>
              </div>
            </div>
          ) : (
            <div className={styles['section-b']}>
              <div className={styles['group-9']}>
                  <button className={styles['box-d2']} onClick={handleSubmit} disabled={!allFilled}>
                    <label className={styles['text-12']}>Next</label>
                  </button>
              </div>
            </div>
          )}
          <div className={styles['section-d']}>
            <div className={styles['box-e']}>
              <span className={styles['text-13']}>Have an Account</span>
              <span className={styles['text-14']}>? </span>
              <Link to="/">Login</Link>
            </div>
          </div>
          <div className={styles['box-f']}>
            <span className={styles['text-16']}>
              Enter the Following to Create Your Account
            </span>
            <span className={styles['text-17']}>Get Started Now</span>
          </div>
          <div className={styles['box-10']}>
            <div className={styles['box-11']}>
              <span className={styles['text-18']}>Last Name</span>
            </div>
            <div>
              <input
                className={styles['box-12']}
                type='text'
                value={last_name}
                placeholder='Enter your first name'
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles['wrapper-a']}>
            <div className={styles['section-e']}>
              <span className={styles['text-1a']}>First Name</span>
            </div>
            <div>
              <input
                className={styles['box-14']}
                type='text'
                value={first_name}
                placeholder='Enter your first name'
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</div>
    );
}
