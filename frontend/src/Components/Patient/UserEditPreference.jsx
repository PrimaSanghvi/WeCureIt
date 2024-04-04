import React, { useEffect, useState } from 'react';
import styles from './UserEditPreference.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import clickedEditSVG from '../../../src/assets/edit.svg';
import unclickedEditSVG from '../../../src/assets/edit-1.svg'

export const UserEditPreference = () => {
  const { patientId } = useParams();

  const [doctor_pref, setDoctorPreference] = useState(null);
  const [facility_pref, setFacilityPreference] = useState(null);
  const [doctor_options, setDoctorOptions] = useState([]);
  const [facility_options, setFacilityOptions] = useState([]);

  // SET-UP DROPDOWN MENU:
  useEffect (() => {
    // Retrieve preferences:
    const fetchUserPreference = async () => {
      try {
        const responsePreference = await axios.get(`http://127.0.0.1:8000/api/patientPreferenceDetail/${patientId}`);

        if (responsePreference.status === 200) {
          const preferenceData = responsePreference.data;

          if (preferenceData.doctor_pref == null) {
            console.log("preference doctor is null")
            // setDoctorPreference("No Preference")
          } else {
            setDoctorPreference(preferenceData.doctor_pref)
          }

          if (preferenceData.facility_pref == null) {
            console.log("prefernece facility is null")
            setFacilityPreference("No Preference")
          } else {
            setFacilityPreference(preferenceData.facility_pref)
            console.log(facility_pref)
          }
        } else {
          console.error("Failed to fetch data with status:", responsePreference.status);
        }
      } catch (error) {
        console.error("Error fetching user preference:", error)
      }
    };

    // Retrieve all available doctors:
    const fetchAvailableDoctors = async () => {
      try {
        const responseDoctors = await axios.get(`http://127.0.0.1:8000/api/allDoctorDetail/`);
        if (responseDoctors.status === 200) {
          setDoctorOptions(responseDoctors.data)
        } else {
          console.error("Failed to fetch data with status:", responseDoctors.status);
        }
      } catch (error) {
        console.error("Error fetching available doctors:", error)
      }
    };

    // Retrieve all available facilities:
    const fetchAvailableFacility = async () => {
      try {
        const responseFacility = await axios.get(`http://127.0.0.1:8000/api/allFacilityDetail/`);
        if (responseFacility.status === 200) {
          setFacilityOptions(responseFacility.data)
        } else {
          console.error("Failed to fetch data with status:", responseFacility.status);
        }
      } catch (error) {
        console.error("Error fetching available facility:", error)
      }
    };

    fetchAvailableDoctors();
    fetchAvailableFacility();
    fetchUserPreference();
  }, [doctor_pref, facility_pref, patientId]);

  // HOMEPAGE BUTTON:
  const handleClick = () => {
    //change the address to the actual homepage or login page to redirect
    window.location.href =`/patientHomepage/${patientId}`;
  };

  // SAVE CHANGES BUTTON:
  const handleSubmit = () => {
    console.log("save changes button clicked!")

    const formData = {
      doctor_pref,
      facility_pref
    };

    console.log(formData)
    axios.patch(`http://127.0.0.1:8000/api/patientPreference/${patientId}/`, formData)
    .then(response => {
      console.log('Form submitted successfully!', response.data);
    })
    .catch(error => {
      console.error('Error submitting form:', error);
    });
  }

  // SIDE MENU CLICKED:
  const editprofile = () => {
    // change the code to redirect to edit profile page
    window.location.href = `/editProfile/${patientId}`;
    console.log("transfer to edit profile")
  }

  const editpayment = () => {
    //change the code to the real page of edit payment 
    window.location.href = "/editpayment";
    console.log("transfer to edit payment")
  };

  const editsavedpreference = () =>{
    //change the code to redirect to the real page of edit saved preference
    window.location.href = `/editPreference/${patientId}`;
    console.log("transfer to edit preference")
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
        <div  className={styles['create-appointment-button']}>
          <button  className={styles['create-appointment-btn']} onClick={handleClick}>
            <div  className={styles['frame-1']}>
              <span  className={styles['create-new-appointment']}>
                  HomePage           
              </span>
            </div>
          </button>
        </div>
        <div  className={styles['profile']}>
          <div className={styles['dropdown']}>
            <FontAwesomeIcon icon={faUserCircle} size="3x"/>
          <div className={styles['dropdown-content']}>
            <a href="/">Logout</a>
          </div>
          </div>
        </div>
        </div>
      </div>

      {/* EDIT SAVED PREFERENCE: */}
      <div className={styles['user-edit-preference']}>
        <div className={styles['group-2']}>
          <div className={styles['edit-preference']}>
            <div className={styles['group']}>
              <div className={styles['frame-3']}>
                <div className={styles['text-wrapper-7']}>Edit Saved Preferences</div>
              </div>
              <div className={styles['frame-4']}>
                <div className={styles['frame-5']}>
                  <div className={styles['text-wrapper-8']}>Preferred Doctor</div>
                </div>
                <div className={styles['frame-6']}>
                  <div className={styles['frame-7']}>
                    <select value={doctor_pref}>
                      {doctor_options.map(doc => (
                        <option key={doc.doctor_id} value={doc.doctor_id}>Dr. {doc.first_name} {doc.last_name}</option>
                      ))}
                      <option>No Preference</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles['frame-8']}>
                <div className={styles['frame-9']}>
                  <div className={styles['text-wrapper-8']}>Preferred Facility</div>
                </div>
                <div className={styles['frame-10']}>
                  <div className={styles['frame-11']}>
                    <select value={facility_pref}>
                      {facility_options.map(fac => (
                        <option key={fac.name} value={fac.name}>{fac.name}</option>
                      ))}
                      <option>No Preference</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['buttons-2c']} >
          <button className={styles['frame-2d']} onClick ={handleSubmit} >
            <div className={styles['frame-2e']}>
              <span className={styles['save-changes']}>Save Changes</span>
            </div>
          </button>
          {/* <span className={styles['save-changes']} onClick ={handleSubmit}>Save Changes</span> */}
        </div>
      </div>

      {/* SIDE MENU OPTIONS */}
      <span className={styles['edit-profile-30']} onClick={editprofile}>Edit Profile</span>
      <img className={styles['edit']} alt = "Edit" src = {unclickedEditSVG}/>
      <span className={styles['edit-payment-method']} onClick={editpayment} >Edit Payment Method</span>
      <img className={styles['edit-31']} alt = "Edit" src = {unclickedEditSVG}/>
      <span className={styles['edit-saved-preferences']} onClick={editsavedpreference}>Edit Saved Preferences</span>
      <img className={styles['edit-32']} alt = "Edit" src = {clickedEditSVG}/>
    </div>
  );
};
