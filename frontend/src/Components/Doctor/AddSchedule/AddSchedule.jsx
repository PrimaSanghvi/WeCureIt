import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import styles from "./AddSchedule.module.css";
import logo from "../../../assets/images/Logo.png";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CustomNoRowsOverlay() {
  return (
    <div className={styles["custom-no-rows-overlay"]}>
      <span>
        <b>No available dates</b>
      </span>
      <br></br>
      <span>Please click on 'Add Schedule' to add your availbility</span>
    </div>
  );
}
function CustomNoRowsOverlayFacility() {
  return (
    <div className={styles["custom-no-rows-overlay"]}>
      <span>
        <b>No selected facilities</b>
      </span>
      <br></br>
      <span>
        Please click on 'Add Facilities and Specialities' to add facilities
      </span>
    </div>
  );
}
function CustomNoRowsOverlaySpecialities() {
  return (
    <div className={styles["custom-no-rows-overlay"]}>
      <span>
        <b>No selected Specialities</b>
      </span>
      <br></br>
      <span>
        Please click on 'Add Facilities and Specialities' to add specialties
      </span>
    </div>
  );
}
// Custom header component with icon and text
// eslint-disable-next-line
const CustomHeaderComponent = ({ text, icon }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src={icon}
      alt="Icon"
      style={{ marginRight: "5px", width: "20px", height: "20px" }}
    />
    <span>{text}</span>
  </div>
);

