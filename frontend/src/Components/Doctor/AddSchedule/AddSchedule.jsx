import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from './AddSchedule.module.css';
import logo from '/src/assets/images/Logo.png';
import profile from '/src/assets/images/profile.png';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

function CustomNoRowsOverlay() {
  return (
    <div className={styles['custom-no-rows-overlay']}>
      <span><b>No available dates</b></span><br></br>
      <span>Please click on 'Add Schedule' to add your availbility</span>
    </div>
  );
}
function CustomNoRowsOverlayFacility() {
  return (
    <div className={styles['custom-no-rows-overlay']}>
      <span><b>No selected facilities</b></span><br></br>
      <span>Please click on 'Add Facilities and Specialities' to add facilities</span>
    </div>
  );
}
function CustomNoRowsOverlaySpecialities() {
  return (
    <div className={styles['custom-no-rows-overlay']}>
      <span><b>No selected Specialities</b></span><br></br>
      <span>Please click on 'Add Facilities and Specialities' to add specialties</span>
    </div>
  );
}
// Custom header component with icon and text
const CustomHeaderComponent = ({ text, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={icon} alt="Icon" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
    <span>{text}</span>
  </div>
);

function AddSchedule() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState({});
  const [selectedEndTime, setSelectedEndTime] = useState({});
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]); // Separate state for specialties
  const [selectedFacilities, setSelectedFacilities] = useState([]); // Separate state for facilities
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Update filtered data whenever selectedFromDate or selectedToDate or selectedDays changes
    filterData();
  }, [selectedFromDate, selectedToDate, selectedDays]);

  const filterData = () => {
    const fromDate = new Date(selectedFromDate);
    const toDate = new Date(selectedToDate);

    // Filter rowData to include only rows with days matching the selectedDays
    const filteredRows = rowData.filter(row => {
      const rowDate = new Date(row.fromDate);
      return selectedDays.some(day => {
        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
        return rowDate.getDay() === dayIndex;
      });
    });
    setFilteredData(filteredRows);
  };

  const handleDayChange = (day) => {
    const isSelected = selectedDays.includes(day);
    if (isSelected) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
      delete selectedTime[day];
      delete selectedEndTime[day];
    } else {
      setSelectedDays([...selectedDays, day]);
      setSelectedTime({ ...selectedTime, [day]: '' });
      setSelectedEndTime({ ...selectedEndTime, [day]: '' });
    }
  };
  const handleSpecialtiesChange = (newSpecialties) => {
    setSelectedSpecialties(newSpecialties);
  };
  const handleConfirmFacilitiesSpecialties = () => {
    console.log('Selected Facilities:', selectedFacilities);
    console.log('Selected Specialties:', selectedSpecialties);
    // Add your logic to handle the confirmation of facilities and specialties here
  };

  const handleTimeChange = (day, time, isStartTime) => {
    if (isStartTime) {
      setSelectedTime({ ...selectedTime, [day]: time });
    } else {
      setSelectedEndTime({ ...selectedEndTime, [day]: time });
    }
  };

  const handleConfirm = () => {
    const selectedDayData = selectedDays.map(day => ({
      day,
      startTime: selectedTime[day] || '',
      endTime: selectedEndTime[day] || '',
      fromDate: selectedFromDate,
      toDate: selectedToDate,
    }));
    setRowData(prevRowData => [...prevRowData, ...selectedDayData]);
    console.log('Selected Days Data:', selectedDayData);
    clearSelections();
  };
  

  const clearSelections = () => {
    setSelectedDays([]);
    setSelectedTime({});
    setSelectedEndTime({});
    setSelectedFromDate('');
    setSelectedToDate('');
    console.log('Selections cleared');
  };

  const removeRow = (rowData) => {
    setRowData(prevRowData => prevRowData.filter(row => row !== rowData));
  };

  const getRowStyle = (params) => {
    return params.node.rowIndex % 2 === 0 ? { background: 'white' } : { background: '#eeeeff' };
  };

  const addRowToGrid = () => {
    const newRow = {
      days: selectedDays.join(', '),
      starttime: selectedDays.map(day => selectedTime[day] || '').join(', '),
      endtime: selectedDays.map(day => selectedEndTime[day] || '').join(', '),
      fromDate: selectedFromDate,
      toDate: selectedToDate
    };
    console.log('New Row:', newRow); // Log the new row
    setRowData(prevRowData => [...prevRowData, newRow]);
  };
  console.log('rowData:', rowData);
  const columnDefs = [
    { headerName: 'Days', field: 'day', headerClass: `${styles['custom-header']}` },
    { headerName: 'Start Time', field: 'startTime', headerClass: `${styles['custom-header']}` },
    { headerName: 'End Time', field: 'endTime', headerClass: `${styles['custom-header']}` },
    { headerName: 'From Date', field: 'fromDate', headerClass: `${styles['custom-header']}` },
    { headerName: 'To Date', field: 'toDate', headerClass: `${styles['custom-header']}` },
    {
      headerName: 'Remove',
      headerClass: styles['custom-header'],
      cellRenderer: (params) => {
        return <button onClick={() => removeRow(params.data)} className={styles['removebutton']}>Remove</button>;
      }
    },
  ];

  const options = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'internal_medicine', label: 'Internal Medicine' },
    { value: 'obgyn', label: 'Obstetrics and Gynecology (OB/GYN)' },
  ];

  const options2 = [
    { value: 'gwu', label: 'George Washington University' },
    { value: 'holycross', label: 'Holy Cross Hospital' },
  ];

  return (
    <div className={styles['main-container']}>
      <div className='section'>
        <div className={styles['topBar']}>
          <img src={logo} alt="WeCureIt" className={styles['logo']} />
          <span className={styles['logoTitle']}>WeCureIT</span>
          <div className={styles['tabs']}>
            <button className={styles['tab1']}>View/Add Schedule</button>
            <button className={styles['tab2']}>View Appointment</button>
          </div>
          <div>
            <button className={styles['profile']}><img src={profile} alt="WeCureIt" className='profilepic' /></button>
          </div>
        </div>
      </div>
      <div className={styles['main-container2']}>
        <Popup trigger={<button className={styles['button1']}>Add Schedule</button>} modal nested>
          {close => (
            <div className={styles['popbox']}>
              <div className={styles['title']}><span>Add the Following Days You Will Be Available</span></div>
              <div className={styles['inputcont1']}>
                <span className={styles['text-5']}>From Date</span>
                <input
                  className={styles['inputbox']}
                  placeholder='YYYY-MM-DD'
                  type='date'
                  value={selectedFromDate}
                  onChange={(e) => setSelectedFromDate(e.target.value)} />
              </div>
              <div className={styles['inputcont2']}>
                <span className={styles['text-5']}>To Date</span>
                <input
                  className={styles['inputbox']}
                  placeholder='YYYY-MM-DD'
                  type='date'
                  value={selectedToDate}
                  onChange={(e) => setSelectedToDate(e.target.value)} />
              </div>
              <table className={styles['table']}>
                <thead>
                  <tr>
                    <th className={styles['cols text-3']}>+</th>
                    <th className={styles['cols text-3']}>Days available</th>
                    <th className={styles['cols text-3']}>Start Time</th>
                    <th className={styles['cols text-3']}>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <tr key={day}>
                      <td className={styles['cols']}>
                        <input
                          type="checkbox"
                          id={day}
                          checked={selectedDays.includes(day)}
                          onChange={() => handleDayChange(day)} />
                      </td>
                      <td className={styles['cols']} htmlFor={day}>{day}</td>
                      <td className={styles['cols']}>
                        {selectedDays.includes(day) && (
                          <select
                            id={`${day}-startTimeSelect`}
                            value={selectedTime[day] || ''}
                            onChange={(e) => handleTimeChange(day, e.target.value, true)}
                          >
                            <option value="">Select</option>
                            {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`).map((time, index) => (
                              <option key={index} value={time}>{time}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className={styles['cols']}>
                        {selectedDays.includes(day) && (
                          <select
                            id={`${day}-endTimeSelect`}
                            value={selectedEndTime[day] || ''}
                            onChange={(e) => handleTimeChange(day, e.target.value, false)}
                          >
                            <option value="">Select</option>
                            {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`).map((time, index) => (
                              <option key={index} value={time}>{time}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={styles['button5']} onClick={handleConfirm}><label>Confirm</label></button>
              <button className={styles['button4']} onClick={() => close()}><label>Cancel</label></button>
            </div>
          )}
        </Popup>
        <Popup trigger={<button className={styles['button2']}>Add Facilities & Specialties</button>} modal nested>
          {close => (
            <div className={styles['popbox']}>
              <div className={styles['title']}><span>Add the Specialties & Facilities You Wish to Practice and Visit</span></div>
              <div className={styles['box1']}>
                <span className={styles['text-3']}></span>
                <div className={styles['header']}>
                  <span className={styles['text-3']}>Available Specialities</span>
                </div>
                <div className={styles['header2']}>
                  <span className={styles['text-3']}> Selected Specialities</span>
                </div>
                <div>
                  <DualListBox
                    className={styles['listbox']}
                    options={options} preserveSelectOrder
                    selected={selectedSpecialties} // Update to selectedSpecialties
                    onChange={handleSpecialtiesChange} />
                </div>
              </div>
              <div className={styles['box-2']}>
                <br />
                <div className={styles['header']}>
                  <span className={styles['text-3']}>Available Facilities</span>
                </div>
                <div className={styles['header2']}>
                  <span className={styles['text-3']}> Selected Facilities</span>
                </div>
                <div>
                  <DualListBox
                    className={styles['listbox2']}
                    options={options2} preserveSelectOrder
                    selected={selectedFacilities} // Update to selectedFacilities
                    onChange={(newValue) => setSelectedFacilities(newValue)} />
                </div>
              </div>
              <button className={styles['button5']} onClick={handleConfirmFacilitiesSpecialties}><label>Confirm</label></button>
              <button className={styles['button4']} onClick={() => close()}><label>Cancel</label></button>
            </div>
          )}
        </Popup>
      </div>
      <div className={styles['main-container3']}>
        <div
          className="ag-theme-alpine"
          style={{ height: '300px', width: '1150px', justifyContent: 'center', marginLeft: '12%', marginTop: '4%', scale:'100%'}}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            getRowStyle={getRowStyle}
            noRowsOverlayComponent={CustomNoRowsOverlay} // Custom overlay component
          />
        </div>
      </div>
      <div className={styles['main-container4']}>
        <div className={styles['main-conatiner5']}>
          <div
            className="ag-theme-alpine"
            style={{ height: '300px', width: '400px', justifyContent: 'center', marginLeft: '50%', marginTop: '4%' }}
          >
            <AgGridReact
              rowData={selectedFacilities.map(facility => ({ facility }))} // Separate data for facilities
              columnDefs={[
                { headerName: 'Facility', field: 'facility', headerClass: `${styles['custom-header']}` },
                {
                  headerName: 'Remove',
                  field: 'remove',
                  headerClass: `${styles['custom-header']}`,
                  cellRenderer: (params) => {
                    return <button onClick={() => removeRow(params.data)} className={styles['removebutton']}>Remove</button>;
                  }
                },
              ]}
              getRowStyle={getRowStyle}
              noRowsOverlayComponent={CustomNoRowsOverlayFacility} // Custom overlay component
            />
          </div>
        </div>
        <div className={styles['main-conatiner6']}>
          <div
            className="ag-theme-alpine"
            style={{ height: '300px', width: '400px', justifyContent: 'center', marginLeft: '550px', marginTop: '4%' }}
          >
            <AgGridReact
              rowData={selectedSpecialties.map(specialty => ({ speciality: specialty.label }))} // Separate data for specialties
              columnDefs={[
                { headerName: 'Specialities', field: 'speciality', headerClass: `${styles['custom-header']}` },
                {
                  headerName: 'Remove',
                  field: 'remove',
                  headerClass: `${styles['custom-header']}`,
                  cellRenderer: (params) => {
                    return <button onClick={() => removeRow(params.data)} className={styles['removebutton']}>Remove</button>;
                  }
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
