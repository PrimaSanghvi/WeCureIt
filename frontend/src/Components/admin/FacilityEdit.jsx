import React , { useState, useEffect } from "react";
import styles from './FacilityEdit.module.css';
import { useParams,useLocation, useNavigate  } from "react-router-dom";
import axios from "axios"; 

export default function FacilityEdit() {
    //
    const {facilityId} = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);
    const [name, setFacilityname] = useState(state?.facility.name);
    const [address1, setAddress1] = useState(state?.facility.address);
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [states, setStates] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [rooms_no, setRoomnumber] = useState(state?.facility.rooms_no);
    const [phone_number, setPhone] = useState(state?.facility.phone_number);
     
   
  

    const [selectedAvailable, setSelectedAvailable] = useState("");
    const [removespeciality, setRemoveSpeciality] = useState("");
    const [displayedSpeciality, setDisplayedSpeciality] = useState([]);
  
    const fetchSpecialities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/specialties/');
        const formattedData = response.data.map(item => ({
          speciality_id: item.speciality_id,
          name: item.name
        }));
        setSpecialities(formattedData);
      } catch (error) {
        console.error('Error fetching specialities:', error);
      }
    };

    useEffect(() => {
      fetchSpecialities();

    try
    {
    if (state?.facility.speciality && Array.isArray(state?.facility.speciality)) {
      const processedData = state?.facility.speciality.map(spec => ({
        speciality_id: spec.speciality_id,
          name: spec.name
      }));
      setDisplayedSpeciality(processedData);
    }}
    catch(error)
    {
      console.error('Error fetching data:', error);
    }
    }, [facilityId, state?.facility]);

    const editdoctors = () => {
        //change the code to the real page of doctor page
        window.location.href = "/admin/doctor";
        console.log("transfer to doctor arrangement");
      };
    const manageFacility = () => {
        window.location.href = "/admin/facility";
        console.log("transfer to doctor arrangement");
    }
   
 
  const handleAdd = () => {
    const specialityToAdd = specialities.find(s => s.name === selectedAvailable);
    console.log("removespeciality",selectedAvailable)
    if (specialityToAdd && !displayedSpeciality.some(spec => spec.speciality_id === specialityToAdd.speciality_id)) {
      setDisplayedSpeciality([...displayedSpeciality, specialityToAdd]);
      setSelectedAvailable("");
  } else if (!selectedAvailable) {
      alert('Please select a specialty first.');
  } else {
      alert('This specialty is already in the list.');
  }
  };

  const handleRemove = () => {
   
    setDisplayedSpeciality(displayedSpeciality.filter(spec => spec.name !== removespeciality));
    
    setRemoveSpeciality("");
  };

  const handleSubmit = async () =>{
    const facility_id = state?.facility.facility_id;
    const is_active = state?.facility.is_active
    
    const specialityIds = displayedSpeciality.map(speciality => speciality.speciality_id);
    const address = address1;
    console.log('the edit is successful!');

    const updatedFacility = {
      facility_id,
      name,
      address,
      phone_number,
      rooms_no,
      is_active,
      speciality_id: specialityIds
    }
console.log("update", JSON.stringify(updatedFacility))
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/facilities/update/${facility_id}/`, updatedFacility);
      console.log('Update successful!', response.data);
      // Handle successful update here, perhaps redirect or show a success message
    } catch (error) {
      console.error('Error updating facility:', error);
      // Handle error here, show an error message or take other actions as needed
    }
   
  }
  return (
    <div className={styles["main-container"]}>
      
      <div className={styles["top-bar"]}>
        <div className={styles["frame"]}>
          <div className={styles["main-container2"]}>
            <span className={styles["we-cure-it"]}>WeCureIt</span>
            <div className={styles["vector"]} />
          </div>
        </div>
      </div>
      <span className={styles["edit-facility"]}>Edit Facility</span>
      <div className={styles["flex-row"]}>
        <span className={styles["add-manage-doctor"]}onClick={editdoctors}>Add/Manage Doctor</span>
        <div className={styles["facility-name"]}>
          <div className={styles["frame-1"]}>
            <span className={styles["facility-name-2"]}>Facility Name</span>
          </div>
          <div className={styles["frame-3"]}>
            
            <input
                    className={styles["input"]}
                    value={name}
                    onChange={(e) => setFacilityname(e.target.value)}
                    placeholder="facility name"
                    type="text"
                  />
           
          </div>
        </div>
        <div className={styles["edit"]}></div>
      </div>
      <div className={styles["flex-row-f"]}>
        <div className={styles["facility-address"]}>
          <div className={styles["frame-5"]}>
            <span className={styles["address"]}>Address</span>
          </div>
          <div className={styles["frame-6"]}>
          <input
                    className={styles["input"]}
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder=" Address Line 1"
                    type="text"
                  />
          </div>
          <div className={styles["frame-8"]}>
          <input
                    className={styles["input"]}
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder=" Address Line 2"
                    type="text"
                  />
          </div>
          <div className={styles["frame-b"]}>
            <span className={styles["city"]}>City</span>
          </div>
          <div className={styles["frame-c"]}>
          <input
                    className={styles["input"]}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City name"
                    type="text"
                  />
          </div>
          <div className={styles["frame-e"]}>
            <span className={styles["state"]}>State</span>
          </div>
          <div className={styles["frame-f"]}>
          <input
                    className={styles["input"]}
                    value={states}
                    onChange={(e) => setStates(e.target.value)}
                    placeholder=" State name"
                    type="text"
                  />
          </div>
          <div className={styles["frame-12"]}>
            <span className={styles["zip-code"]}>Zip-Code</span>
          </div>
          <div className={styles["frame-13"]}>
          <input
                    className={styles["input"]}
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Zip code"
                    type="text"
                  />
          </div>
        </div>
        <span className={styles["add-manage-facility"]}onClick={manageFacility}>Add/Manage Facility</span>
        <div className={styles["edit-16"]}></div>
      </div>
      <div className={styles["flex-row-ac"]}>
        <div className={styles["number-of-rooms"]}>
          <div className={styles["frame-17"]}>
            <span className={styles["number-of-rooms-18"]}>Number of Rooms</span>
          </div>
          <div className={styles["frame-19"]}>
          <input
                      className={styles["input"]}
                      value={rooms_no}
                      onChange={(e) => setRoomnumber(e.target.value)}
                      placeholder="Rooms available"
                      type="text"
                    />
          </div>
        </div>
        <div className={styles["phone-number"]}>
          <div className={styles["frame-1b"]}>
            <span className={styles["phone-number-1c"]}>Phone Number</span>
          </div>
          <div className={styles["frame-1d"]}>
          <input
                      className={styles["input"]}
                      value={phone_number}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(000)000-0000"
                      type="text"
                    />
          </div>
        </div>
      </div>
      <div className={styles["frame-20"]}>
        <div className={styles["specialty-selection"]}>
          <div className={styles["frame-21"]}>
            <div className={styles["frame-22"]}>
              <span className={styles["specialty-available"]}>Specialty Available</span>
            </div>
            <div className={styles["frame-23"]}>
              <div className={styles["select-specialty"]}>
                <div className={styles["group-24"]}>
                  <span className={styles["select-specialty-25"]}>Select Specialty</span>
                  <div className={styles["rectangle"]}></div>
                </div>
                <div className={styles["group-26"]}></div>
                <div className={styles["frame-27"]}>
                  <div className={styles["group-28"]}>
                    <div className={styles["group-29"]}>
                    {specialities.map((speciality,index) => {
                      return(
<span
                                key={index}
                                className={
                                  styles[
                                    `${
                                      selectedAvailable.includes(speciality.name)
                                        ? "item-selected"
                                        : "item"
                                    }`
                                  ]
                                }
                                onClick={() =>
                                  setSelectedAvailable(speciality.name)
                                }
                              >
                                {speciality.name}
                              </span>
                      );
                    })}
                              
                            
                     
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["frame-2a"]}>
                <div className={styles["button"]}>
                  <div className={styles["button-2b"]}>
                    <span className={styles["button-2c"]}onClick={handleAdd}
                            disabled={selectedAvailable.length === 0}>&gt;&gt;</span>
                    <div className={styles["rectangle-2d"]}></div>
                  </div>
                </div>
                <div className={styles["button-2e"]}>
                  <div className={styles["button-2f"]}>
                    <span className={styles["button-30"]} onClick={handleRemove}
                            disabled={removespeciality.length === 0}>&lt;&lt;</span>
                    <div className={styles["rectangle-31"]}></div>
                  </div>
                </div>
              </div>
              <div className={styles["selected-specialty"]}>
                <div className={styles["group-32"]}>
                  <span className={styles["selected-specialty-33"]}>
                    Selected Specialty
                  </span>
                  <div className={styles["rectangle-34"]}></div>
                </div>
                <div className={styles["group-35"]}></div>
                <div className={styles["frame-36"]}>
                  <div className={styles["group-37"]}>
                    <div className={styles["group-38"]}>
                    {displayedSpeciality.map((speciality, index) => 
                    {
                      return(
                        <span
                        key={index}
                        className={
                          styles[
                            `${
                              removespeciality.includes(speciality.name)
                                ? "item-selected"
                                : "item"
                            }`
                          ]
                        }
                        onClick={() => setRemoveSpeciality(speciality.name)}
                      >
                        {speciality.name}
                      </span>
                      )
                    })}
                      {/* <span className={styles["cardiology-39"]}>Cardiology</span>
                      <span className={styles["pediatrics-3a"]}>Pediatrics</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["flex-row-de"]}>
        <span className={styles["create-facility"]} onClick={handleSubmit}>Edit Facility</span>
        <div className={styles["frame-3b"]}>
          <div className={styles["frame-3c"]}>
            <div className={styles["frame-3d"]}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
