import React, { useState, useEffect } from "react";
import styles from "./UserAppointment.module.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function UserAppointment() {
  const { patientId } = useParams();
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const[selectedDoctorId, setSelectedDoctorId] = useState();
  // eslint-disable-next-line
  const[selectedFacilityId, setSelectedFacilityId] = useState();
  // eslint-disable-next-line
  const[selectedSpecialityId, setSelectedSpecialityId] = useState();

  const[selectedScheduleDoctorId, setSelectedScheduleDoctorId] = useState();
  const[selectedScheduleFacilityId, setSelectedScheduleFacilityId] = useState();
  const[selectedScheduleSpecialityId, setSelectedScheduleSpecialityId] = useState();


  const [timeSlots, setAvailableTimeSlot] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/specialties/")
      .then((response) => response.json())
      .then((data) => setSpecialties(data))
      .catch((error) => console.error("Error fetching data: ", error));
    fetch("http://127.0.0.1:8000/api/doctorlist/")
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error("Error fetching data: ", error));
    fetch("http://127.0.0.1:8000/api/facilities/")
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  

  const handleChangeSpecilty = (event) => {
    const index = event.target.selectedIndex;
    const specialityId = event.target.options[index].getAttribute('data-id');
    setSelectedSpecialty(event.target.value);
    setSelectedSpecialityId(specialityId);
  };

  const handleChangeFacility = (event) => {
    const index = event.target.selectedIndex;
    const facilityId = event.target.options[index].getAttribute('data-id');
    setSelectedFacility(event.target.value);
    setSelectedFacilityId(facilityId);
  };

  const handleChangeDoctor = (event) => {
    const index = event.target.selectedIndex;
    const doctorId = event.target.options[index].getAttribute('data-id');
    setSelectedDoctor(event.target.value);
    setSelectedDoctorId(doctorId);
  };

  const handleChangeDate = (event) => {
    const newDate = event.target.value; // in YYYY-MM-DD format
    setSelectedDate(newDate);
  };
  // Get upcoming dates within the next two weeks for given visiting days

  const [schedules, setSchedules] = useState([]);

  const handleSubmit = () => {
    console.log(selectedSpecialty);
    console.log(selectedFacility);
    console.log(selectedDoctor);
    console.log(selectedDate);
    // Construct the query parameters based on user selection
    const queryParams = new URLSearchParams();

    if (selectedSpecialty) {
      queryParams.append("speciality_name", selectedSpecialty);
    }
    if (selectedFacility) {
      queryParams.append("facility_name", selectedFacility);
    }
    if (selectedDoctor) {
      queryParams.append("doctor_name", selectedDoctor);
    }
    if (selectedDate) {
      queryParams.append("date", selectedDate);
    }

    console.log("doctor",selectedDoctorId)
    // Construct the full URL with query parameters
    const requestURL = `http://127.0.0.1:8000/api/findAvailableSchedule/?${queryParams.toString()}`;
    
    // Send the request to the API
    fetch(requestURL)
      .then((response) => response.json())
      .then((data) => setSchedules(data))
      .catch((error) => console.error("Error fetching data: ", error));

  };

  // now look up the facility obj for every facility_name field and map the text field to the obj.
  function replaceFacilityNameWithObject(listKey, objDict) {
    // Create a map from list2 for quick lookup
    const facilitiesMap = new Map(objDict.map((fac) => [fac.name, fac]));
    // Map over list1 and replace the facilityName with the full facility object from list2
    const updatedList1 = listKey.map((schedule) => ({
      ...schedule,
      facilityObj: facilitiesMap.get(schedule.facility), // Replace facilityName with the facility object
      facility: undefined,
    }));
    return updatedList1;
  }

 
  const scheduleList = replaceFacilityNameWithObject(schedules, facilities);

  // when clicking on a specific row, add that row to the selected schedule.
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  // judge if there should be a pop up page
  const [showPopup, setShowPopup] = useState(false);

  // click on a row and add this row to the selected schedule
  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedScheduleDoctorId(schedule.doctor_id)
    setSelectedScheduleFacilityId(schedule.facilityObj.facility_id);
    setSelectedScheduleSpecialityId(schedule.speciality_id);  // Assuming specialityId is correct

    console.log("setSelectedScheduleDoctorId", schedule.doctor_id);
    console.log("setSelectedScheduleFacilityId", schedule.facilityObj.facility_id);
    console.log("setSelectedScheduleSpecialityId", schedule.speciality_id);
    
    setShowPopup(true);
   
  };

  const formatDate = (dateStr) => {
    const parts = dateStr.split('-'); // Split the date by '-'
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Reformat to DD/MM/YYYY
};
const formatTime12Hour = (time24) => {
  const [hour, minute] = time24.split(':');
  const hourAsNumber = parseInt(hour, 10);
  const suffix = hourAsNumber >= 12 ? 'PM' : 'AM';
  const formattedHour = ((hourAsNumber + 11) % 12 + 1);  // Convert 24h to 12h format
  return `${formattedHour}:${minute} ${suffix}`;
};
const createTimeSlots = (data) => {
  if (!data || data.length === 0) return [];
  const slots = data[0].available_slots.map(slot => {
      const startTime = formatTime12Hour(slot.start);
      const endTime = formatTime12Hour(slot.end);
      return `${startTime} - ${endTime}`;
  });
  console.log(slots);
  return slots;

};
  // the time length for the user to choose
  const [timeLengthValue, setTimeLengthValue] = useState(); 
  const [timeLength, setTimeLength] = useState(null);
  const timeLengthList = [
    { timeLength: "15 min" },
    { timeLength: "30 min" },
    { timeLength: "60 min" },
  ];
  // put the call schedule request here
  const formattedDate = formatDate(selectedDate);
  const handleChangeTimeLength =  async (event) => {
  const timeLengthValue = event.target.value.split(" ")[0];
  setTimeLengthValue(timeLengthValue);
  setTimeLength(event.target.value);
    const scheduleInfo = {
       date : formattedDate,
       appointment_length : timeLengthValue
    }
    if (selectedScheduleDoctorId) {
      scheduleInfo.doctor_id = selectedScheduleDoctorId;
  }
  
  if (selectedScheduleFacilityId) {
      scheduleInfo.facility_id = selectedScheduleFacilityId;
  }
  
  if (selectedScheduleSpecialityId) {
      scheduleInfo.speciality_id = selectedScheduleSpecialityId;
  }
    
    console.log(JSON.stringify(scheduleInfo))

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/available-appointment/', scheduleInfo);     
      setAvailableTimeSlot(createTimeSlots(response.data));
    
    } catch (error) {
      console.error("Error fetching schedule for selected date:", error);

    }
 
  };
 

  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

   
  const [showConfirm, setShowConfirm] = useState(false);
  const[recDoctorID,setRecDoctorID ] = useState("");
  const[recFacilityID, setRecFacilityID] = useState("");
  const[docName, setDocName] = useState("");
  const[facilityName, setFacilityName] = useState("");
  const[facilityAdd1, setFacilityAdd1] = useState("");
  const[facilityAdd2, setFacilityAdd2] = useState("");
  const[facilityCity, setFacilityCity] = useState("");
  const[facilityState, setFacilityState] = useState("");
  const[facilityZipCode, setFacilityZipCode] = useState("");

  const handleScheduleSubmit = async() => {
    // put your post schedule request here

  
    const formattedDate = formatDate(selectedDate);
   const recommendData = {
    date : formattedDate,
    time_slot : selectedTimeSlot,
    facility_id : selectedScheduleFacilityId,
    doctor_id : selectedScheduleDoctorId,
    speciality_id : selectedScheduleSpecialityId,
    appointment_length : timeLengthValue

   }
   try {
    console.log(JSON.stringify(recommendData))

    const response = await axios.post('http://127.0.0.1:8000/api/recommend-slot/', recommendData);
    console.log('Recommended Slot:', response.data.doctor_name);
    if (response.data && response.data.recommendations && response.data.recommendations.length > 0) 
    {
      const recommendation = response.data.recommendations[0]; // Access the first recommendation
  
      setDocName(recommendation.doctor_name)
      setFacilityName(recommendation.facility_name)
      setFacilityAdd1(recommendation.facility_addressLine1)
      setFacilityAdd2(recommendation.facility_addressLine2)
      setFacilityCity(recommendation.facility_city)
      setFacilityState(recommendation.facility_state)
      setFacilityZipCode(recommendation.facility_zipcode)
      setRecFacilityID(recommendation.facility_id)
      setRecDoctorID(recommendation.doctor_id);
      setShowConfirm(false)
      setShowPopup(false);
      setShowRecommendation(true); 
    }
    else
    {
      const appointmentData = {
        date : selectedDate,
        start_time : selectedTimeSlot,
        facility_id : selectedScheduleFacilityId,
        doctor_id : selectedScheduleDoctorId,
        speciality_id : selectedScheduleSpecialityId,
        patient_id : patientId
     }
     try {
     console.log(JSON.stringify(appointmentData))
      const response = await axios.post('http://127.0.0.1:8000/api/book-appointments/', appointmentData);
      console.log('Appointment Created:', response.data);
      setShowPopup(false);
      setShowConfirm(true);
      // clear the current status
      setTimeLength("");
      return response.data;
    }
    catch (error) {
      console.error('Error creating appointment:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to handle it according to your needs (e.g., show a message to the user)
    }
   }
  }
    catch (error) {
    console.error('Error creating appointment:', error.response ? error.response.data : error.message);
    throw error; // Re-throw to handle it according to your needs (e.g., show a message to the user)
  }

  };

  // close the pop-up page
  const handleCancelClick = () => {
    setShowPopup(false);
    setSelectedSchedule(null);
    setTimeLength(null);
    setSelectedTimeSlot("");
  };

  // close the confirmation page
  const handleCloseClick = () => {
    setShowConfirm(false);
    setRecShowConfirm(false);
    setSelectedSchedule(null);
    setSelectedTimeSlot("");
  };
  const [showRecommendation, setShowRecommendation] = useState(false);
  
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate(`/patientHomepage/${patientId}`);
  }

  const handleDeclineRecommendation = async() =>{
    setShowRecommendation(false);
   
    const appointmentData = {
      date : selectedDate,
      start_time : selectedTimeSlot,
      facility_id : selectedScheduleFacilityId,
      doctor_id : selectedScheduleDoctorId,
      speciality_id : selectedScheduleSpecialityId,
      patient_id : patientId
   }
   try {
   console.log(JSON.stringify(appointmentData))
    const response = await axios.post('http://127.0.0.1:8000/api/book-appointments/', appointmentData);
    console.log('Appointment Created:', response.data);
    setShowPopup(false);
    setShowConfirm(true);
    // clear the current status
    setTimeLength("");
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error.response ? error.response.data : error.message);
    throw error; // Re-throw to handle it according to your needs (e.g., show a message to the user)
  }

  }

  const[recShowConfirm, setRecShowConfirm] = useState(false);
  const handleAcceptRecommendation = async() =>{
    setShowRecommendation(false);
    const appointmentData = {
      date : selectedDate,
      start_time : selectedTimeSlot,
      facility_id : recFacilityID,
      doctor_id : recDoctorID,
      speciality_id : selectedScheduleSpecialityId,
      patient_id : patientId
   }
   try {
    console.log(JSON.stringify(appointmentData))
     const response = await axios.post('http://127.0.0.1:8000/api/book-appointments/', appointmentData);
     console.log('Appointment Created:', response.data);
     setShowPopup(false);
     setRecShowConfirm(true);
     setTimeLength("");
     //setShowRecommendation(false);
    // if u have a confirm page, clean the data in the confirm page
    //setSelectedSchedule("");
    //setSelectedTimeSlot("");
     return response.data;     
   } catch (error) {
     console.error('Error creating appointment:', error.response ? error.response.data : error.message);
     throw error; // Re-throw to handle it according to your needs (e.g., show a message to the user)
   }

  }

  return (
    <div  className={styles['main-container']}>
    <div  className={styles['top-bar']}>
     
      <div  className={styles['frame']}>
       
      <div className={styles['main-container2']}>
        <span className={styles['we-cure-it']}>WeCureIt</span>
        <div className={styles['vector99']} />
      </div>
        <div  className={styles['create-appointment-button']}>
          <button  className={styles['create-appointment-btn']} >
            <div  className={styles['frame-1']}>
              <span onClick={navigateHome}>
                Home Page
              </span>
            </div>
          </button>
        </div>
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

      <span className={styles["schedule-appointment"]}>
        Schedule Appointment
      </span>
      <div className={styles["flex-row-b"]}>
        <div className={styles["doctor-drop-down"]}>
          <span className={styles["doctor"]}>Doctor</span>
          <select
            className={styles["form-8"]}
            id="doctor-select"
            value={selectedDoctor}
            onChange={handleChangeDoctor}
          >
            <option value="">No Preference</option>
            {doctors.map((doctor) => (
              <option
                key={doctor.id}
                value={`${doctor.first_name} ${doctor.last_name}`}
                data-id={doctor.doctor_id}
              >
                {doctor.first_name} {doctor.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["date-drop-down"]}>
          <span className={styles["date"]}>Date</span>

          <input
            className={styles["form-2"]}
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleChangeDate}
          />
        </div>
        <div className={styles["facility-drop-down"]}>
          <span className={styles["facility"]}>Facility</span>
          <select
            className={styles["form-8"]}
            id="specialty-select"
            value={selectedFacility}
            onChange={handleChangeFacility}
          >
            <option value="">No Preference</option>
            {facilities.map((facility) => (
              <option key={facility.facility_id} value={facility.name} data-id={facility.facility_id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["specialty-drop-down"]}>
          <span className={styles["specialty"]}>Specialty</span>
          <select
            className={styles["form-8"]}
            id="specialty-select"
            value={selectedSpecialty}
            onChange={handleChangeSpecilty}
          >
            <option value="">Select a Specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.name} data-id={specialty.specialty_id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["search-button"]}>
          <button className={styles["search-button-c"]}>
            <div className={styles["frame-d"]}>
              <span className={styles["search"]} onClick={handleSubmit}>
                Search
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className={styles["upcoming-appointment-table"]}>
        <div className={styles["table"]}>
          <div className={styles["header"]}>
            <div className={styles["date-e"]}>
              <div className={styles["date-f"]}>
                <div className={styles["date-icon"]}>
                  <div className={styles["date-icon-10"]} />
                </div>
                <div className={styles["text"]}>
                  <span className={styles["primary-text"]}>Date</span>
                </div>
              </div>
            </div>
            <button className={styles["button"]}>
              <div className={styles["doctor-11"]}>
                <div className={styles["doctor-icon"]}>
                  <div className={styles["vector"]} />
                </div>
                <div className={styles["doctor-13"]}>
                  <span className={styles["doctor-text"]}>Doctor</span>
                </div>
              </div>
            </button>
            <div className={styles["specialty-14"]}>
              <div className={styles["specialty-15"]}>
                <div className={styles["specialty-icon"]}>
                  <div className={styles["vector-16"]} />
                </div>
                <div className={styles["specialty-text"]}>
                  <span className={styles["specialty-text-17"]}>Specialty</span>
                </div>
              </div>
            </div>
            <div className={styles["facility-18"]}>
              <div className={styles["facility-19"]}>
                <div className={styles["facility-icon"]} />
                <div className={styles["facility-1a"]}>
                  <span className={styles["primary-text-1b"]}>Facility</span>
                </div>
              </div>
            </div>
          </div>

          {scheduleList.map((schedule, index) => (
            <div
              className={styles[`${index % 2 === 0 ? "row" : "row-2b"}`]}
              onClick={() => handleScheduleClick(schedule)}
            >
              <div className={styles["date-1c"]}>
                <div className={styles["date-1d"]}>
                  <div className={styles["date-1e"]}>
                    <span className={styles["date-text"]}>{schedule.date}</span>
                  </div>
                </div>
              </div>
              <div className={styles["doctor-1f"]}>
                <div className={styles["doctor-20"]}>
                  <div className={styles["doctor-21"]}>
                    <span className={styles["doctor-text-22"]}>
                      {schedule.doctor}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles["specialty-23"]}>
                <div className={styles["specialty-24"]}>
                  <div className={styles["specialty-25"]}>
                    <span className={styles["specialty-text-26"]}>
                      {schedule.specialty}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles["facility-27"]}>
                <div className={styles["facility-28"]}>
                  <div className={styles["facility-29"]}>
                    <span className={styles["facility-2a"]}>
                      {schedule.facilityObj["name"]}
                      <br />
                      {schedule.facilityObj["addressLine1"]}
                      <br />
                      {schedule.facilityObj["addressLine2"]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPopup && selectedSchedule && (
        <div className={styles["pop-up"]}>
          <span className={styles["schedule-new-appointment"]}>
            Schedule New Appointment for {selectedSchedule.date}
          </span>
          <div className={styles["specialty-pop"]}>
            <span className={styles["specialty-1"]}>Specialty</span>
            <div className={styles["form-pop"]}>
              <div className={styles["text-wrap-pop"]}>
                <span className={styles["cardiology"]}>
                  {selectedSchedule.specialty}
                </span>
              </div>
            </div>
          </div>
          <div className={styles["time"]}>
            <span className={styles["time-2"]}>Time</span>
            <div className={styles["form-3"]}>
              {!timeLength ? (
                <span className={styles["select-appointment-length"]}>
                  Please select an appointment length first.
                </span>
              ) : (
                <>
                  {timeSlots.map((timeSlot, index) => (
                    <label key={index}>
                      <input
                        type="radio"
                        value={timeSlot}
                        checked={selectedTimeSlot === timeSlot}
                        onChange={handleTimeSlotChange}
                      />
                      {timeSlot}
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className={styles["facility-pop"]}>
            <span className={styles["facility-4"]}>Facility</span>
            <button className={styles["form-5"]}>
              <div className={styles["text-wrap-6"]}>
                <span className={styles["facility-selected"]}>
                  {selectedSchedule.facilityObj["name"]}
                </span>
              </div>
            </button>
          </div>
          <div className={styles["doctor-pop"]}>
            <span className={styles["doctor-7"]}>Doctor</span>
            <div className={styles["form-8-pop"]}>
              <div className={styles["text-wrap-9"]}>
                <span className={styles["doctor-selected"]}>
                  {selectedSchedule.doctor}
                </span>
              </div>
            </div>
          </div>
          <div className={styles["appointment-length-drop-down"]}>
            <span className={styles["appointment-length"]}>
              Appointment Length
            </span>
            <select
              className={styles["form-8"]}
              id="timelength-select"
              value={timeLength}
              onChange={handleChangeTimeLength}
            >
              <option value="">Not Selected</option>
              {timeLengthList.map((timeLength) => (
                <option
                  key={timeLength.timeLength}
                  value={timeLength.timeLength}
                >
                  {timeLength.timeLength}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["rectangle"]}>
            <span
              className={styles["cancel-button"]}
              onClick={handleCancelClick}
            >
              Cancel
            </span>
          </div>
          <div className={styles["rectangle-c"]}>
            <span className={styles["confirm"]} onClick={handleScheduleSubmit}>
              Confirm
            </span>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className={styles["pop-up-remove"]}>
          <div className={styles["bench-accounting-nvzvopqwg-unsplash"]} />

          <div className={styles["remove-information"]}>
            <span className={styles["are-you-sure-wish-remove"]}>
              {selectedSchedule.date}
              <br />
              {selectedTimeSlot}
              <br />
              {selectedSchedule.doctor}
              <br />
              {selectedSchedule.specialty}
              <br />
              {selectedSchedule.facilityObj["name"]}
              <br />
              was successfully reserved! <br />
            </span>
          </div>
          <button className={styles["close-button"]}>
            <div className={styles["cancel-button-4"]}>
              <span
                className={styles["cancel-button-5"]}
                onClick={handleCloseClick}
              >
                Close
              </span>
              <div className={styles["rectangle-6"]} />
            </div>
          </button>
        </div>
      )}

{recShowConfirm && (
        <div className={styles["pop-up-remove"]}>
          <div className={styles["bench-accounting-nvzvopqwg-unsplash"]} />

          <div className={styles["remove-information"]}>
            <span className={styles["are-you-sure-wish-remove"]}>
              {selectedSchedule.date}
              <br />
              {selectedTimeSlot}
              <br />
              {docName}
              <br />
              {selectedSchedule.specialty}
              <br />
              {facilityName}
              <br />
            {facilityAdd1} {facilityCity} {facilityState} {facilityZipCode}
            <br/>
              was successfully reserved! <br />
            </span>
          </div>
          <button className={styles["close-button"]}>
            <div className={styles["cancel-button-4"]}>
              <span
                className={styles["cancel-button-5"]}
                onClick={handleCloseClick}
              >
                Close
              </span>
              <div className={styles["rectangle-6"]} />
            </div>
          </button>
        </div>
      )}

{showRecommendation && (
        <div className={styles["pop-up-recommendation"]}>
       
        <div className={styles["recommendation-information"]}>
          <span className={styles["recommendation-detail"]}>
            {selectedSchedule.date}
            <br />
            {selectedTimeSlot}
            <br />
            {"Dr. " + docName}
            <br />
            {facilityName}
            <br />
            {facilityAdd1}
            <br />
            {facilityAdd2} {facilityCity} {facilityState} {facilityZipCode}
            <br />
            Would you lke to select this appointment? <br />
          </span>
        </div>

        <div className={styles["rectangle-recommendation"]}>
            <span
              className={styles["cancel-button"]}
              onClick={handleDeclineRecommendation}
            >
              Decline
            </span>
          </div>
          <div className={styles["rectangle-recommendation-c"]}>
            <span className={styles["confirm"]} onClick={handleAcceptRecommendation}>
              Accept
            </span>
          </div>
       
      </div>
      )}

    </div>
  );
}
