import React, { useState, useEffect } from "react";
import styles from "./FacilityHome.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
    

export default function FacilityHome() {
  
  const [FacilityList, setFacilityList] = useState([]);
  const [specialityList, setspecialitylist] = useState([]);

  const navigate = useNavigate();
  const { adminId } = useParams(); 

  // Fetch facilities when component mounts
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/facilities/'); 
        setFacilityList(response.data);
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      }
    };
    fetchFacilities();
  }, []);

  const activeFacilities = FacilityList.filter(facility => facility.is_active);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(doctor_editing)
        const response = await axios.get('http://127.0.0.1:8000/api/specialties/');
        const formattedData = response.data.map(item => ({
          speciality_id: item.speciality_id,
          name: item.name
        }));
        setspecialitylist(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [])

  const handleEdit = (facility) => {
    navigate(`/admin/editFacility/${facility.facility_id}`, { state: { facility, adminId } });
  };

  const editdoctors = () => {
    //change the code to the real page of doctor page
    navigate(`/addDoctors/${adminId}`);
    console.log("transfer to doctor arrangement");
  };
  // to remove a certain facility
  // showConfirmationRemove: to triger if the confirmation page is popup
  const [showConfirmationRemove, setShowConfirmationRemove] = useState(false);
  //add the selected facility to a temp list
  const [facilityToBeRemoved, setFacilityToBeRemoved] = useState(null);
  // to render the successful delete page
  const [removalSuccess, setRemovalSuccess] = useState(false);

  const handleRemoveClick = (facilityId) => {
    try {
      const facility = FacilityList.find((f) => f.facility_id === facilityId);
      setFacilityToBeRemoved(facility)
      setShowConfirmationRemove(true);
     
      // Optionally refresh the list or update the state to reflect the change
    } catch (error) {
      console.error('Error deactivating facility:', error.response ? error.response.data : error.message);
    }
  };
  // the command is confirmed, send delete command to the backend
  const handleRemoveConfirm = async() => {
    try {
      var facilityId = facilityToBeRemoved.facility_id
      const response = await axios.patch(`http://127.0.0.1:8000/api/facilities/deactivate/${facilityId}/`);
      console.log('Facility deactivated:', response.data);
      console.log(
        `Facility with ID ${facilityToBeRemoved.facility_id} is cancelled successfully!`
      );

      //send the post request to the api to cancel the data
      // render the sucessful info page
      setRemovalSuccess(true);
      // window.location.href = `/admin/facility/${adminId}/`;
     
      // Optionally refresh the list or update the state to reflect the change
    } catch (error) {
      console.error('Error deactivating facility:', error.response ? error.response.data : error.message);
    }
  };
  const handleRemoveCancelBefore = () => {
    setShowConfirmationRemove(false);
    setFacilityToBeRemoved(null);
    setRemovalSuccess(false); // Reset the success state for the next removal 
  };

  const handleRemoveCancelAfter = () => {
    console.log("AFTER");
    setShowConfirmationRemove(false);
    setFacilityToBeRemoved(null);
    setRemovalSuccess(false); // Reset the success state for the next removal 
    window.location.href = `/admin/facility/${adminId}/`;
  };

  //handle the show add facility popup page
  const [showAddFacility, setShowAddFacility] = useState(false);
  const handleAddClick = () => {
    setShowAddFacility(true);
  };
  const handleAddFacilityCancel = () => {
    setShowAddFacility(false);
    navigate(`/admin/facility/${adminId}/`)
    setSelectedSpecialties([])
    setSelectedSpecialityIds([])

  };

  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState("");
  const [selectedSelected, setSelectedSelected] = useState("");
  const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);

  const handleAdd = () => {

    const speciality = specialityList.find(s => s.name === selectedAvailable);

    if (speciality && !selectedSpecialityIds.includes(speciality.speciality_id)) {
      setSelectedSpecialityIds([...selectedSpecialityIds, speciality.speciality_id]);
      setSelectedSpecialties([...selectedSpecialties, selectedAvailable]);
      setSelectedAvailable("");
  } else if (!selectedAvailable) {
      alert('Please select a speciality first.');
  } else {
      alert('This speciality is already in the list.');
  }
  };

  const handleRemove = () => {
    const speciality = specialityList.find(s => s.name === selectedSelected);
    if (speciality) {
      setSelectedSpecialityIds(selectedSpecialityIds.filter(id => id !== speciality.speciality_id));
      setSelectedSpecialties(selectedSpecialties.filter(item => item !== selectedSelected));
      setSelectedSelected(""); 
    }
  };

  //set the input field
  const [name, setFacilityName] = useState("");
  const [addressLine1, setAddress1] = useState("");
  const [addressLine2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipcode] = useState("");
  const [rooms_no, setRoomnumber] = useState("");
  const [phone_number, setPhone] = useState("");

  const handleSubmitFacility = () => 
  {
    // const specialityIds = selectedSpecialties.map(speciality => speciality.speciality_id);

    const formData = {
      name,
      phone_number,
      rooms_no,
      addressLine1,
      addressLine2,
      state,
      city,
      zipCode,
      speciality_id: selectedSpecialityIds,
      is_active:true,
    }
   console.log(JSON.stringify(formData));

   if (Object.keys(formData).length !== 0) {
    console.log(JSON.stringify(formData));
    axios.post('http://127.0.0.1:8000/api/facilities/create/', formData)
        .then(response => {
          
            console.log('Form submitted successfully!', response.data);
            window.location.href = `/admin/facility/${adminId}/`
            
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });
        // window.location.href = "/AddDoctors"
}
  };

  //Manage the rooms for the selected facility
  // Function to convert date from YYYY-MM-DD to MM/DD/YYYY
  const convertDateFormat = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${month}/${day}/${year}`;
  };

  const [showRooms, setShowRooms] = useState(false);
  const [facilityToBeEditRoom, setFacilityToBeEditRoom] = useState(null);

  // handle the date filter and the room
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAvailableRoom, setSelectedAvailableRoom] = useState(null);
  const [selectedUnavailableRoom, setSelectedUnavailableRoom] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');
 
  const formattedDate = convertDateFormat(selectedDate);

  const [roomsData, setRoomsData] = useState({});

  // Get the available and unavailable rooms for the selected date
  const availableRooms = roomsData[formattedDate]?.available || [];
  const unavailableRooms = roomsData[formattedDate]?.unavailable || [];

  const getRoomsDB = async (facilityRoom) => {
    try {
      const { data: response } = await axios.get(`http://127.0.0.1:8000/api/rooms/`);

      var availableFacilityRooms = []
      var unavailableFacilityRooms = []

      if (Object.keys(response).length <= 0) {
        // No data in ManageRooms DB = All rooms are available
        // Only show available and unavailabe rooms when a date is set:
        availableFacilityRooms = []
        unavailableFacilityRooms = []
        if (selectedDate !== '') {
          for (let i = 1; i <= facilityRoom.rooms_no; i++) {
            availableFacilityRooms.push(i);
          }
          setRoomsData({
            [formattedDate]: { available: availableFacilityRooms, unavailable: unavailableFacilityRooms },
          });

        }
      } else {        
        if ((facilityRoom) && (selectedDate !== '')) {
          for (let i = 0; i < response.length; i++) {
            if ((response[i]['facility_id'] === facilityRoom.facility_id) && (selectedDate === response[i]['date'])) {
              // Unavailable room exists for the selected date:
              availableFacilityRooms = []
              unavailableFacilityRooms = []

              for (let j = 1; j <= facilityRoom.rooms_no; j++) {
                if (response[i]['unavailable_room'].includes(j)) {
                  unavailableFacilityRooms.push(j);
                } else {
                  availableFacilityRooms.push(j);
                }
              }

              setRoomsData({
                [formattedDate]: { available: availableFacilityRooms, unavailable: unavailableFacilityRooms }
              });

              setSelectedRoomId(response[i]['room_id']);

              return
            }
          }

          // All rooms considered available:
          availableFacilityRooms = []
          unavailableFacilityRooms = []
          for (let i = 1; i <= facilityRoom.rooms_no; i++) {
            availableFacilityRooms.push(i);
          }
          setRoomsData({
            [formattedDate]: { available: availableFacilityRooms, unavailable: unavailableFacilityRooms },
          });
          
          setSelectedRoomId('');
        }

      }
    } catch (error) {
      console.error('Failed to fetch rooms from DB:', error);
    }
  }

  // Update available rooms everytime the selected date gets changed:
  useEffect(() => {
    getRoomsDB(facilityToBeEditRoom);
    // eslint-disable-next-line
  }, [selectedDate,]);

  const handleRoomClick = (facilityId) => {
    const facility = FacilityList.find((f) => f.facility_id === facilityId);
    setShowRooms(true);
    setFacilityToBeEditRoom(facility);
  };

  // When the date is changed, update the selected date
  const handleDateChange = (event) => {
    const newDate = event.target.value; // in YYYY-MM-DD format
    setSelectedDate(newDate);
    // Reset room selection when date changes
    setSelectedAvailableRoom(null);
    setSelectedUnavailableRoom(null);
    setSubmissionMsg('');
    setErrorSubmissionMsg('');
  };

  // Function to move a room from available to unavailable
  const moveToUnavailable = () => {
    if (selectedAvailableRoom !== null) {
      const newAvailable = availableRooms.filter(room => room !== selectedAvailableRoom);
      const newUnavailable = [...unavailableRooms, selectedAvailableRoom];
      setRoomsData({
        ...roomsData,
        [formattedDate]: { available: newAvailable, unavailable: newUnavailable },
      });
      setSelectedAvailableRoom(null);
    }
  };

  // Function to move a room from unavailable to available
  const moveToAvailable = () => {
    if (selectedUnavailableRoom !== null) {
      const newUnavailable = unavailableRooms.filter(room => room !== selectedUnavailableRoom);
      const newAvailable = [...availableRooms, selectedUnavailableRoom];
      setRoomsData({
        ...roomsData,
        [formattedDate]: { available: newAvailable, unavailable: newUnavailable },
      });
      setSelectedUnavailableRoom(null);
    }
  };

  const [submissionMsg, setSubmissionMsg] = useState('');
  const [errorSubmissionMsg, setErrorSubmissionMsg] = useState('');

  const handelSubmitManageRooms = () =>{
    var unavailable_room = unavailableRooms;
    var date = selectedDate;
    var facility_id = facilityToBeEditRoom.facility_id;

    const roomsForm = {
      unavailable_room,
      date,
      facility_id
    };
    // Case #1: Originally all available, now certain rooms are unavailable
    if ((selectedRoomId === '') && (unavailableRooms.length > 0)) {
      axios.post('http://127.0.0.1:8000/api/updateRooms/', roomsForm)
      .then(response => {
        console.log("Form submitted successfully:", response.data);
        setSubmissionMsg("Room Availability Successfully Updated")
      })
    } else if ((selectedRoomId !== '') && (unavailableRooms.length > 0)) {
      // Case #2: Originally some unavailable rooms, now there are still unavailable rooms:
      axios.patch(`http://127.0.0.1:8000/api/updateRooms/${selectedRoomId}/`, roomsForm)
      .then(response => {
        console.log("Form submitted successfully:", response.data);
        setSubmissionMsg("Room Availability Successfully Updated")
      })
    } else if ((selectedRoomId !== '') && (unavailableRooms.length === 0)) {
      // Case #3: Originally some unavailable rooms, now all are available:
      axios.delete(`http://127.0.0.1:8000/api/updateRooms/${selectedRoomId}/`, roomsForm)
      .then(response => {
        console.log("Form submitted successfully:", response.data);
        setSubmissionMsg("Room Availability Successfully Updated")
      })
    } else {
      setErrorSubmissionMsg("Please provide valid inputs");
    }
  }

  const handleRoomCancel = () => {
    setShowRooms(false);
    setFacilityToBeEditRoom(null);
    setSelectedDate('');
    setSelectedAvailable(null);
    setSelectedUnavailableRoom(null);
    setRoomsData({});
    setSelectedRoomId('');
    setSubmissionMsg('');
    setErrorSubmissionMsg('');
  };

  return (
    <div className={styles['main-container']}>
      <div  className={styles['top-bar']}>
        <div  className={styles['frame']}>      
          <div className={styles['main-container2']}>
            <span className={styles['we-cure-it']}>WeCureIt</span>
          <div className={styles['vector']} />
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

      <div className={styles["rectangle"]}>
        <span className={styles["remove-button"]} onClick={handleAddClick}>
          Add Facility
        </span>
      </div>
      {showAddFacility && (
        <div className={styles["pop-up-add"]}>
          <div className={styles["frame-1"]}>
            <div className={styles["frame-2"]}>
              <div className={styles["facility-name"]}>
                <div className={styles["frame-3"]}>
                  <span className={styles["facility-name-4"]}>
                    Facility Name
                  </span>
                </div>
                <div className={styles["frame-5"]}>
                  <input
                    className={styles["input"]}
                    value={name}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="facility name"
                    type="text"
                  />
                </div>
              </div>
              <div className={styles["facility-address"]}>
                <div className={styles["frame-8"]}>
                  <span className={styles["address"]}>Address</span>
                </div>
                <div className={styles["frame-9"]}>
                  <input
                    className={styles["input"]}
                    value={addressLine1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder=" Address Line 1"
                    type="text"
                  />
                </div>
                <div className={styles["frame-b"]}>
                  <input
                    className={styles["input"]}
                    value={addressLine2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder=" Address Line 2"
                    type="text"
                  />
                </div>
                <div className={styles["frame-e"]}>
                  <span className={styles["city"]}>City</span>
                </div>
                <div className={styles["frame-f"]}>
                  <input
                    className={styles["input"]}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City name"
                    type="text"
                  />
                </div>
                <div className={styles["frame-11"]}>
                  <span className={styles["state"]}>State</span>
                </div>
                <div className={styles["frame-12"]}>
                  <input
                    className={styles["input"]}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder=" State name"
                    type="text"
                  />
                </div>
                <div className={styles["frame-15"]}>
                  <span className={styles["zipcode"]}>Zip-Code</span>
                </div>
                <div className={styles["frame-16"]}>
                  <input
                    className={styles["input"]}
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Zip code"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div className={styles["frame-19"]}>
              <div className={styles["frame-1a"]}>
                <div className={styles["number-of-rooms"]}>
                  <div className={styles["frame-1b"]}>
                    <span className={styles["number-of-rooms-1c"]}>
                      Number of Rooms
                    </span>
                  </div>
                  <div className={styles["frame-1d"]}>
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
                  <div className={styles["frame-1f"]}>
                    <span className={styles["phone-number-20"]}>
                      Phone Number
                    </span>
                  </div>
                  <div className={styles["frame-21"]}>
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
              <div className={styles["specialty-selection"]}>
                <div className={styles["frame-24"]}>
                  <div className={styles["frame-25"]}>
                    <span className={styles["specialty-available"]}>
                      Specialty Available
                    </span>
                  </div>
                  <div className={styles["frame-26"]}>
                    <div className={styles["select-specialty"]}>
                      <div className={styles["group-27"]}>
                        <span className={styles["select-specialty-28"]}>
                          Select Specialty
                        </span>
                        <div className={styles["rectangle-29"]}></div>
                      </div>
                      
                      <div className={styles["frame-2b"]}>
                        <div className={styles["group-2c"]}>
                          <div className={styles["group-2d"]}>
                            {specialityList.map((specialty,index) => {
                              return(
                              <span
                                key={index}
                                className={
                                  styles[
                                    `${
                                      selectedAvailable.includes(specialty.name)
                                        ? "item-selected"
                                        : "item"
                                    }`
                                  ]
                                }
                                onClick={() =>
                                  setSelectedAvailable(specialty.name)
                                }
                              >
                                {specialty.name}
                              </span>
                            )
                              }
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles["frame-2e"]}>
                      <div className={styles["button"]}>
                        <div className={styles["button-2f"]}>
                         
                          <span
                            className={styles["button-30"]}
                            onClick={handleAdd}
                            disabled={selectedAvailable.length === 0}
                          >
                            &gt;&gt;
                          </span>
                          <div className={styles["rectangle-31"]}></div>
                        </div>
                      </div>
                      <div className={styles["button-32"]}>
                        <div className={styles["button-33"]}>
                          <span
                            className={styles["button-34"]}
                            onClick={handleRemove}
                            disabled={selectedSelected.length === 0}
                          >
                            &lt;&lt;
                          </span>
                          <div className={styles["rectangle-35"]}></div>
                        </div>
                      </div>
                    </div>
                    <div className={styles["selected-specialty"]}>
                      <div className={styles["group-36"]}>
                        <span className={styles["selected-specialty-37"]}>
                          Selected Specialty
                        </span>
                        <div className={styles["rectangle-38"]}></div>
                      </div>
                      <div className={styles["group-39"]}></div>
                      <div className={styles["frame-3a"]}>
                        <div className={styles["group-3b"]}>
                          <div className={styles["group-3c"]}>
                            {selectedSpecialties.map((specialty,index) =>
                            {
                              return(
                              <span
                                key={index}
                                className={
                                  styles[
                                    `${
                                      selectedSelected.includes(specialty)
                                        ? "item-selected"
                                        : "item"
                                    }`
                                  ]
                                }
                                onClick={() => setSelectedSelected(specialty)}
                              >
                                {specialty}
                              </span>
                              )
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["group-3f"]}>
            <button className={styles["add-button"]}>
              <div className={styles["add-button-40"]}>
                <span
                  className={styles["add-facility"]}
                  onClick={handleSubmitFacility}
                >
                  Add Facility
                </span>
                <div className={styles["rectangle-41"]}></div>
              </div>
            </button>
            <button className={styles["cancel-button-add"]}>
              <div className={styles["cancel-button-42"]}>
                <span
                  className={styles["cancel-button-43"]}
                  onClick={handleAddFacilityCancel}
                >
                  Cancel
                </span>
                <div className={styles["rectangle-44"]}></div>
              </div>
            </button>
          </div>
          <span className={styles["add-facility-45"]}>Add Facility</span>
        </div>
      )}

      <span className={styles["manage-facility"]}>Manage Facility</span>
      <span className={styles["add-manage-doctor"]} onClick={editdoctors}>
        Add/Manage Doctor
      </span>
      <div className={styles["edit"]} />
      <div className={styles["full-table"]}>
        <div className={styles["table"]}>
          <div className={styles["header"]}>
            <div className={styles["cell"]}>
              <div className={styles["row-cell"]}>
                <div className={styles["facility-icon"]} />
                <div className={styles["text"]}>
                  <span className={styles["primary-text"]}>Facility</span>
                </div>
              </div>
            </div>
            <div className={styles["cell-1"]}>
              <div className={styles["row-cell-2"]}>
                <div className={styles["file-note-edit"]}>
                  <div className={styles["vector-1"]} />
                </div>
                <div className={styles["text-3"]}>
                  <span className={styles["primary-text-4"]}>
                    Edit Facility <br />
                    Information
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["cell-5"]}>
              <div className={styles["row-cell-6"]}>
                <div className={styles["file-note-edit-7"]}>
                  <div className={styles["vector-8"]} />
                </div>
                <div className={styles["text-9"]}>
                  <span className={styles["primary-text-a"]}>
                    Manage <br />
                    Rooms
                  </span>
                </div>
              </div>
            </div>

            <div className={styles["cell-b"]}>
              <div className={styles["row-cell-c"]}>
                <div className={styles["interface-check-circle"]}>
                  <div className={styles["icon-frame"]} />
                </div>
                <div className={styles["text-d"]}>
                  <span className={styles["primary-text-e"]}>
                    Remove <br />
                    Facility
                  </span>
                </div>
              </div>
            </div>
          </div>

          {activeFacilities.length > 0 ? activeFacilities.map((facility, index) => (
            <div
              key={facility.facility_id}
              className={styles[`${index % 2 === 0 ? "row" : "row-1b"}`]}
            >
              <div className={styles["cell-f"]}>
                <div className={styles["row-cell-10"]}>
                  <div className={styles["text-11"]}>
                    <span className={styles["primary-text-12"]}>
                      {facility.name}
                      <br />
                      {facility.address1}
                      <br />
                      {facility.address2}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles["cell-13"]}>
                <div className={styles["row-cell-14"]}>
                  <button className={styles["icon-left"]}>
                    <span
                      className={styles["edit-information"]}
                      onClick={() => handleEdit(facility)}
                    >
                      Edit Information
                    </span>
                  </button>
                </div>
              </div>
              <div className={styles["cell-15"]}>
                <div className={styles["row-cell-16"]}>
                  <button className={styles["icon-left-17"]}>
                    <span
                      className={styles["edit-availability"]}
                      onClick={() => handleRoomClick(facility.facility_id)}
                    >
                      Edit Availability
                    </span>
                  </button>
                </div>
              </div>

              <div className={styles["cell-18"]}>
                <div className={styles["row-cell-19"]}>
                  <button className={styles["icon-left-1a"]}>
                    <span
                      className={styles["remove"]}
                      onClick={() => handleRemoveClick(facility.facility_id)}
                    >
                      Remove
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
          <div className = {styles["no-facilities-message"]}>No Facilities Found</div>
          )}
          {showConfirmationRemove && facilityToBeRemoved && (
            <div className={styles["pop-up-remove"]}>
              <div className={styles["bench-accounting-nvzvopqwg-unsplash"]} />
              {!removalSuccess ? (
                <>
                  <div className={styles["remove-information"]}>
                    <span className={styles["are-you-sure-wish-remove"]}>
                      Are you sure you wish to remove <br />
                    </span>
                    <span className={styles["holy-cross-hospital"]}>
                      {facilityToBeRemoved.name}
                    </span>
                    <span className={styles["unknown"]}>?</span>
                  </div>
                  <button className={styles["remove-button-1"]}>
                    <div className={styles["remove-buttAon-2"]}>
                      <span
                        className={styles["remove-facility"]}
                        onClick={handleRemoveConfirm}
                      >
                        Remove Facility
                      </span>
                      <div className={styles["rectangle-3"]} />
                    </div>
                  </button>
                  <button className={styles["cancel-button"]}>
                    <div className={styles["cancel-button-4"]}>
                      <span
                        className={styles["cancel-button-5"]}
                        onClick={handleRemoveCancelBefore}
                      >
                        Cancel
                      </span>
                      <div className={styles["rectangle-6"]} />
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <div className={styles["remove-information"]}>
                    <span className={styles["holy-cross-hospital"]}>
                      {facilityToBeRemoved.name}
                    </span>
                    <span className={styles["are-you-sure-wish-remove"]}>
                      <br />
                      was successfully removed from the company. <br />
                    </span>
                  </div>

                  <button className={styles["close-button"]}>
                    <div className={styles["cancel-button-4"]}>
                      <span
                        className={styles["cancel-button-5"]}
                        onClick={handleRemoveCancelAfter}
                      >
                        Close
                      </span>
                      <div className={styles["rectangle-6"]} />
                    </div>
                  </button>
                </>
              )}
            </div>
          )}

          {showRooms && facilityToBeEditRoom && (
            <div className={styles["pop-up-remove-rooms"]}>
              <div className={styles["frame-1-rooms"]}>
                <div className={styles["date-filter-rooms"]}>
                  <span className={styles["label-rooms"]}>Date</span>

                  <input
                    className={styles["date-input"]}
                    type="date"
                    id="date"
                    min = {new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div className={styles["available-rooms-rooms"]}>
                  <div className={styles["frame-2-rooms"]}>
                    <div className={styles["frame-3-rooms"]}>
                      <div className={styles["available-room-rooms"]}>
                        <div className={styles["group-4-rooms"]}>
                          <span className={styles["available-rooms-5-rooms"]}>
                            Available Rooms
                          </span>
                          <div className={styles["rectangle-6-rooms"]}></div>
                        </div>
                        <div className={styles["group-7-rooms"]}></div>
                        <div className={styles["frame-8-rooms"]}>
                          <div className={styles["group-9-rooms"]}>
                            <div className={styles["group-a-rooms"]}>
                              {availableRooms.map((room) => (
                                <span  key={room}
                                className={styles[`${selectedAvailableRoom ===room? "item-selected": "item"}`]}
                                onClick={() => setSelectedAvailableRoom(room)}>
                                  {room}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles["frame-b-rooms"]}>
                        <div className={styles["button-rooms"]}>
                          <div className={styles["button-c-rooms"]}>
                            <span className={styles["button-d-rooms"]}onClick={moveToUnavailable} disabled={selectedAvailableRoom === null}>
                              &gt;&gt;
                            </span>
                            <div className={styles["rectangle-e-rooms"]}></div>
                          </div>
                        </div>
                        <div className={styles["button-left-rooms"]}>
                          <div className={styles["button-left-f-rooms"]}>
                            <span className={styles["button-left-10-rooms"]} onClick={moveToAvailable} disabled={selectedUnavailableRoom === null}>
                              &lt;&lt;
                            </span>
                            <div className={styles["rectangle-11-rooms"]}></div>
                          </div>
                        </div>
                      </div>
                      <div className={styles["selected-specialty-rooms"]}>
                        <div className={styles["group-12-rooms"]}>
                          <span className={styles["unavailable-rooms-rooms"]}>
                            Unavailable Rooms
                          </span>
                          <div className={styles["rectangle-13-rooms"]}></div>
                        </div>
                        <div className={styles["group-14-rooms"]}></div>
                        <div className={styles["frame-15-rooms"]}>
                          <div className={styles["group-16-rooms"]}>
                            <div className={styles["group-17-rooms"]}>
                            {unavailableRooms.map((room) => (
                                <span  key={room}
                                className={styles[`${selectedUnavailableRoom ===room? "item-selected": "item"}`]}
                                onClick={() => setSelectedUnavailableRoom(room)}>
                                  {room}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["group-18-rooms"]}>
                <div className={styles['message']}>
                  {submissionMsg && <div style={{ color: 'green' }}>{submissionMsg}</div>}
                  {errorSubmissionMsg && <div style={{ color: 'red' }}>{errorSubmissionMsg}</div>}
                </div>
                <button className={styles["save-availability-button-rooms"]}>
                  <div className={styles["save-availability-button-19-rooms"]}>
                    <span
                      className={styles["save-availability-button-1a-rooms"]}
                      onClick={handelSubmitManageRooms}
                    >
                      Save Availability
                    </span>
                    <div className={styles["rectangle-1b-rooms"]}></div>
                  </div>
                </button>
                <button className={styles["cancel-button-rooms"]}>
                  <div className={styles["cancel-button-1c-rooms"]}>
                    <span
                      className={styles["cancel-button-1d-rooms"]}
                      onClick={handleRoomCancel}
                    >
                      Cancel
                    </span>
                    <div className={styles["rectangle-1e-rooms"]}></div>
                  </div>
                </button>
              </div>
              <span className={styles["manage-rooms-rooms"]}>Manage Rooms</span>
            </div>
          )}
        </div>
      </div>
      <span className={styles["add-manage-facility-span"]}>
        Add/Manage Facility
      </span>
      <div className={styles["edit-29"]}></div>
    </div>
  );
}
