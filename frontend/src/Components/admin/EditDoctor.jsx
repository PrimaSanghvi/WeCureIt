import React from "react";
import styles from"./EditDoctor.module.css";
import { useState } from 'react';

export default function Main() {


  const specialtylist=[
    {
      "speciality_id": 1,
      "name": "Cardiology"
    },
    {
      "speciality_id": 2,
      "name": "Pediatrics"
    },{
      "speciality_id": 3,
      "name": "Psychiatry"
    },{
      "speciality_id": 4,
      "name": "Internal Medicine"
    },{
      "speciality_id": 5,
      "name": "Obstetrics and Gynecology"
    },
  ]


  const [first_name, setFirstName] = useState('Fern');
  const [last_name, setLastName] = useState('Moyes');
  const [email, setemail] = useState('Fern.Moyer@gmail.com');
  const [selectedspeciality,setseletedspeciality] = useState("");
  const [displayedSpeciality, setDisplayedSpeciality] = useState(["Cardiology","Pediatrics"]);
  const [removespeciality,setremovespeciality] = useState('')

  const handleDisplay = () => {

    if(selectedspeciality&& !displayedSpeciality.includes(selectedspeciality)){
      setDisplayedSpeciality([...displayedSpeciality, selectedspeciality]);
      setseletedspeciality("");
    }
    else if(!selectedspeciality){
      alert('Please select a speciality first.');
    }
    else{
      alert('this speciality is already in the list')
    }
  };

  const handleRemove = () =>{
    if (removespeciality) {
      setDisplayedSpeciality(displayedSpeciality.filter(item => item !== removespeciality));
      setremovespeciality(''); // Clear selected item
    }
  };

  const transferaddfacility= ()=>{
    //change to the real edit facility path
    window.location.href = "/editfacilities";
    console.log("transfer to edit facilities")
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
// Here you can handle the form submission, such as sending the data to your backend
    console.log("Form submitted!");
    console.log("First Name:", first_name);
    console.log("Last Name:", last_name);
    console.log("Email:", email);
    console.log("specialities:",displayedSpeciality)
    
  };

  return (
    <div className={styles["main-container"]}>
      <div className={styles["top-bar"]}>
        <div className={styles["top-bar-background"]}></div>
        <div className={styles["frame"]}>
          <div className={styles["company-name-icon"]}>
            <span className={styles["we-cure-it"]}>WeCureIt</span>
            <div className={styles["medical-cross"]}>
              <div className={styles["group"]}>
                <div className={styles["vector-stroke"]}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["frame-1"]}>
        <div className={styles["frame-2"]}>
          <span className={styles["specialty-available"]}>Specialty Available</span>
        </div>
        <div className={styles["frame-3"]}>
          <div className={styles["select-specialty"]}>
            <div className={styles["group-4"]}>
              <span className={styles["select-specialty-5"]}>Select Specialty</span>
              <div className={styles["rectangle"]}></div>
            </div>
            <div className={styles["group-6"]}></div>
            <div className={styles["frame-7"]}>
              <div className={styles["group-8"]}>
                <div className={styles["group-9"]}>
                {specialtylist.map((speciality,index)=>{
                  return(
                    <div className={styles["cardiology"]} onClick={() => setseletedspeciality(speciality.name)} >
                      {speciality.name}
                    </div>
                      );
                    })} 
                </div>
              </div>
            </div>
          </div>
          <div className={styles["frame-a"]}>
            <div className={styles["button"]}>
              <div className={styles["button-b"]}>
                <div className={styles["rectangle-d"]} onClick={handleDisplay}></div>
              </div>
            </div>
            <div className={styles["button-e"]}>
              <div className={styles["button-f"]}>
                <div className={styles["rectangle-11"]} onClick={handleRemove}></div>
              </div>
            </div>
          </div>
          <div className={styles["selected-specialty"]}>
            <div className={styles["group-12"]}>
              <span className={styles["selected-specialty-13"]}>Selected Specialty</span>
              <div className={styles["rectangle-14"]}></div>
            </div>
            <div className={styles["group-15"]}></div>
            <div className={styles["frame-16"]}>
              <div className={styles["group-17"]}>
                <div className={styles["group-18"]}>
                {displayedSpeciality.map((speciality, index) => (
                      <div className={styles["cardiology-19"]}key={index} onClick={()=>setremovespeciality(speciality)}>
                        {speciality}
                      </div>
                    ))}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className={styles["edit-doctors-information"]}>
        Edit Doctor’s Information
      </span>
      <span className={styles["add-manage-doctor"]}>Add/Manage Doctor</span>
      <div className={styles["edit"]}></div>
      <div className={styles["frame-1b"]}>
        <div className={styles["frame-1c"]}>
          <span className={styles["last-name"]}>Last Name</span>
        </div>
        
        <input className={styles["frame-1d"]} placeholder = {last_name}
         type="text" value ={last_name} onChange={(e)=>setLastName(e.target.value)}
        />
        
      </div>
      <div className={styles["frame-1f"]}>
        <div className={styles["frame-20"]}>
          <span className={styles["first-name"]}>First Name</span>
        </div>
        <input className={styles["frame-21"]}placeholder = {first_name}
         type="text" value ={first_name} onChange={(e)=>setFirstName(e.target.value)}
        />
      </div>
      <span className={styles["add-manage-facility"]} onClick={transferaddfacility}>Add/Manage Facility</span>
      <div className={styles["edit-23"]}></div>
      <div className={styles["frame-24"]}>
        <div className={styles["frame-25"]}>
          <span className={styles["email-address"]}>Email address</span>
        </div>
        
        <input className={styles["frame-26"]} placeholder = {email}
         type="text" value ={email} onChange={(e)=>setemail(e.target.value)}
        />
        
      </div>
      <button className={styles["frame-28"]} onClick={handleSubmit}>
        <div className={styles["frame-29"]}>
          <div className={styles["frame-2a"]}></div>
        </div>
      </button>
      <span className={styles["save-changes"]}>Save Changes</span>
    </div>
  );
}
