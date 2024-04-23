import React, { useState, useEffect } from "react";
import styles from "./UserAppointment.module.css";

export default function UserAppointment() {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/specialties/")
      .then((response) => response.json())
      .then((data) => setSpecialties(data))
      .catch((error) => console.error("Error fetching data: ", error));
    fetch("http://127.0.0.1:8000/api/doctorlist/")
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error("Error fetching data: ", error));
    fetch("http://127.0.0.1:8000/api/allFacilityDetail/")
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);
  const handleChangeSpecilty = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const handleChangeFacility = (event) => {
    setSelectedFacility(event.target.value);
  };

  const handleChangeDoctor = (event) => {
    setSelectedDoctor(event.target.value);
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

    // Construct the full URL with query parameters
    const requestURL = `http://127.0.0.1:8000/api/findAvailableSchedule/?${queryParams.toString()}`;
    // Send the request to the API
    fetch(requestURL)
      .then((response) => response.json())
      .then((data) => setSchedules(data))
      .catch((error) => console.error("Error fetching data: ", error));
    // console.log(facilities);
    // console.log(scheduleList);
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
    setShowPopup(true);
    console.log(selectedSchedule);
  };

  // the time length for the user to choose
  const [timeLength, setTimeLength] = useState(null);
  const timeLengthList = [
    { timeLength: "15 min" },
    { timeLength: "30 min" },
    { timeLength: "60 min" },
  ];
  // put the call schedule request here
  const handleChangeTimeLength = (event) => {
    setTimeLength(event.target.value);
    // use selectedSchedule & timeLength to call the backend endpoint
  };

  // a temp list to show the option
  // just for display
  // please use your own timeslots from the endpoint
  const timeSlots = [
    "10:00 AM - 10:15 AM",
    "10:30 AM - 10:45 AM",
    "12:30 PM - 12:45 PM",
    "2:15 PM - 2:30 PM",
  ];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  // confirm the slot, put your post schedule request here
  /////
  /////
  const handleScheduleSubmit = () => {
    // put your post schedule request here
    setShowPopup(false);
    setShowConfirm(true);
    // clear the current status
    setTimeLength("");
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
    setSelectedSchedule(null);
    setSelectedTimeSlot("");
  };
  return (
    <div className={styles["main-container"]}>
      <div className={styles["top-bar"]}>
        <div className={styles["frame"]}>
          <div className={styles["main-container2"]}>
            <span className={styles["we-cure-it"]}>WeCureIt</span>
            <div className={styles["vector-cross"]} />
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
              <option key={facility.facility_id} value={facility.name}>
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
              <option key={specialty.id} value={specialty.name}>
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
                  {selectedSchedule.date}
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
    </div>
  );
}
