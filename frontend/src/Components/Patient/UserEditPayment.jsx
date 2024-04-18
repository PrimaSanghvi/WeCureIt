import React from "react";
import styles from './UserEditPayment.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import clickedEditSVG from '../../../src/assets/edit.svg';
import unclickedEditSVG from '../../../src/assets/edit-1.svg'

export const UserEditPayment = () => {
  const { patientId } = useParams();

  // HOMEPAGE BUTTON:
  const handleClick = () => {
    //change the address to the actual homepage or login page to redirect
    window.location.href =`/patientHomepage/${patientId}`;
  };

  // SIDE MENU CLICKED:
  const editprofile = () => {
    // change the code to redirect to edit profile page
    window.location.href = `/editProfile/${patientId}`;
    console.log("transfer to edit profile")
  }

  const editpayment = () => {
    //change the code to the real page of edit payment 
    window.location.href = `/editPayment/${patientId}`;
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

      {/* Edit Payment Method Form */}
      <form>
        <div className={styles['section-5']}>
            <div className={styles['group-3']}>
                <div className={styles['box-3']}>
                    <div className={styles['box-4']}>
                        <span className={styles['text-4']}>Edit Payment Method</span>
                    </div>
                    <div className={styles['group-4']}>
                        <div className={styles['wrapper-2']}>
                            <span className={styles['text-5']}>Card Number</span>
                        </div>
                        <div className={styles['carddetails']}>
                            <div>
                                <input
                                    className={styles['box-5']}
                                    type='number'
                                    // value={card_number}
                                    // onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder='Enter Card Number'
                                    // onBlur={validateCardNumber}
                                />
                                 {/* {cardNumError && <div style={{ color: 'red' }}>{cardNumError}</div>} */}
                            </div>
                        </div>
                    </div>
                    <div className={styles['wrapper-4']}>
                        <div className={styles['wrapper-5']}>
                            <span className={styles['text-7']}>Cardholder Name</span>
                        </div>
                        <div className={styles['cardholdername']}>
                            <div>
                                <input
                                    className={styles['section-8']}
                                    type='text'
                                    // value={card_holder_name}
                                    // onChange={(e) => setCardholderName(e.target.value)}
                                    placeholder='Enter Cardholder Name'
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles['wrapper-6']}>
                        <div className={styles['section-7']}>
                            <span className={styles['text-9']}>Address</span>
                        </div>
                        <div className={styles['addressfield']}>
                            <div>
                                <input
                                    className={styles['section-8']}
                                    type='text'
                                    // value={addressLine1}
                                    // onChange={(e) => setAddressLine1(e.target.value)}
                                    placeholder='Enter Address Line 1'
                                />
                            </div>
                        </div>
                        <div className={styles['inputfield']}>
                            <div>
                                <input
                                    className={styles['section-8-1']}
                                    type='text'
                                    // value={addressLine2}
                                    // onChange={(e) => setAddressLine2(e.target.value)}
                                    placeholder='Enter Address Line 2'
                                />
                            </div>
                        </div>
                        <div className={styles['group-7']}>
                            <span className={styles['text-c']}>City</span>
                        </div>
                        <div className={styles['cityname']}>
                            <div>
                                <input
                                    className={styles['box-6']}
                                    type='text'
                                    // value={city}
                                    // onChange={(e) => setCity(e.target.value)}
                                    placeholder='City'
                                />
                            </div>
                        </div>
                        <div className={styles['wrapper-8']}>
                            <span className={styles['text-e']}>State</span>
                        </div>
                        <div className={styles['statename']}>
                            <div>
                                <input
                                    className={styles['section-a']}
                                    type='text'
                                    // value={state}
                                    // onChange={(e) => setState(e.target.value)}
                                    placeholder='State'
                                />
                            </div>
                        </div>
                        <div className={styles['wrapper-a']}>
                            <span className={styles['text-10']}>Zip-Code</span>
                        </div>
                        <div className={styles['zipcode']}>
                            <div>
                                <input
                                    className={styles['wrapper-b']}
                                    type='number'
                                    // value={zipCode}
                                    // onChange={(e) => setZipCode(e.target.value)}
                                    placeholder='Zipcode'
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles['box-8']}>
                      <button className={styles['wrapper-c']} >
                        <div className={styles['section-b']}>
                            <span className={styles['text-12']}>Save Changes</span>
                        </div>
                      </button>
                        {/* <div className={styles['wrapper-c']}>
                            <div className={styles['section-b']}>
                                <div className={styles['box-9']} />
                            </div>
                        </div>
                        <button type="submit">
                            <label className={styles['text-12']}>Save Changes</label>
                        </button> */}
                    </div>
                    <div className={styles['group-a']}>
                        <div className={styles['group-b']}>
                            <span className={styles['text-16']}>CVV</span>
                        </div>
                        <div className={styles['cvv']}>
                            <div>
                                <input
                                    className={styles['section-c']}
                                    type='number'
                                    // value={cvv}
                                    // onChange={(e) => setCVV(e.target.value)}
                                    placeholder='CVV'
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles['section-d']}>
                        <div className={styles['group-d']}>
                            <span className={styles['text-18']}>Exp Date</span>
                        </div>
                        <div className={styles['section-e']}>
                            <div className={styles['month']}>
                                <div>
                                    <input
                                        className={styles['group-e']}
                                        type='number'
                                        // value={expMonth}
                                        // onChange={(e) => setExpMonth(e.target.value)}
                                        placeholder='mm'
                                    />
                                    </div>
                                </div>
                                <div className={styles['year']}>
                                    <div>
                                    <input
                                        className={styles['section-f']}
                                        type='number'
                                        // value={expYear}
                                        // onChange={(e) => setExpYear(e.target.value)}
                                        placeholder='yy'
                                    />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p className={styles['note-credit-card']}>
                        Note: Credit card is only for reservation. At the appointment, you may pay with a different card. <br />
                        <br />
                        Any time you miss or cancel an appointment within 24 hours before your appointment, you will be charged to
                        this saved payment.
                    </p>
                </div>
            </div>
        </form>


      {/* SIDE MENU OPTIONS */}
      <span className={styles['edit-profile-30']} onClick={editprofile}>Edit Profile</span>
      <img className={styles['edit']} alt = "Edit" src = {unclickedEditSVG}/>
      <span className={styles['edit-payment-method']} onClick={editpayment} >Edit Payment Method</span>
      <img className={styles['edit-31']} alt = "Edit" src = {clickedEditSVG}/>
      <span className={styles['edit-saved-preferences']} onClick={editsavedpreference}>Edit Saved Preferences</span>
      <img className={styles['edit-32']} alt = "Edit" src = {unclickedEditSVG}/>
    </div>
  );
};