function AddSchedule() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState({});
  const [selectedEndTime, setSelectedEndTime] = useState({});
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  // init the selected facilities to set a default value for the dualbox list
  const [initSelectedFacilities, setInitSelectedFacilities] = useState([]);
  const [initSelectedSpecialties, setInitSelectedSpecialties] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]); // Separate state for specialties
  // const [selectedFacilities, setSelectedFacilities] = useState([]); // Separate state for facilities
  const [rowData, setRowData] = useState([]);
  // eslint-disable-next-line
  const [filteredData, setFilteredData] = useState([]);

  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const { doctorId } = useParams();
  const specialtyUrl = `http://127.0.0.1:8000/api/speicaltiesForDoctor/?doctor_id=${doctorId}`;
  const doctorSchedulesUrl = `http://127.0.0.1:8000/api/doctorSchedules/?doctor_id=${doctorId}`;
  const doctorFacilitiesUrl = `http://127.0.0.1:8000/api/doctorFacility/?doctor_id=${doctorId}`;
  const doctorSpecialtiesUrl = `http://127.0.0.1:8000/api/doctorSpecialty/?doctor_id=${doctorId}`;

  useEffect(() => {
    // Fetch the doctor schedules
    fetch(doctorSchedulesUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          doctor_id: doctorId,
          day: item.days_visiting,
          startTime: item.visiting_hours_start,
          endTime: item.visiting_hours_end,
          toDate: item.to_date,
          fromDate: item.from_date,
        }));
        setScheduleList(formattedOptions);
      })
      .catch((error) =>
        console.error("Error fetching specialties data: ", error)
      );
    // Fetch the doctor facilities
    fetch(doctorFacilitiesUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          facility: item.name,
        }));
        setInitSelectedFacilities(formattedOptions);
        const tempData = formattedOptions.map((item) => item.facility);
        setSelectedFacilities(tempData);
      })
      .catch((error) =>
        console.error("Error fetching specialties data: ", error)
      );
    // Fetch the doctor facilities
    fetch(doctorSpecialtiesUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          speciality: item.name,
        }));
        setInitSelectedSpecialties(formattedOptions);
        const tempData = formattedOptions.map((item) => item.speciality);
        setSelectedSpecialties(tempData);
      })
      .catch((error) =>
        console.error("Error fetching specialties data: ", error)
      );
    // Fetch specialties
    fetch(specialtyUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          id: item.speciality_id,
          value: item.name, // Assuming the identifier is 'id'
          label: item.name, // Assuming the display name is 'name'
        }));
        setOptions(formattedOptions);
      })
      .catch((error) =>
        console.error("Error fetching specialties data: ", error)
      );

    // Fetch facilities
    fetch("http://127.0.0.1:8000/api/facilities/")
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          id: item.facility_id,
          value: item.name, // Assuming the identifier is 'id'
          label: item.name, // Assuming the display name is 'name'
        }));
        setOptions2(formattedOptions);
      })
      .catch((error) =>
        console.error("Error fetching facilities data: ", error)
      );
  }, []);
  useEffect(() => {
    // Update filtered data whenever selectedFromDate or selectedToDate or selectedDays changes
    filterData();
    // eslint-disable-next-line
  }, [selectedFromDate, selectedToDate, selectedDays]);

  const filterData = () => {
    // eslint-disable-next-line
    const fromDate = new Date(selectedFromDate);
    // eslint-disable-next-line
    const toDate = new Date(selectedToDate);

    // Filter rowData to include only rows with days matching the selectedDays
    const filteredRows = rowData.filter((row) => {
      const rowDate = new Date(row.fromDate);
      return selectedDays.some((day) => {
        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(day);
        return rowDate.getDay() === dayIndex;
      });
    });
    setFilteredData(filteredRows);
  };

  const handleDayChange = (day) => {
    const isSelected = selectedDays.includes(day);
    if (isSelected) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
      delete selectedTime[day];
      delete selectedEndTime[day];
    } else {
      setSelectedDays([...selectedDays, day]);
      setSelectedTime({ ...selectedTime, [day]: "" });
      setSelectedEndTime({ ...selectedEndTime, [day]: "" });
    }
  };
  const handleSpecialtiesChange = (newSpecialties) => {
    setSelectedSpecialties(newSpecialties);
  };
  const handleConfirmFacilitiesSpecialties = () => {
    const initfacilitiesTemp = initSelectedFacilities.map(item => item.facility);
    const initspecialtiesTemp = initSelectedSpecialties.map(item => item.speciality);

    const specialtiesToAdd = selectedSpecialties.filter(s => !initspecialtiesTemp.includes(s));
    const specialtiesToRemove = initspecialtiesTemp.filter(s => !selectedSpecialties.includes(s));

    // Determine facilities changes
    const facilitiesToAdd = selectedFacilities.filter(f => !initfacilitiesTemp.includes(f));
    const facilitiesToRemove = initfacilitiesTemp.filter(f => !selectedFacilities.includes(f));


    const selectedFacilityIdsAdd = options2
      .filter((option) => {
        const isMatch = facilitiesToAdd.some((selectedFacility) => {
          const match =
            selectedFacility.trim().toLowerCase() ===
            option.label.trim().toLowerCase();
          console.log(
            `Comparing Facility: ${selectedFacility
              .trim()
              .toLowerCase()} to ${option.label
              .trim()
              .toLowerCase()} - Match: ${match}`
          );
          return match;
        });
        return isMatch;
      })
      .map((option) => option.id);

      const selectedFacilityIdsDelete = options2
      .filter((option) => {
        const isMatch = facilitiesToRemove.some((selectedFacility) => {
          const match =
            selectedFacility.trim().toLowerCase() ===
            option.label.trim().toLowerCase();
          console.log(
            `Comparing Facility: ${selectedFacility
              .trim()
              .toLowerCase()} to ${option.label
              .trim()
              .toLowerCase()} - Match: ${match}`
          );
          return match;
        });
        return isMatch;
      })
      .map((option) => option.id);

    const selectedSpecialtyIdsAdd = options
      .filter((option) => {
        const isMatch = specialtiesToAdd.some((selectedSpecialty) => {
          const match =
            selectedSpecialty.trim().toLowerCase() ===
            option.label.trim().toLowerCase();
          console.log(
            `Comparing Specialty: ${selectedSpecialty
              .trim()
              .toLowerCase()} to ${option.label
              .trim()
              .toLowerCase()} - Match: ${match}`
          );
          return match;
        });
        return isMatch;
      })
      .map((option) => option.id);

      const selectedSpecialtyIdsDelete = options
      .filter((option) => {
        const isMatch = specialtiesToRemove.some((selectedSpecialty) => {
          const match =
            selectedSpecialty.trim().toLowerCase() ===
            option.label.trim().toLowerCase();
          console.log(
            `Comparing Specialty: ${selectedSpecialty
              .trim()
              .toLowerCase()} to ${option.label
              .trim()
              .toLowerCase()} - Match: ${match}`
          );
          return match;
        });
        return isMatch;
      })
      .map((option) => option.id);
    console.log("the facility id to add is", selectedFacilityIdsAdd);
    console.log("the specialty id to add is", selectedSpecialtyIdsAdd);

    selectedFacilityIdsAdd.forEach(facility =>{
      axios.post(`http://127.0.0.1:8000/api/doctorSchedule/addfacility/`,{
        doctor_id: doctorId,
        facility_id: facility,
      });
    });
    selectedSpecialtyIdsAdd.forEach(specialty =>{
      axios.post(`http://127.0.0.1:8000/api/doctorSchedule/addspecialty/`,{
        doctor_id: doctorId,
        speciality_id: specialty,
      });
    });
    // addSpecialtiesToDoctorSchedule(doctorId, selectedSpecialtyIdsAdd);

    console.log("the facility id to remove is", selectedFacilityIdsDelete);
    console.log("the specialty id to remove is", selectedSpecialtyIdsDelete);
    selectedFacilityIdsDelete.forEach(facility => {
      axios.delete(`http://127.0.0.1:8000/api/doctorSchedule/removefacility/`, {
        data: {
          doctor_id: doctorId,
          facility_id: facility
        }
      })
      .then(response => console.log("Delete response:", response))
      .catch(error => console.error("Delete error:", error));
    });
    // Delete the specialties not selected
    selectedSpecialtyIdsDelete.forEach(specialty => {
      axios.delete(`http://127.0.0.1:8000/api/doctorSchedule/removeSpecialty/`, {
        data: {
          doctor_id: doctorId,
          speciality_id: specialty
        }
      })
      .then(response => console.log("Delete response:", response))
      .catch(error => console.error("Delete error:", error));
    });

    window.location.reload();
  };

  

  const handleTimeChange = (day, time, isStartTime) => {
    if (isStartTime) {
      setSelectedTime({ ...selectedTime, [day]: time });
    } else {
      setSelectedEndTime({ ...selectedEndTime, [day]: time });
    }
  };

  const handleConfirm = () => {
    // console.log("debug this shit", initSelectedFacilities);
    // console.log("debug this", selectedFacilities);
    const selectedDayData = selectedDays.map((day) => ({
      day,
      startTime: selectedTime[day] || "",
      endTime: selectedEndTime[day] || "",
      fromDate: selectedFromDate,
      toDate: selectedToDate,
    }));
    setRowData((prevRowData) => [...prevRowData, ...selectedDayData]);
    const doctorSchedule = selectedDayData.map((data) => ({
      doctor_id: doctorId,
      days_visiting: data.day,
      visiting_hours_start: data.startTime,
      visiting_hours_end: data.endTime,
      to_date: data.toDate,
      from_date: data.fromDate,
    }));
    console.log("data to post", doctorSchedule);
    // Function to send POST request for each schedule entry
    const sendSchedule = async (schedule) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/doctorSchedule/addtime/",
          schedule
        );
        console.log("Success:", response.data);
        return response.data; // Return data for further processing if needed
      } catch (error) {
        console.error("Error posting schedule:", error);
        throw error; // Rethrow to handle in bulk later
      }
    };

    // Use Promise.all to manage multiple requests
    Promise.all(doctorSchedule.map((schedule) => sendSchedule(schedule)))
      .then((results) => {
        console.log("All schedules processed:", results);
        // Here you could update state or UI to reflect successful submission
        window.location.reload();
      })
      .catch((error) => {
        console.error(
          "An error occurred with one of the schedule submissions:",
          error
        );
        // Handle error, possibly retry failed requests or notify user
      });
  };

  // eslint-disable-next-line
  const clearSelections = () => {
    setSelectedDays([]);
    setSelectedTime({});
    setSelectedEndTime({});
    setSelectedFromDate("");
    setSelectedToDate("");
    console.log("Selections cleared");
  };

  const removeRow = async (rowData) => {
    setRowData((prevRowData) => prevRowData.filter((row) => row !== rowData));
    const requestUrl = "http://localhost:8000/api/doctorSchedule/removetime/"; // Your API endpoint URL
    const requestBody = {
      doctor_id: doctorId, // Ensure `doctorId` is available in the scope or pass it as needed
      day_to_remove: rowData.day,
    };
    try {
      const response = await axios.delete(requestUrl, { data: requestBody });
      console.log("Row deleted successfully", response.data);
      // Optionally update rowData state to remove the row from the grid
      setRowData((currentRowData) =>
        currentRowData.filter((row) => row.day !== rowData.day)
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete row", error);
      // Handle errors appropriately
    }
  };

  const removeRowFacility = (facilityData) => {
    // Find the ID using the facility name
    const facility = options2.find(
      (option) => option.label === facilityData.facility
    );

    if (facility) {
      axios
        .delete(`http://127.0.0.1:8000/api/doctorSchedule/removefacility/`, {
          data: {
            doctor_id: doctorId, // Assume the doctor_id is known or retrieved from state/context
            facility_id: facility.id,
          },
        })
        .then((response) => {
          console.log("Facility removed successfully", response.data);
          setSelectedFacilities((currentFacilities) =>
            currentFacilities.filter((item) => item !== facilityData.facility)
          );
          // Update the UI here, e.g., removing the facility from the list shown in the grid
          window.location.reload();
        })
        .catch((error) => {
          console.error("Failed to remove facility", error);
          // Handle errors here, e.g., showing an error message to the user
        });
    } else {
      console.error("Facility not found in options");
      // Handle the case where the facility ID could not be found
    }
  };

  const removeRowSpecialty = (specialtyData) => {
    // Find the ID using the facility name
    const specialty = options.find(
      (option) => option.label === specialtyData.speciality
    );
    console.log("the selected spe is", specialty);
    if (specialty) {
      axios
        .delete(`http://127.0.0.1:8000/api/doctorSchedule/removeSpecialty/`, {
          data: {
            doctor_id: doctorId, // Assume the doctor_id is known or retrieved from state/context
            speciality_id: specialty.id,
          },
        })
        .then((response) => {
          console.log("Specialty removed successfully", response.data);
          // Update the UI here, e.g., removing the facility from the list shown in the grid
          setSelectedSpecialties((currentSpecialties) =>
            currentSpecialties.filter(
              (item) => item !== specialtyData.speciality
            )
          );
          window.location.reload();
        })
        .catch((error) => {
          console.error("Failed to remove facility", error);
          // Handle errors here, e.g., showing an error message to the user
        });
    } else {
      console.error("Facility not found in options");
      // Handle the case where the facility ID could not be found
    }
  };

  const getRowStyle = (params) => {
    return params.node.rowIndex % 2 === 0
      ? { background: "white" }
      : { background: "#eeeeff" };
  };

  // eslint-disable-next-line
  const addRowToGrid = () => {
    const newRow = {
      days: selectedDays.join(", "),
      starttime: selectedDays.map((day) => selectedTime[day] || "").join(", "),
      endtime: selectedDays.map((day) => selectedEndTime[day] || "").join(", "),
      fromDate: selectedFromDate,
      toDate: selectedToDate,
    };
    console.log("New Row:", newRow); // Log the new row
    setRowData((prevRowData) => [...prevRowData, newRow]);
  };
  console.log("rowData:", rowData);
  const columnDefs = [
    {
      headerName: "Days",
      field: "day",
      headerClass: `${styles["custom-header"]}`,
    },
    {
      headerName: "Start Time",
      field: "startTime",
      headerClass: `${styles["custom-header"]}`,
    },
    {
      headerName: "End Time",
      field: "endTime",
      headerClass: `${styles["custom-header"]}`,
    },
    {
      headerName: "From Date",
      field: "fromDate",
      headerClass: `${styles["custom-header"]}`,
    },
    {
      headerName: "To Date",
      field: "toDate",
      headerClass: `${styles["custom-header"]}`,
    },
    {
      headerName: "Remove",
      headerClass: styles["custom-header"],
      cellRenderer: (params) => {
        return (
          <button
            onClick={() => removeRow(params.data)}
            className={styles["removebutton"]}
          >
            Remove
          </button>
        );
      },
    },
  ];

  const navigate = useNavigate();
  // const { doctorId } = useParams();
  const navigateToAppiontments = () => {
    navigate(`/doctorHomepage/${doctorId}/viewappointment`);
  };
  const navigateHome = () => {
    navigate(`/doctorHomepage/${doctorId}`);
  };

  const todayDate = new Date();
  todayDate.setDate(1);
  todayDate.setMonth(todayDate.getMonth() + 2);

  return (
    <div className={styles["main-container"]}>
      <div className="section">
        <div className={styles["topBar"]}>
          <img src={logo} alt="WeCureIt" className={styles["logo"]} />
          <span className={styles["logoTitle"]}>WeCureIT</span>
          <div className={styles["tabs"]}>
            <button className={styles["tab1"]} onClick={navigateHome}>
              Home Page
            </button>
            <button className={styles["tab2"]} onClick={navigateToAppiontments}>
              View Appointment
            </button>
          </div>
          <div className="profile">
            <div className="dropdown">
              <FontAwesomeIcon
                icon={faUserCircle}
                size="3x"
                style={{ marginTop: "-6px" }}
              />
              <div className="dropdown-content">
                <a href="/">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["main-container2"]}>
        <Popup
          trigger={<button className={styles["button1"]}>Add Schedule</button>}
          modal
          nested
        >
          {(close) => (
            <div className={styles["popbox"]}>
              <div className={styles["title"]}>
                <span>Add the Following Days You Will Be Available</span>
              </div>
              <div className={styles["inputcont1"]}>
                <span className={styles["text-5"]}>From Date</span>
                <input
                  className={styles["inputbox"]}
                  placeholder="YYYY-MM-DD"
                  type="date"
                  value={selectedFromDate}
                  min={todayDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedFromDate(e.target.value)}
                />
              </div>
              <div className={styles["inputcont2"]}>
                <span className={styles["text-5"]}>To Date</span>
                <input
                  className={styles["inputbox"]}
                  placeholder="YYYY-MM-DD"
                  type="date"
                  value={selectedToDate}
                  min={todayDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedToDate(e.target.value)}
                />
              </div>
              <table className={styles["table"]}>
                <thead>
                  <tr>
                    <th className={styles["cols text-3"]}>+</th>
                    <th className={styles["cols text-3"]}>Days available</th>
                    <th className={styles["cols text-3"]}>Start Time</th>
                    <th className={styles["cols text-3"]}>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <tr key={day}>
                      <td className={styles["cols"]}>
                        <input
                          type="checkbox"
                          id={day}
                          checked={selectedDays.includes(day)}
                          onChange={() => handleDayChange(day)}
                        />
                      </td>
                      <td className={styles["cols"]} htmlFor={day}>
                        {day}
                      </td>
                      <td className={styles["cols"]}>
                        {selectedDays.includes(day) && (
                          <select
                            id={`${day}-startTimeSelect`}
                            value={selectedTime[day] || ""}
                            onChange={(e) =>
                              handleTimeChange(day, e.target.value, true)
                            }
                          >
                            <option value="">Select</option>
                            {Array.from(
                              { length: 24 },
                              (_, i) => `${i.toString().padStart(2, "0")}:00`
                            ).map((time, index) => (
                              <option key={index} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className={styles["cols"]}>
                        {selectedDays.includes(day) && (
                          <select
                            id={`${day}-endTimeSelect`}
                            value={selectedEndTime[day] || ""}
                            onChange={(e) =>
                              handleTimeChange(day, e.target.value, false)
                            }
                          >
                            <option value="">Select</option>
                            {Array.from(
                              { length: 24 },
                              (_, i) => `${i.toString().padStart(2, "0")}:00`
                            ).map((time, index) => (
                              <option key={index} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={styles["button5"]} onClick={handleConfirm}>
                <label>Confirm</label>
              </button>
              <button className={styles["button4"]} onClick={() => close()}>
                <label>Cancel</label>
              </button>
            </div>
          )}
        </Popup>
        <Popup
          trigger={
            <button className={styles["button2"]}>
              Add Facilities & Specialties
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className={styles["popbox"]}>
              <div className={styles["title"]}>
                <span>
                  Add the Specialties & Facilities You Wish to Practice and
                  Visit
                </span>
              </div>
              <div className={styles["box1"]}>
                <span className={styles["text-3"]}></span>
                <div className={styles["header"]}>
                  <span className={styles["text-3"]}>
                    Available Specialities
                  </span>
                </div>
                <div className={styles["header2"]}>
                  <span className={styles["text-3"]}>
                    {" "}
                    Selected Specialities
                  </span>
                </div>
                <div>
                  <DualListBox
                    className={styles["listbox"]}
                    options={options}
                    preserveSelectOrder
                    selected={selectedSpecialties} // Update to selectedSpecialties
                    onChange={handleSpecialtiesChange}
                  />
                </div>
              </div>
              <div className={styles["box-2"]}>
                <br />
                <div className={styles["header"]}>
                  <span className={styles["text-3"]}>Available Facilities</span>
                </div>
                <div className={styles["header2"]}>
                  <span className={styles["text-3"]}> Selected Facilities</span>
                </div>
                <div>
                  <DualListBox
                    className={styles["listbox2"]}
                    options={options2}
                    preserveSelectOrder
                    selected={selectedFacilities} // Update to selectedFacilities
                    onChange={(newValue) => setSelectedFacilities(newValue)}
                  />
                </div>
              </div>
              <button
                className={styles["button5"]}
                onClick={handleConfirmFacilitiesSpecialties}
              >
                <label>Confirm</label>
              </button>
              <button className={styles["button4"]} onClick={() => close()}>
                <label>Cancel</label>
              </button>
            </div>
          )}
        </Popup>
      </div>
      <div className={styles["main-container3"]}>
        <div
          className="ag-theme-alpine"
          style={{
            height: "300px",
            width: "1150px",
            justifyContent: "center",
            marginLeft: "12%",
            marginTop: "4%",
            scale: "100%",
          }}
        >
          <AgGridReact
            rowData={scheduleList}
            columnDefs={columnDefs}
            getRowStyle={getRowStyle}
            noRowsOverlayComponent={CustomNoRowsOverlay} // Custom overlay component
          />
        </div>
      </div>
      <div className={styles["main-container4"]}>
        <div className={styles["main-conatiner5"]}>
          <div
            className="ag-theme-alpine"
            style={{
              height: "300px",
              width: "400px",
              justifyContent: "center",
              marginLeft: "50%",
              marginTop: "4%",
            }}
          >
            <AgGridReact
              rowData={initSelectedFacilities}
              columnDefs={[
                {
                  headerName: "Facilities",
                  field: "facility",
                  headerClass: `${styles["custom-header"]}`,
                },
                {
                  headerName: "Remove",
                  field: "remove",
                  headerClass: `${styles["custom-header"]}`,
                  cellRenderer: (params) => {
                    return (
                      <button
                        onClick={() => removeRowFacility(params.data)}
                        className={styles["removebutton"]}
                      >
                        Remove
                      </button>
                    );
                  },
                },
              ]}
              getRowStyle={getRowStyle}
              noRowsOverlayComponent={CustomNoRowsOverlayFacility}
            />
          </div>
        </div>
        <div className={styles["main-conatiner6"]}>
          <div
            className="ag-theme-alpine"
            style={{
              height: "300px",
              width: "400px",
              justifyContent: "center",
              marginLeft: "550px",
              marginTop: "4%",
            }}
          >
            <AgGridReact
              rowData={initSelectedSpecialties} // Separate data for specialties
              columnDefs={[
                {
                  headerName: "Specialities",
                  field: "speciality",
                  headerClass: `${styles["custom-header"]}`,
                },
                {
                  headerName: "Remove",
                  field: "remove",
                  headerClass: `${styles["custom-header"]}`,
                  cellRenderer: (params) => {
                    return (
                      <button
                        onClick={() => removeRowSpecialty(params.data)}
                        className={styles["removebutton"]}
                      >
                        Remove
                      </button>
                    );
                  },
                },
              ]}
              getRowStyle={getRowStyle}
              noRowsOverlayComponent={CustomNoRowsOverlaySpecialities} // Custom overlay component
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSchedule;
