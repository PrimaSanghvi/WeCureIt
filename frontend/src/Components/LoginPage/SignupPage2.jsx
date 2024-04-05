import React, {useState} from 'react';
//import './SignupPage2.css';
import  styles from './SignupPage2.module.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

export default function Main() {
    const [card_number, setCardNumber] = useState('');
    const [card_holder_name, setCardholderName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [cvv, setCVV] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    // const [expDateError, setExpDateError] = useState('');
    const[cardNumError, setCardNumError] = useState('');
    // const validateExpDat = () =>
    // {
    //     setExpMonth(expMonth.trim());
    //  const   expYear_new = expYear.trim();

    //     if (expYear_new.length === 4) {
    //         setExpYear(expYear.substring(2))
    //     }

    //     const expMonth_new = parseInt(expMonth, 10);
    //     if (expMonth_new < 1 || expMonth_new > 12) {
    //         setExpDateError("Invalid expiry month.");
    //         return false;
    //     }
    //     else{
    //         setExpDateError("")
    //     }
    // return true
    // }

    const validateCardNumber = () =>
    {
       const card_number_1 = card_number.replace(/\s+/g, ''); // Remove spaces if any
        if (card_number_1.length > 16 || card_number_1.length  < 8) {
            setCardNumError("Card number must not exceed 16 digits.");
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle the form submission, such as sending the data to your backend
        
        const formData = location.state.formData;

        const expiry_date  = expMonth + "/" + expYear;
        

       
        const cardDetails = {
            card_number,
            card_holder_name,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            cvv,
            expiry_date,
        };

        if(Object.keys(formData).length !== 0)
        {
            console.log(JSON.stringify(formData))
        axios.post('http://127.0.0.1:8000/api/patientRegister/', formData)
        .then(response => {
            console.log('Form submitted successfully!', response.data);
            const patientId = response.data.patient_id;
            cardDetails.patient_id = patientId; 
 
               return axios.post('http://127.0.0.1:8000/api/patientCardDetails/', cardDetails);
                
            })
            .then(response => {
                console.log('Credit card form submitted successfully!', response.data);
                // Handle any post-submission logic here, like redirecting to another page
                navigate('/', { state: { message: 'Account created Successfully! Please Login to the system.' } });
            })
        .catch(error => {
            console.error('Error submitting form:', error);
        });
    }
    };

    return (
 <div className={styles['main-container']}>
    <div className={styles['group']}>
        <div className={styles['section']} />
        <div className={styles['box']}>
            <div className={styles['section-2']}>
                <span className={styles['text']}>WeCureIt</span>
                <div className={styles['section-3']}>
                    <div className={styles['group-2']}>
                        <div className={styles['img']} />
                    </div>
                </div>
            </div>
            <div className={styles['wrapper']}>
                <div className={styles['section-4']}>
                    <div className={styles['box-2']}>
                        <span className={styles['text-2']}>Login / Sign-Up</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <form onSubmit={handleSubmit}>
        <div className={styles['section-5']}>
            <div className={styles['img-2']} />
            <div className={styles['group-3']}>
                <div className={styles['box-3']}>
                    <div className={styles['box-4']}>
                    {/* {expDateError && <div style={{ color: 'red' }}>{expDateError}</div>} */}
                        <span className={styles['text-3']}>
                            Enter the Following to Create Your Account
                        </span>
                        <span className={styles['text-4']}>Add Payment Method</span>
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
                                    onBlur={validateCardNumber}
                                />
                                 {cardNumError && <div style={{ color: 'red' }}>{cardNumError}</div>}
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
                                    value={card_holder_name}
                                    onChange={(e) => setCardholderName(e.target.value)}
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
                        </div>
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
                    </div>
                    <div className={styles['box-8']}>
                        <div className={styles['wrapper-c']}>
                            <div className={styles['section-b']}>
                                <div className={styles['box-9']} />
                            </div>
                        </div>
                        <button type="submit">
                            <label className={styles['text-12']}>Create an Account</label>
                        </button>
                    </div>
                    <div className={styles['group-9']}>
                        <div className={styles['box-a']}>
                            <span className={styles['text-13']}>Have an Account</span>
                            <span className={styles['text-14']}>? </span>
                            <span className={styles['text-15']}>Login</span>
                        </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </form>
        </div>
    );
    
}