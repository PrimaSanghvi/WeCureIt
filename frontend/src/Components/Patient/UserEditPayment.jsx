import React, { useEffect, useState } from "react";
import styles from './UserEditPayment.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import clickedEditSVG from '../../../src/assets/edit.svg';
import unclickedEditSVG from '../../../src/assets/edit-1.svg'

export const UserEditPayment = () => {
  const { patientId } = useParams();

  // Data from DB
  const [card_number, setCardNumber] = useState('');
  const [card_holder_name, setCardHolderName] = useState('');
  const [cvv, setCVV] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');

  // Edge Case:
  const [cardNumberError, setCardNumberError] = useState('');
  const [cvvError, setCVVError] = useState('');
  const [expError, setExpError] = useState('');
  const [cardHolderNameError, setCardHolderNameError] = useState('');
  const [addressLine1Error, setAddressLine1Error] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [zipError, setZipError] = useState('');

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

    // SAVE CHANGES BUTTON:
    const handleSubmit = (e) => {
        e.preventDefault();

        // Edge case testing:
        if (!card_number) {
            setCardNumberError("Please insert a card number");
            return;
        } else {
            setCardNumberError("");
        }

        if (!cvv) {
            setCVVError("Please insert a valid cvv");
            return;
        } else {
            if (cvv.toString().length != 3) {
                setCVVError("Please insert a valid cvv");
                return;
            }
            setCVVError("");
        }

        if ((!expMonth) || (expMonth && !expYear) || (!expMonth && expYear)) {
            setExpError("Please insert a valid expiration month & year");
            return;
        } else {
            if ((expMonth > 12) || (expMonth < 1) || (expYear <= 23)) {
                setExpError("Please insert a valid expiration month & year");
                return;
            }
            setExpError("");
        }

        if (!card_holder_name) {
            setCardHolderNameError("Please insert a cardholder name");
            return;
        } else {
            setCardHolderNameError("")
        }

        if (!addressLine1) {
            setAddressLine1Error("Please insert an address");
            return;
        } else {
            setAddressLine1Error("");
        }

        if (!city) {
            setCityError("Please insert a city");
            return;
        } else {
            setCityError("");
        }

        if (!state) {
            setStateError("Please insert a state");
            return;
        } else {
            let regex = /^[a-zA-Z]+$/;

            if (!(regex.test(state))) {
                setStateError("Please insert a state");
                return;
            }
            setStateError("");
        }

        if (!zipCode) {
            setZipError("Please insert a valid Zip-Code")
            return;
        } else {
            if (zipCode.toString().length != 5) {
                setZipError("Please insert a valid Zip-Code")
                return;
            }
            setZipError("")
        }
    
        // Submitting update:
        const expiry_date = expMonth + "/" + expYear;

        const cardDetails = {
            card_number,
            card_holder_name,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            cvv,
            expiry_date
        };

        console.log(cardDetails);
        axios.patch(`http://127.0.0.1:8000/api/patientCardDetails/${patientId}/`, cardDetails)
        .then(response => {
            console.log('Form submitted successfully!', response.data);
        })
        .catch (error => {
            console.error('Error submitting form:', error);
        });
    }

    // Get Patient's Information:
    useEffect (() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/patientPayment/${patientId}`);
                
                if (response.status === 200) {
                    const data = response.data;

                    // Set the state, checking for null values and providing defaults as necessary:
                    console.log(data)
                    setCardHolderName(data.card_holder_name);
                    setCardNumber(data.card_number);
                    setCVV(data.cvv);
                    setAddressLine1(data.addressLine1);
                    setAddressLine2(data.addressLine2);
                    setCity(data.city);
                    setState(data.state);
                    setZipCode(data.zipCode);

                    var expSplit = data.expiry_date;
                    var parts = expSplit.split("/");
                    setExpMonth(parts[0]);
                    setExpYear(parts[1]);
                } else {
                    console.error("Error fetching data:", response.status);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUserData();
    }, [patientId]);

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
                                    value={card_number}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder='Enter Card Number'
                                />
                            </div>
                            {cardNumberError && <div style={{ color: 'red' }}>{cardNumberError}</div>}
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
                                    value={card_holder_name}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    placeholder='Enter Cardholder Name'
                                />
                            </div>
                            {cardHolderNameError && <div style={{ color: 'red' }}>{cardHolderNameError}</div>}
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
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    placeholder='Enter Address Line 1'
                                />
                            </div>
                        </div>
                        <div className={styles['inputfield']}>
                            <div>
                                <input
                                    className={styles['section-8-1']}
                                    type='text'
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    placeholder='Enter Address Line 2'
                                />
                            </div>
                            {addressLine1Error && <div style={{ color: 'red' }}>{addressLine1Error}</div>}
                        </div>
                        <div style={{marginTop: '75px'}}>
                            <div className={styles['group-7']}>
                                <span className={styles['text-c']}>City</span>
                            </div>
                            <div className={styles['cityname']}>
                                <div>
                                    <input
                                        className={styles['box-6']}
                                        type='text'
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder='City'
                                    />
                                </div>
                            </div>
                            {cityError && <div style={{ color: 'red'}}>{cityError}</div>}
                        </div>
                        <div style={{paddingLeft: '145px'}}>
                            <div className={styles['wrapper-8']}>
                                <span className={styles['text-e']}>State</span>
                            </div>
                            <div className={styles['statename']}>
                                <div>
                                    <input
                                        className={styles['section-a']}
                                        type='text'
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder='State'
                                    />
                                </div>
                            </div>
                            {stateError && <div style={{ color: 'red'}}>{stateError}</div>}
                        </div>
                        <div style={{paddingLeft: '295px'}}>
                            <div className={styles['wrapper-a']}>
                                <span className={styles['text-10']}>Zip-Code</span>
                            </div>
                            <div className={styles['zipcode']}>
                                <div>
                                    <input
                                        className={styles['wrapper-b']}
                                        type='number'
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        placeholder='Zipcode'
                                    />
                                </div>
                            </div>
                            {zipError && <div style={{ color: 'red' }}>{zipError}</div>}
                        </div>
                    </div>
                    <div className={styles['box-8']}>
                      <button className={styles['wrapper-c']} onClick={handleSubmit} >
                        <div className={styles['section-b']}>
                            <span className={styles['text-12']}>Save Changes</span>
                        </div>
                      </button>
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
                                    value={cvv}
                                    onChange={(e) => setCVV(e.target.value)}
                                    placeholder='CVV'
                                />
                            </div>
                            {cvvError && <div style={{ color: 'red' }}>{cvvError}</div>}
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
                                        value={expMonth}
                                        onChange={(e) => setExpMonth(e.target.value)}
                                        placeholder='mm'
                                    />
                                    </div>
                                </div>
                                <div className={styles['year']}>
                                    <div>
                                    <input
                                        className={styles['section-f']}
                                        type='number'
                                        value={expYear}
                                        onChange={(e) => setExpYear(e.target.value)}
                                        placeholder='yy'
                                    />
                                    </div>
                                </div>
                            </div>
                            {expError && <div style={{ color: 'red', width: '165px'}}>{expError}</div>}
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
