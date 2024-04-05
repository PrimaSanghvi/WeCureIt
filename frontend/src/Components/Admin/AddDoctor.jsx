import React, { useState,   useEffect, } from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import styles from './AddDoctor.module.css';
import { useParams } from 'react-router-dom';
import axios from "axios";

function AddDoctor() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setContact] = useState('');
    const [doctorDetails, setDoctorDetails] = useState(null);
    let { doctorId } = useParams();
    const [selected, setSelected] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/editDoctors/${doctorId}`);
                const { first_name, last_name, email, phone_number, speciality } = response.data;
                console.log(phone_number)
                setFirstName(first_name);
                setLastName(last_name);
                setEmail(email);
                setContact(phone_number);
                const specialityOptions = speciality.map(spec => ({
                    value: spec, // Assuming 'spec' is a string that can be used as a value
                    label: spec, // The label is the same string
                }));
                
                // Set options for DualListBox
                setOptions(specialityOptions);
                // Also preselect all since all options are assigned to the doctor
                setSelected(speciality); //
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };

        fetchDoctorDetails();
    }, [doctorId]); // Re-run the effect if doctorId changes


    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle the form submission, such as sending the data to your backend
        console.log("Form submitted!");
        console.log("First Name:", first_name);
        console.log("Last Name:", last_name);
        console.log("Email:", email);
        console.log("Contact Number:", phone_number);
        const updatedDoctorInfo = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            speciality: selected, // Assuming your backend expects 'speciality' to be an array of selected values
        };
    
        try {
            // Send a PUT request to update the doctor's information
            // Replace `/api/doctors/${doctorId}` with your actual endpoint
            const response =  axios.put(`http://127.0.0.1:8000/api/editDoctors/${doctorId}`, updatedDoctorInfo);
    
            console.log("Doctor updated successfully:", response.data);
            // Here, you can also navigate the user to another page or show a success message
        } catch (error) {
            console.error("Error updating doctor:", error);
            // Here, you might want to show an error message to the user
        }
    };
   
 
    const onSubmit = (event) => {
        // Don't reload page
        event.preventDefault();
    };

    const onChange = (value) => {
        setSelected(value);
    };

  return (
   
    <div className={styles['main-container']}>
    <div className={styles.section}>
      <div className={styles.topBar}>
        <span>WeCureIT</span>
      </div>
    </div>
    <div className={styles['main-container1']}>
      <div className={styles.edit}></div>
      <span className={styles['text-1']}>Add/Manage Doctor</span><br />
      <span className={styles['text-2']}>Add/Manage Facility</span>
    </div>
    <div className={styles['main-container2']}>
      <h1 className={styles.h1}>Edit Doctor's Information</h1>
      <div className={styles.nameGroup}>
        <div className={styles.nameGroup1}>
          <span className={styles['text-3']}>First Name</span>
          <br></br>
          <input
            className={styles.firstName}
            type='text'
            value={first_name}
            placeholder='Enter First Name'
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className={styles.nameGroup2}>
          <span className={styles['text-3']}>Last Name</span>
          <br />
          <input
            className={styles.lastName}
            type='text'
            value={last_name}
            placeholder='Enter Last Name'
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className={styles['margin-top20']}>
        <span className={styles['text-3']}>Email Address</span>
        <br />
        <input
          className={styles.emailaddress}
          type='email'
          value={email}
          placeholder='Enter Email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles['margin-top20']}>
        <span className={styles['text-3']}>Contact Number</span>
        <br/>
        <input
          className={styles.contact}
          type='number'
          value={phone_number}
          placeholder='Enter Contact Number'
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <div className={styles['margin-top20']}>
        <span className={styles['text-3']}>Specialities Available</span>
        <br/>
        <div className={styles.header}>
          <span className={styles['text-3']}>Available Specialities</span>
        </div>
        <div className={styles.header2}>
          <span className={styles['text-3']}>Selected Specialities</span>
        </div>
        <div className={styles.listbox}>
        <DualListBox
            options={options} // This should be your full list of specialities
            selected={selected} // Selected values
            onChange={(newSelected) => setSelected(newSelected)}
/>
        </div>
        <button type='submit' className={styles.button}>
          <label className={`${styles['text-3']} ${styles['text-white']}`} onClick={handleSubmit}>Save changes</label>
        </button>
      </div>
    </div>
    <div className={styles['main-container3']}>
      {/* Additional content can go here */}
    </div>
  </div>
  
  )
}

export default AddDoctor