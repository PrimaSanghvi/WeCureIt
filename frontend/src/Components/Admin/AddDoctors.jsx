
    import React from 'react';
    import { useEffect,useState } from 'react';
    import axios from 'axios'; 
    import styles from './AddDoctors.module.css';
    import { useNavigate } from 'react-router-dom';
    import { useParams } from 'react-router-dom';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
    
    export default function Main() {

      const [specialtylist,setspecialtylist] =  useState([]);
      const [first_name, setFirstName] = useState('');
      const [last_name, setLastName] = useState('');
      const [email, setemail] = useState('');
      const [password , settpassword] = useState('');
      const [phone_number, setPhone_number] = useState('');
      const [selectedspeciality,setseletedspeciality] = useState("");
      const [displayedSpeciality, setDisplayedSpeciality] = useState([]);
      const [removespeciality,setremovespeciality] = useState('')
      const [doctorlist, setDoctorList] = useState([]);
      const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);
      const { adminId } = useParams(); 
      const navigate = useNavigate();
    
      const handleDisplay = () => {
        console.log(`Selected Specialty: ${selectedspeciality}`);
        console.log(`Displayed Speciality Names:`, displayedSpeciality);
        console.log(`Selected Speciality IDs:`, selectedSpecialityIds);
    
        const speciality = specialtylist.find(s => s.name === selectedspeciality);
        if (speciality && !selectedSpecialityIds.includes(speciality.speciality_id)) {
            setSelectedSpecialityIds([...selectedSpecialityIds, speciality.speciality_id]);
            setDisplayedSpeciality([...displayedSpeciality, selectedspeciality]);
            setseletedspeciality("");
        } else if (!selectedspeciality) {
            alert('Please select a speciality first.');
        } else {
            alert('This speciality is already in the list.');
        }
    };
    
      
      
      const handleRemove = () => {
        const speciality = specialtylist.find(s => s.name === removespeciality);
        if (speciality) {
          setSelectedSpecialityIds(selectedSpecialityIds.filter(id => id !== speciality.speciality_id));
          // Also update displayedSpeciality to keep the UI in sync
          setDisplayedSpeciality(displayedSpeciality.filter(item => item !== removespeciality));
          setremovespeciality(''); // Clear selected item
        }
      };
      
      const handleSubmit = (e) =>{
        e.preventDefault();
    // Here you can handle the form submission, such as sending the data to your backend
      
        const formData = {
          first_name,
          last_name,
          speciality_id: selectedSpecialityIds,
          password,
          phone_number,
          email,
          is_active:true,
        }
        console.log(formData)
        if (Object.keys(formData).length !== 0) {
          console.log(JSON.stringify(formData));
          axios.post('http://127.0.0.1:8000/api/DoctorRegister/', formData)
              .then(response => {
                
                  console.log('Form submitted successfully!', response.data);
                  // Handle any post-submission logic here, like redirecting to another page
                  
              })
              .catch(error => {
                  console.error('Error submitting form:', error);
              });
              // window.location.href = "/AddDoctors"
      }
      
        
      };
      const transferfacility = () =>{
        //change to the real edit facility path
        window.location.href = `/admin/facility/${adminId}/`;
        console.log("transfer to edit facilities")
      };

      const removedoctor = async(doctorToRemove) => {
          try {
            // Update the doctor's is_active status to false
            doctorToRemove.is_active = false;
            console.log(doctorToRemove)
            // Send a PUT request to update the doctor's is_active status
            await axios.put(`http://127.0.0.1:8000/api/removedoctor/${doctorToRemove.doctor_id}/`, doctorToRemove);
            // If the request is successful, update the doctor list in the state
            const updatedDoctorList = doctorlist.filter(doctor => doctor !== doctorToRemove);
            setDoctorList(updatedDoctorList);
        } catch (error) {
            // Handle errors
            console.error('Error removing doctor:', error);
        }
        
      };


      const transfereditdoctor = async(editdoctor) =>{
        console.log(editdoctor)
        navigate('/editdoctors/', { state: {editdoctor, adminId}});
        //window.location.href = "/editdoctors";
      }
      // const transfereditdoctor = (doctorId) => {
      //   // Assuming you fetch or otherwise determine the doctor's current specialties here or earlier in the component.
      //   const doctorToEdit = doctorlist.find(doctor => doctor.doctor_id === doctorId);
    
      //   // If doctorlist already includes specialty details as you fetch them,
      //   // ensure those details are structured the way your edit page expects.
      //   // If not, you might need to fetch the doctor's details, including their specialties, here.
        
      //   console.log("Preparing to edit doctor:", doctorToEdit);
      //   navigate('/editdoctors/', { state: { editdoctor: doctorToEdit } });
    //};
    

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/specialties/');
            const response2 = await axios.get('http://127.0.0.1:8000/api/doctorlist/');
            const formattedData = response.data.map(item => ({
              speciality_id: item.speciality_id,
              name: item.name
            }));
            
          
            const doctorlistformatted = response2.data.map(doctor =>  ({
              doctor_id: doctor.doctor_id,
              first_name: doctor.first_name,
              last_name: doctor.last_name,
              speciality: doctor.speciality,
              password: doctor.password,
              phone_number:doctor.phone_number,
              email:doctor.email,
              is_active: doctor.is_active
            }));
          
            const activedoctor = doctorlistformatted.filter(doctor => doctor.is_active === true);
            setDoctorList(activedoctor)
            setspecialtylist(formattedData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);

      

      return (
          <div className={styles['main-container']}>
                <div  className={styles['top-bar']}>
                  <div  className={styles['frame']}>      
                    <div className={styles['main-container2']}>
                      <span className={styles['we-cure-it']}>WeCureIt</span>
                    <div className={styles['icon']} />
                    <div  className={styles['profile']}>
                    
                    <div className={styles['dropdown']}>
                    
                      <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ marginTop: '-6px' }}/>
                   
                    <div className={styles['dropdown-content']}>
                    
                    <a href="/">Logout</a>
                   </div>
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
                            <span className={styles["edit-information-18"]} onClick={()=>transfereditdoctor(doctor)}>Edit Information</span>
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
          <div className={styles['frame-phone']}>
                <span className={styles['text-3']}>Contact Number</span>
                <br/>
                <input
                        className={styles['contact']}
                        type='number'
                        value={phone_number}
                        placeholder='Enter Contact Number'
                        onChange={(e) => setPhone_number(e.target.value)}
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
    