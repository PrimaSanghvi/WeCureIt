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
import './DoctorHomePage.css'
import axios from "axios";
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';


function DoctorHomePage() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
	const currentDate = dayjs();
	const [today, setToday] = useState(currentDate);
	const [selectDate, setSelectDate] = useState(currentDate);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const { doctorId } = useParams(); 
  const [selectedDateSchedule, setSelectedDateSchedule] = useState(null);

   
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
  }, [selectDate, doctorId]);


useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const todayResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/appointments/today/`);
        // Process today's appointments and add additional fields as needed
        const processedTodaysAppointments = todayResponse.data.map(appointment => ({
          ...appointment,
          // You can add additional processing if needed, for example:
          Completed: false,  // Assume false if undefined
          // Link the medical info to a UI element or another page
          PatientMedicalInformation: "Medical Info",  // This should be replaced with actual logic
        }));
        
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
  const [colDefs, setColDefs] = useState([
    
    { field: 'PatientName', headerName: 'Patient Name', minWidth: 10 },
    { field: 'DateTime', headerName: 'Date & Time', minWidth: 70, maxWidth: 150 },
    {
      field: 'PatientMedicalInformation',
      headerName: 'Medical Info',
      minWidth: 120,
      cellRenderer: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          Medical History
        </a>
      ),
    },
    {
      field: 'Completed',
      headerName: 'Completed',
      cellRendererFramework: CheckboxCellRenderer, // Use the wrapper component here
      minWidth: 120,
    },
  ]);
  

  const [colDefsup, setColDefsup] = useState([
    { field: "PatientName", minWidth: 10},
    { field: "DateTime", minWidth: 70, maxWidth: 150 },
    {
      field: 'PatientMedicalInformation',
      headerName: 'Medical Info',
      minWidth: 120,
      cellRenderer: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          Medical History
        </a>
      ),
    },
    { field: "Location", minWidth: 120}
  ]);

  const [colDefsLoc, setColDefsLoc] = useState([
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
    [window],
  );


  return (
    <div className='main-container'>
      <div className='section'>
          <div className='topBar'>
            <span>WeCureIT</span>
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
        {selectedDateSchedule[0].visiting_hours_end} - {selectedDateSchedule[0].visiting_hours_start}
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
      <button className="viewSchdl" onClick={() => window.location.href = "./LoginPage"}>
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
        <button className="viewAppoint" onClick={"./LoginPage"}><label className="text-15">View all appointments</label></button>
        </div>
        <div className="appointmentinfo">
  {todaysAppointments && todaysAppointments.length > 0 ? (
    <div className="wrapper">
      {console.log(todaysAppointments)}
      <div style={containerStyle} className="ag-theme-quartz">
        <AgGridReact
          rowData={todaysAppointments}
          columnDefs={colDefs} // Ensure colDefs matches the structure of your API response
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