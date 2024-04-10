import React , { useState } from "react";
import styles from './FacilityEdit.module.css';
import { useParams } from "react-router-dom";


export default function FacilityEdit() {
    //
    const {facilityId} = useParams();
    //read facilitylist from the backend
    const FacilityList = [
        {
          facility_id: 1,
          name: "The George Washington University Hospital",
          address1: "900 23rd St. NW",
          address2: "Washington D.C.,20037",
        },
        {
          facility_id: 2,
          name: "Holy Cross Hospital",
          address1: "1500 Forest Glen Road",
          address2: "Silver Spring MD 20910",
        },
      ];
    const facilityToEdit = FacilityList.find(f => f.facility_id  ===parseInt(facilityId));


    const editdoctors = () => {
        //change the code to the real page of doctor page
        window.location.href = "/admin/doctor";
        console.log("transfer to doctor arrangement");
      };
    const manageFacility = () => {
        window.location.href = "/admin/facility";
        console.log("transfer to doctor arrangement");
    }
    //set the input field
  const [facility, setFacility] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [roomnumber, setRoomnumber] = useState("");
  const [phone, setPhone] = useState("");
    // handle the dualListBox
  const [availableSpecialties, setAvailableSpecialties] = useState([
    "Cardiology",
    "Pediatrics",
    "Psychiatry",
    "Internal Medicine",
    "Obstetrics and Gynecology (OB/GYN)",
  ]);

  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedSelected, setSelectedSelected] = useState([]);

  const handleAdd = () => {
    setSelectedSpecialties([...selectedSpecialties, ...selectedAvailable]);
    // setAvailableSpecialties(availableSpecialties.filter(specialty => !selectedAvailable.includes(specialty)));
    setSelectedAvailable([]);
  };

  const handleRemove = () => {
    // setAvailableSpecialties([...availableSpecialties, ...selectedSelected]);
    setSelectedSpecialties(
      selectedSpecialties.filter(
        (specialty) => !selectedSelected.includes(specialty)
      )
    );
    setSelectedSelected([]);
  };

  const handleSubmit = () =>{
    console.log(selectedSpecialties);
    console.log('the edit is successful!');
    console.log(facilityToEdit);
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
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
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
                    value={state}
                    onChange={(e) => setState(e.target.value)}
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
                      value={roomnumber}
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
                      value={phone}
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
                    {availableSpecialties.map((specialty) => (
                              <span
                                key={specialty}
                                className={
                                  styles[
                                    `${
                                      selectedAvailable.includes(specialty)
                                        ? "item-selected"
                                        : "item"
                                    }`
                                  ]
                                }
                                onClick={() =>
                                  setSelectedAvailable([specialty])
                                }
                              >
                                {specialty}
                              </span>
                            ))}
                     
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
                            disabled={selectedSelected.length === 0}>&lt;&lt;</span>
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
                    {selectedSpecialties.map((specialty) => (
                              <span
                                key={specialty}
                                className={
                                  styles[
                                    `${
                                      selectedSelected.includes(specialty)
                                        ? "item-selected"
                                        : "item"
                                    }`
                                  ]
                                }
                                onClick={() => setSelectedSelected([specialty])}
                              >
                                {specialty}
                              </span>
                            ))}
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
