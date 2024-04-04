
    import React from 'react';
    import { useState } from 'react';
    
    import styles from './AddDoctors.module.css';
    
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

      

      const [first_name, setFirstName] = useState('');
      const [last_name, setLastName] = useState('');
      const [email, setemail] = useState('');
      const [password , settpassword] = useState('');
      const [selectedspeciality,setseletedspeciality] = useState("");
      const [displayedSpeciality, setDisplayedSpeciality] = useState([]);
      const [removespeciality,setremovespeciality] = useState('')
      const [doctorlist, setDoctorList] = useState([
        {
          "doctor_id":1,
          "first_name":"Moyer",
          "last_name":"Fern",
          "speciality":"Cardiology",
          "isactive":true
        },
        {
          "doctor_id":2,
          "first_name":"McKnight",
          "last_name":"Tia",
          "speciality":"Psychiatry",
          "isactive":true
        },
        {
          "doctor_id":3,
          "first_name":"TJ",
          "last_name":"Tia",
          "speciality":"Psychiatry",
          "isactive":true
        },
      ]);
    
      

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

      const handleSubmit = (e) =>{
        e.preventDefault();
    // Here you can handle the form submission, such as sending the data to your backend
        console.log("Form submitted!");
        console.log("First Name:", first_name);
        console.log("Last Name:", last_name);
        console.log("Email:", email);
        console.log("specialities:",displayedSpeciality)
        
      };
      const transferfacility = () =>{
        //change to the real edit facility path
        window.location.href = "/editfacilities";
        console.log("transfer to edit facilities")
      };

      const removedoctor = (doctorToRemove) => {
        const updatedDoctorList = doctorlist.filter(doctor => doctor !== doctorToRemove);
        setDoctorList(updatedDoctorList);
      };
      const transfereditdoctor = () =>{
        window.location.href = "/editdoctors";
      }
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
          <div className={styles["line"]}></div>
          <span className={styles["manage-doctor"]}>Manage Doctor</span>
          <span className={styles["add-doctor"]}>Add Doctor</span>
          <span className={styles["add-manage-doctor"]}>Add/Manage Doctor</span>
          <div className={styles["edit"]}></div>
          <div className={styles["frame-1"]}>
            <div className={styles["frame-2"]}>
              <span className={styles["last-name"]}>Last Name</span>
            </div>
            <div className={styles["frame-3"]}>
              <div className={styles["frame-4"]}>
                <input className={styles["enter-last-name"]} type = "text" value = {last_name}
                 placeholder='Enter your lastname '
                 onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={styles["frame-5"]}>
            <div className={styles["frame-6"]}>
              <span className={styles["first-name"]}>First Name</span>
            </div>
            <button className={styles["frame-7"]}>
              <div className={styles["frame-8"]}>
                <input className={styles["enter-first-name"]}placeholder = "Enter your FirstName"
                type="text" value ={first_name} onChange={(e)=>setFirstName(e.target.value)}/>
              </div>
            </button>
          </div>
          <div className={styles["full-table"]}>
            <div className={styles["table"]}>
              <div className={styles["header"]}>
                <div className={styles["cell"]}>
                  <div className={styles["row-cell"]}>
                    <div className={styles["doctor-icon"]}>
                      <div className={styles["vector"]}></div>
                      <div className={styles["vector-9"]}></div>
                    </div>
                    <div className={styles["text"]}>
                      <span className={styles["primary-text"]}>Doctor</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-a"]}>
                  <div className={styles["row-cell-b"]}>
                    <div className={styles["file-note-edit"]}>
                      <div className={styles["vector-c"]}></div>
                    </div>
                    <div className={styles["text-d"]}>
                      <span className={styles["edit-information"]}>Edit Information</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-e"]}>
                  <div className={styles["row-cell-f"]}>
                    <div className={styles["interface-check-circle"]}>
                      <div className={styles["icon-frame"]}></div>
                    </div>
                    <div className={styles["text-10"]}>
                      <span className={styles["primary-text-11"]}>Remove</span>
                    </div>
                  </div>
                </div>
              </div>
              {doctorlist.map((doctor,index)=>{
                const backgroundColors = ['white', '#eeeeff']; // Add more colors as needed

                // Select a background color based on the index
                const backgroundColor = backgroundColors[index % backgroundColors.length];
                  return(
                    <><div  className={styles["row"]} style={{backgroundColor: backgroundColor}}>
                    <div className={styles["cell-12"]}>
                      <div className={styles["row-cell-13"]}>
                        <div className={styles["text-14"]}>
                          <span className={styles["primary-text-15"]}>Dr.{doctor.first_name} {doctor.last_name}</span>
                        </div>
                      </div>
                    </div><div className={styles["cell-16"]}>
                        <div className={styles["row-cell-17"]}>
                          <button className={styles["icon-left"]}>
                            <span className={styles["edit-information-18"]} onClick={transfereditdoctor}>Edit Information</span>
                          </button>
                        </div>
                      </div><div className={styles["cell-19"]}>
                        <div className={styles["row-cell-1a"]}>
                          <button className={styles["icon-left-1b"]} onClick={() => removedoctor(doctor)}>
                            <span className={styles["remove"]}>Remove</span>
                          </button>
                        </div>
                      </div>
                      </div></>
                  );
                })}
              
            </div>
          </div>
          <span className={styles["add-manage-facility"]} onClick={transferfacility}>Add/Manage Facility</span>
          <div className={styles["edit-29"]}></div>
          <div className={styles["frame-2a"]}>
            <div className={styles["frame-2b"]}>
              <span className={styles["email-address"]}>Email address</span>
            </div>    
                <input className={styles["frame-2c"]} placeholder='Enter your email'
                 type="text" value ={email} onChange={(e)=>setemail(e.target.value)}
                />
          </div>
          <div className={styles["frame-2e"]}>
            <div className={styles["frame-2f"]}>
              <span className={styles["temporary-password"]}>Temporary Password</span>
            </div>
            <input className={styles["frame-30"]}placeholder="Temporary Password"
              type="text" value ={password} onChange={(e)=>settpassword(e.target.value)}
            />
          </div>
          <div className={styles["frame-33"]}>
            <div className={styles["frame-34"]}>
              <span className={styles["specialty-available"]}>Specialty Available</span>
            </div>
            <div className={styles["frame-35"]}>
              <div className={styles["select-specialty"]}>
                <div className={styles["group-36"]}>
                  <span className={styles["select-specialty-37"]}>Select Specialty</span>
                  <div className={styles["rectangle"]}></div>
                </div>
                <div className={styles["group-38"]}></div>
                <div className={styles["frame-39"]}>
                  <div className={styles["group-3a"]}>
                    
                    <div className={styles["group-3b"]}>
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
              <div className={styles["frame-3c"]}>
                <div className={styles["button"]}>
                  <div className={styles["button-3d"]}>                 
                    <div className={styles["rectangle-3f"]} onClick={handleDisplay}></div>
                  </div>
                </div>
                <div className={styles["button-40"]}>
                  <div className={styles["button-41"]}>
                    <div className={styles["rectangle-43"]} onClick={handleRemove}></div>
                  </div>
                </div>
              </div>
              <div className={styles["selected-specialty"]}>
                <div className={styles["group-44"]}>
                  <span className={styles["selected-specialty-45"]}>Selected Specialty</span>
                  <div className={styles["rectangle-46"]}></div>
                </div>
                <div className={styles["group-47"]}></div>
                <div className={styles["frame-48"]}>
                  <div className={styles["group-49"]}>
                    <div className={styles["group-4a"]}>
                    {displayedSpeciality.map((speciality, index) => (
                      <div className={styles["cardiology-4b"]}key={index} onClick={()=>setremovespeciality(speciality)}>
                        {speciality}
                      </div>
                    ))}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className={styles["frame-4d"]} onClick={handleSubmit}>
            <div className={styles["frame-4e"]}>
              <div className={styles["frame-4f"]}></div>
            </div>
          </button>
          <span className={styles["create-account"]} >Create Doctor’s Account</span></div>
      )
    }
    