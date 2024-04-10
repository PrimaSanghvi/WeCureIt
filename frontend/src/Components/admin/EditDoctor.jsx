import React from "react";
import styles from"./EditDoctor.module.css";
import { useEffect,useState } from 'react';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';


export default function Main() {
  const location = useLocation();
  const doctor_editing = location.state.editdoctor;
  const [specialtylist,setspecialtylist] =  useState([]);
  const [first_name, setFirstName] = useState(doctor_editing.first_name);
  const [last_name, setLastName] = useState(doctor_editing.last_name);
  const [email, setemail] = useState(doctor_editing.email);
  const [selectedspeciality,setseletedspeciality] = useState("");
  const [displayedSpeciality, setDisplayedSpeciality] = useState([]);
  const [removespeciality,setremovespeciality] = useState('')
  const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);

  // useEffect(() => {
  //   // Initialize displayedSpeciality with the names of the doctor's current specialties
  //   if (doctor_editing.speciality && Array.isArray(doctor_editing.speciality)) {
  //     const names = doctor_editing.speciality.map(spec => spec.name);
  //     setDisplayedSpeciality(names);
  //     const ids = doctor_editing.speciality.map(spec => spec.speciality_id);
  //     setSelectedSpecialityIds(ids);
  //   }
  // }, [doctor_editing]);


  useEffect(() => {
    // Initialize displayedSpeciality with the names of the doctor's current specialties
    try
    {
    if (doctor_editing.speciality && Array.isArray(doctor_editing.speciality)) {
      const processedData = doctor_editing.speciality.map(spec => ({
        speciality_id: spec.speciality_id,
          name: spec.name
      }));
      setDisplayedSpeciality(processedData);
    }}
    catch(error)
    {
      console.error('Error fetching data:', error);
    }
  }, [doctor_editing]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // console.log(doctor_editing)
        const response = await axios.get('http://127.0.0.1:8000/api/specialties/');
        const formattedData = response.data.map(item => ({
          speciality_id: item.speciality_id,
          name: item.name
        }));
        setspecialtylist(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // const handleDisplay = () => {

  //   if(selectedspeciality && !displayedSpeciality.includes(selectedspeciality)){
  //     setDisplayedSpeciality([...displayedSpeciality, selectedspeciality]);
  //     setseletedspeciality("");
  //   }
  //   else if(!selectedspeciality){
  //     alert('Please select a speciality first.');
  //   }
  //   else{
  //     alert('this speciality is already in the list')
  //   }
  // };

  // const handleDisplay = () => {
  //   const specialityToAdd = specialtylist.find(spec => spec.speciality_id.toString() === selectedspeciality);
  //   if (specialityToAdd && !displayedSpeciality.some(spec => spec.speciality_id === specialityToAdd.speciality_id)) {
  //     setDisplayedSpeciality([...displayedSpeciality, specialityToAdd]);
  //     setseletedspeciality("");
  //   } else if (!selectedspeciality) {
  //     alert('Please select a speciality first.');
  //   } else {
  //     alert('This speciality is already in the list');
  //   }
  // };
//   const handleDisplay = () => {
//     console.log(`Selected Specialty: ${selectedspeciality}`);
//     console.log(`Displayed Speciality Names:`, displayedSpeciality);
//     console.log(`Selected Speciality IDs:`, selectedSpecialityIds);

//     const speciality = specialtylist.find(s => s.name === selectedspeciality);
//     if (speciality && !selectedSpecialityIds.includes(speciality.speciality_id)) {
//         setSelectedSpecialityIds([...selectedSpecialityIds, speciality.speciality_id]);
//         setDisplayedSpeciality([...displayedSpeciality, selectedspeciality]);
//         setseletedspeciality("");
//     } else if (!selectedspeciality) {
//         alert('Please select a speciality first.');
//     } else {
//         alert('This speciality is already in the list.');
//     }
// };
const handleDisplay = () => {
  console.log(`Selected Specialty: ${selectedspeciality}`);
  const specialityToAdd = specialtylist.find(s => s.name === selectedspeciality);
  if (specialityToAdd && !displayedSpeciality.some(spec => spec.speciality_id === specialityToAdd.speciality_id)) {
      // Here, specialityToAdd is the full object from specialtylist that matches the name
      setDisplayedSpeciality([...displayedSpeciality, specialityToAdd]);
      setseletedspeciality("");
  } else if (!selectedspeciality) {
      alert('Please select a specialty first.');
  } else {
      alert('This specialty is already in the list.');
  }
};

  
const handleRemove = () => {
  console.log('removespeciality',removespeciality);
  setDisplayedSpeciality(displayedSpeciality.filter(spec => spec.name !== removespeciality));
  setremovespeciality('');
};

  
  // const handleRemove = () =>{
  //   if (removespeciality) {
  //     setDisplayedSpeciality(displayedSpeciality.filter(item => item !== removespeciality));
  //     setremovespeciality(''); // Clear selected item
  //   }
  // };

  // const handleDisplay = () => {
  //   const speciality = specialtylist.find(s => s.name === selectedspeciality);
  //   if (speciality && !selectedSpecialityIds.includes(speciality.speciality_id)) {
  //     setSelectedSpecialityIds([...selectedSpecialityIds, speciality.speciality_id]);
  //     setDisplayedSpeciality([...displayedSpeciality, selectedspeciality]);
  //     setseletedspeciality("");
  //   } else if (!selectedspeciality) {
  //     alert('Please select a speciality first.');
  //   } else {
  //     alert('This speciality is already in the list');
  //   }
  // };
  
  // const handleRemove = () => {
  //   const speciality = specialtylist.find(s => s.name === removespeciality);
  //   if (speciality) {
  //     setSelectedSpecialityIds(selectedSpecialityIds.filter(id => id !== speciality.speciality_id));
  //     setDisplayedSpeciality(displayedSpeciality.filter(name => name !== removespeciality));
  //     setremovespeciality('');
  //   }
  // };

  const transferaddfacility= ()=>{
    //change to the real edit facility path
    window.location.href = "/editfacilities";
    console.log("transfer to edit facilities")
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    const doctor_id = doctor_editing.doctor_id;
    const password = doctor_editing.password;
    const phone_number = doctor_editing.phone_number
    const is_active = doctor_editing.is_active
    // const speciality = displayedSpeciality.join(", ");
    console.log('displayedSpeciality',displayedSpeciality);
    // const specialityIds = displayedSpeciality.map(name => 
    //   specialtylist.find(spec => spec.name === name)?.speciality_id
    // ).filter(id => id !== undefined);
    const specialityIds = displayedSpeciality.map(speciality => speciality.speciality_id);

    console.log('specialityIds',specialityIds);

    const updateddoctor = {
      doctor_id,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      is_active,
      speciality_id: specialityIds
    }
   
  
    
    console.log(updateddoctor)
    try {
      // Send a PUT request to update the doctor's is_active status
    await axios.put(`http://127.0.0.1:8000/api/removedoctor/${doctor_editing.doctor_id}/`, updateddoctor);
  // If the request is successful, update the doctor list in the state
    } catch (error) {
  // Handle errors
    console.error('Error removing doctor:', error);
  }
    
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
                {displayedSpeciality.map((speciality, index) => 
                {
                  return(
                    <div className={styles["cardiology-19"]} key={index} onClick={() => setremovespeciality(speciality.name)}>
                    {speciality.name}
                  </div>
                  );
                })}

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
