import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";

import dayjs from "dayjs";
// import { createRoot } from 'react-dom/client';
import {AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { generateDate, months } from "./calendar";
import cn from "./cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import './CalView.css';
import logo from '../../../src/assets/images/Logo.png';
import './DoctorHomePage.css'
import axios from "axios";
import { useParams , useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function DoctorHomePage() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
	const currentDate = dayjs();
	const [today, setToday] = useState(currentDate);
	const [selectDate, setSelectDate] = useState(currentDate);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const { doctorId } = useParams(); 
  const [selectedDateSchedule, setSelectedDateSchedule] = useState(null);

  const navigate = useNavigate();

  // fix the page navigation 
  
  const navigateToAppiontments = () => {
    navigate(`/doctorHomepage/${doctorId}/viewappointment`);
  };
 const navigateToAddschedule= () => {
    navigate(`/doctorHomepage/${doctorId}/addschedule`);
  };
   
  const fetchScheduleForSelectedDate = async (selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd'); // Format the date as required by your backend
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/schedule/${formattedDate}`);
      
      setSelectedDateSchedule(response.data); // Assuming the response data has the schedule info
    } catch (error) {
      console.error("Error fetching schedule for selected date:", error);
      setSelectedDateSchedule(null);
    }
  };
  useEffect(() => {
    fetchScheduleForSelectedDate(selectDate.toDate());
    // eslint-disable-next-line
  }, [selectDate, doctorId]);


useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const todayResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/appointments/today/`);
        // Process today's appointments and add additional fields as needed
        const processedTodaysAppointments = todayResponse.data.map((appointment, index) => {
          return {
              ...appointment,
              Completed: false, // Assume false if undefined
              PatientMedicalInformation: appointment, // This should be replaced with actual logic
          };
      });
        
        setTodaysAppointments(processedTodaysAppointments); // Set the processed data
  
        // Repeat for upcoming appointments
        const upcomingResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/appointments/upcoming/`);
        // Process the upcoming appointments in a similar way if needed
        const processedUpcomingAppointments = upcomingResponse.data.map(appointment => ({
          ...appointment,
          // Additional processing for upcoming appointments
        }));
        
        setUpcomingAppointments(processedUpcomingAppointments); // Set the processed data
  
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setTodaysAppointments([]); // If there's an error, set as an empty array
        setUpcomingAppointments([]); // Same here for upcoming appointments
      }
    };
  
    fetchAppointments();
  }, [doctorId]); // Re-fetch if doctorId changes
  
  const rowStyle = { background: '#e7e7ff', height: '74'};
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const getRowStyle = params => {
    if (params.node.rowIndex % 2 === 0){
      return { backgroung: '#e7e7ff'}
    }
  }

  // eslint-disable-next-line
  const CheckboxCellRenderer = ({ params }) => {
    const [isChecked, setIsChecked] = useState(params.value); // Initialize state based on params
    console.log("inside");
    const handleChange = () => {
      // Toggle the checked state
      setIsChecked(!isChecked);
      // Optionally, update the parent component state or make an API call to save the change
      params.context.handleCheckboxChange(params.data.appointment_id, !isChecked);
    };
  
    return (
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange} // Update state when checkbox is toggled
        onClick={(e) => e.stopPropagation()} // Prevent AG Grid from capturing the event
      />
    );
  };
  
  // Column Definitions: Defines & controls grid columns.
  // eslint-disable-next-line
  const [colDefs, setColDefs] = useState([
    { field: "PatientName", minWidth: 95, maxWidth: 100},
    { field: "DateOnly", headerName: "Date", minWidth: 70, maxWidth: 150 },
    { field: "TimeOnly", headerName: "Time", minWidth: 130, maxWidth: 190},
    {
      field: 'PatientMedicalInformation',
      headerName: 'Medical Info',
      minWidth: 100,
      maxWidth: 150,
      cellRenderer: (params) => {
        const patientId = params.value.patient_id; 
        console.log("params:",params.value);
        const handleClick = () => {
          
        
        navigate(`/doctorHomepage/${patientId}/medical_info/`, {
          state: {
            data1: params.data.PatientName, 
            data2: params.data.patient_id, 
            data3: doctorId,
            data4: params.data.speciality_id,
            data5: params.data.facility_id,
          },
        });
      };
          return (
            
              // eslint-disable-next-line
              <a target="_blank" rel="noopener noreferrer" onClick={handleClick}>
                Medical History
              </a>
            
            //<Link to={{ pathname: `/doctorHomepage/${atientId}/medical_info/`,
           
                        
              
          );
      },
    }
    // {
    //   field: 'Completed',
    //   headerName: 'Completed',
    //   cellRendererFramework: CheckboxCellRenderer, // Use the wrapper component here
    //   minWidth: 120,
    // }
  ]);
  

  // eslint-disable-next-line
  const [colDefsup, setColDefsup] = useState([
    { field: "PatientName", minWidth: 10},
    { field: "DateOnly", headerName: "Date", minWidth: 100, maxWidth: 150 },
    { field: "TimeOnly", headerName: "Time", minWidth: 130, maxWidth: 190},
    // { field: "DateTime", minWidth: 70, maxWidth: 150 },
    // {
    //   field: 'PatientMedicalInformation',
    //   headerName: 'Medical Info',
    //   minWidth: 120,
    //   cellRenderer: (params) => (
    //     <a href={params.value} target="_blank" rel="noopener noreferrer">
    //       Medical History
    //     </a>
    //   )
    // },
    { field: "Location", minWidth: 120}
  ]);

  
  
  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);
  
  const onGridSizeChanged = useCallback(
    (params) => {
      // get the current grids width
      var gridWidth = document.querySelector(".ag-body-viewport").clientWidth;
      // keep track of which columns to hide/show
      var columnsToShow = [];
      var columnsToHide = [];
      // iterate over all columns (visible or not) and work out
      // now many columns can fit (based on their minWidth)
      var totalColsWidth = 0;
      var allColumns = params.api.getColumns();
      if (allColumns && allColumns.length > 0) {
        for (var i = 0; i < allColumns.length; i++) {
          var column = allColumns[i];
          totalColsWidth += column.getMinWidth() || 0;
          if (totalColsWidth > gridWidth) {
            columnsToHide.push(column.getColId());
          } else {
            columnsToShow.push(column.getColId());
          }
        }
      }
      // show/hide columns based on current grid width
      params.api.setColumnsVisible(columnsToShow, true);
      params.api.setColumnsVisible(columnsToHide, false);
      // wait until columns stopped moving and fill out
      // any available space to ensure there are no gaps
      window.setTimeout(() => {
        params.api.sizeColumnsToFit();
      }, 10);
    },
    // eslint-disable-next-line
    [window],
  );


  return (
    <div className='main-container'>
      <div className='section'>
          <div className='topBar'>
            <img src={logo} alt="WeCureIt" className='logo'/>
            <span className='logoTitle'>WeCureIT</span>
            <div className="tabs">
              <button className="tab1" onClick={navigateToAddschedule}>View/Add Schedule</button>
              <button className="tab2" onClick={navigateToAppiontments}>View Appointment</button>
            </div>
            {/* <div>
              <button className="profile"><img src={profile} alt="WeCureIt" className='profilepic'/></button>
            </div> */}
          <div  className='profile'>
                  <div className='dropdown'>
                        <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ marginTop: '-6px' }}/>
                        <div className='dropdown-content'>
                          <a href="/">Logout</a>
                        </div>
                      </div>
                    </div>
          </div>
      </div>
      <div className='main-container1'>
        <div className="text-3">
          <span>{months[today.month()]} {[today.date()]}, {today.year()}</span>
        </div>
        <div className="calendar1">
          <div className="CalendarCont">
            <div className="header">
                <h1 className="h1">
                {months[today.month()]}, {today.year()}
                </h1>
                <div className="header2">
                <GrFormPrevious
							className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
							onClick={() => {
								setToday(today.month(today.month() - 1));
							}}
						/>
                        <h1
							className=" currentDate hover:scale-105 transition-all"
							onClick={() => {
								setToday(currentDate);
							}}
						>
							Today
						</h1>
                        <GrFormNext
							className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
							onClick={() => {
								setToday(today.month(today.month() + 1));
							}}
						/>
                </div>
            </div>
            <div className="daySec">
                {days.map((day, index) => {
                            return (
                                <span
                                    key={index}
                                    className="day"
                                >
                                    {day}
                                </span>
                            );
                        })}
            </div>
            <div className="daySec2">
            {generateDate(today.month(), today.year()).map(
						({ date, currentMonth, today }, index) => {
							return (
								<div
									key={index}
									className="dateBlock"
								>
									<div
										className={cn(
											currentMonth ? "" : "date text-black",
											today
												? "bg-red-600"
												: "",
											selectDate
												.toDate()
												.toDateString() ===
												date.toDate().toDateString()
												? "bg-black"
												: "",
											"date"
										)}
										onClick={() => {
											setSelectDate(date);
										}}
									>
										{date.date()}
									</div>
								</div>
							);
						}
					)}
            </div>

        </div>
        </div>
        <div className="locInfo">
  {selectedDateSchedule ? (
    <>
      <span className='text-11'>
        Your Schedule for {format(selectDate.toDate(), 'PP')}
        <br /><br />
      </span>
      <span className='text-12'>
        {selectedDateSchedule[0].visiting_hours_start} - {selectedDateSchedule[0].visiting_hours_end}
        <br /><br />
      </span>
  {(selectedDateSchedule[0].facility_name || selectedDateSchedule[0].address) && (
        <>
          <span className='text-13'>Location: <br /><br/></span>
          {selectedDateSchedule[0].facility_name && (
            <span className='text-14'>
              {selectedDateSchedule[0].facility_name}
            </span>
          )}
          <br />
          {selectedDateSchedule[0].address && (
            <span className='text-14'>
              {selectedDateSchedule[0].address}
            </span>
          )}
          <br />
        </>
      )}
      <button className="viewSchdl" onClick={navigateToAddschedule}>
        <label className="text-15">View Schedule</label>
      </button>
    </>
  ) 
  : (
    <p>No schedule available for {format(selectDate.toDate(), 'PP')}</p>
  )}
</div>

      </div>
      <div className='main-container2'>
        <div className='text-1'>Today's Appointment
        <button className="viewAppoint" onClick={navigateToAppiontments}><label className="text-15">View all appointments</label></button>
        </div>
        <div className="appointmentinfo">
  {todaysAppointments && todaysAppointments.length > 0 ? (
     <div className="wrapper">
     <div style={containerStyle} className={"ag-theme-quartz"}>
         <AgGridReact 
           rowData={todaysAppointments} 
           columnDefs={colDefs}
           rowStyle={rowStyle}
           getRowClass={getRowStyle}
           autoSizeStrategy={autoSizeStrategy}
           onGridSizeChanged={onGridSizeChanged}
         />
       </div>
   </div>
  ) : (
    <p className="no-appointments">No Appointments Today!</p>
  )}
</div>

        <div className="text-2">Upcoming Appointments</div>
        <div className="nextappointment">
          {upcomingAppointments && upcomingAppointments.length > 0 ? ( 
             <div className="wrapper">
            <div style={containerStyle} className={"ag-theme-quartz"}>
                <AgGridReact 
                  rowData={upcomingAppointments} 
                  columnDefs={colDefsup}
                  rowStyle={rowStyle}
                  getRowClass={getRowStyle}
                  autoSizeStrategy={autoSizeStrategy}
                  onGridSizeChanged={onGridSizeChanged}
                />
              </div>
          </div>
          ) : (
          <p className="no-appointments">No Upcoming Appointments!</p>)}
      
        </div> 
      </div>
    </div>
    
  )
}

export default DoctorHomePage
