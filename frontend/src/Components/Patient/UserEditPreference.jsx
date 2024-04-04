import React from "react";
import styles from './UserEditPreference.module.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import clickedEditSVG from '../../../src/assets/edit.svg';
import unclickedEditSVG from '../../../src/assets/edit-1.svg'

export const UserEditPreference = () => {
  const { patientId } = useParams();

  const [doctorPreference, setDoctorPreference] = React.useState('selectedDoctor');
  const [facilityPreference, setFacilityPreference] = React.useState('selectedFacility');

  const handleClick = () => {
    //change the address to the actual homepage or login page to redirect
    window.location.href =`/patientHomepage/${patientId}`;
  };

  const handleSubmit = () => {
    console.log("save changes button clicked!")
  }

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
                    <select value={doctorPreference} onChange={(event) => setDoctorPreference(event.target.value)}>
                        <option value={'selectedDoctor'}>Dr. Bernard Webb</option>
                        <option value={'availableDoctor'}>TEMP</option>
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
                    <select value={facilityPreference} onChange={(event) => setFacilityPreference(event.target.value)}>
                        <option value={'selectedFacility'}>The George Washington University</option>
                        <option value={'availableDoctor'}>TEMP</option>
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
