
import styles from "./AddSchedule.module.css";
import { useEffect,useState } from 'react';

export default function Main() {
  const [timePopup, settimePopup] = useState(false);
  const[EndDate,selectedEndDate] = useState("")
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedstartTime, setSelectedstartTime] = useState("");
  const [selectedendTime, setSelectedendTime] = useState("");
  const [isempty, setisempty] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [DateTimetoshowList, setDateTimetoshowList] = useState([])
  const [DateTimeList, setDateTimeList] = useState([
    
  ]);
  
  const handleDateChange = (event) => {
    const newDate = event.target.value; // in YYYY-MM-DD format
    setSelectedDate(newDate);
    // Reset room selection when date changes
  };
  const handleEndDateChange = (event) => {
    const newDate = event.target.value; // in YYYY-MM-DD format
    selectedEndDate(newDate);
    // Reset room selection when date changes
  };

  // Function to handle time selection
  const handlestartTimeChange = (event) => {
    setSelectedstartTime(event.target.value);
  };

  const handleendTimeChange = (event) => {
    setSelectedendTime(event.target.value);
  };

  const handlecancledate = ()=>{
    settimePopup(false);
  }


  const handleDayChange = (event) => {
    setSelectedDay(event.target.value); 
  };

  const convertDateFormat = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${month}/${day}/${year}`;
  };

  const handledateconfirm =()=>{
    const formattedStartDate = convertDateFormat(selectedDate);
    console.log("startdate:",formattedStartDate)
    console.log("enddate:",EndDate)
    console.log("starttime:",selectedstartTime)
    console.log("endtime:",selectedendTime)
    console.log("day:",selectedDay)
    setisempty(false)
    settimePopup(false)

  }

  
  useState(() => {
    if (DateTimeList.length > 0) {
      setisempty(false);
    }
  }, [DateTimeList]);

  const startD = '2024-04-13';
  const endD = '2024-04-26';


  const getDayOfWeek = (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [year, month, day] = dateString.split('-');
    // Month is zero-based, so we need to subtract 1
    const dateObj = new Date(year, month - 1, day); 
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date format';
    }
    const dayIndex = dateObj.getDay();
    return daysOfWeek[dayIndex];
  };
  console.log(getDayOfWeek('2024-04-12'));

  const daysWithDetails = [];
  {DateTimeList.map((item, index) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    
  
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const day = date.toDateString().split(' ')[0]; // Get the day of the week
      
      if(day === item.day){
        const d = date.getDate();
        const m = date.getMonth()+1;
        const y = date.getFullYear();
        daysWithDetails.push({
          Date: d.toString(),
          month: m.toString(),
          year: y.toString(),
          starttime: item.starttime,
          endtime: item.endtime,
          day: item.day
        });
        
      }
      console.log(daysWithDetails)
    }
    
  
    })}

  return (
    
    <div className={styles["main-container"]}>
      {isempty && (
        <><div className={styles["top-bar"]}>
          <div className={styles["top-bar-background"]} />

          <div className={styles["company-name-icon"]}>
            <span className={styles["we-cure-it"]}>WeCureIt</span>
            <div className={styles["medical-cross"]}>
              <div className={styles["group"]}>
                <div className={styles["vector"]} />
              </div>
            </div>
          </div>
          <div className={styles["profile"]}>
            <div className={styles["unsplash-ctagwpbqg"]} />
          </div>
          <div className={styles["tabs"]}>
            <span className={styles["view-add-schedule"]}>View/Add Schedule</span>
            <span className={styles["modify-schedule"]}>View Appointments</span>
          </div>
        </div>
        <div className={styles["frame-1"]}>
        {timePopup &&(
              <div className={styles["flex-row-cc"]}>
              <div className={styles["frame-2"]} />
              <div className={styles["pop-up-add-schedule"]}>
                <div className={styles["start-date"]}>
                  <span className={styles["specialty"]}>Start Date</span>
                  <input className={styles["rectangle"]} 
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                  
                </div>
                <div className={styles["end-date"]}>
                  <span className={styles["specialty-3"]}>End Date</span>
               
                  <input className={styles["rectangle-4"]} 
                    type="date"
                    id="date"
                    value={EndDate}
                    onChange={handleEndDateChange}
                  />
                 
                </div>
                <div className={styles["end-time"]}>
                  <span className={styles["end-time-6"]}>Day Preference</span>
                
                  <select className={styles["rectangle-7"]} id="dayDropdown"
                  value={selectedDay} onChange={handleDayChange} >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <span className={styles["add-days-available"]}>
                  Add the Following Days You Will Be Available
                </span>
                <div className={styles["group-buttons"]}>
                  <button className={styles["confirm-button"]}>
                    <span className={styles["confirm"]} onClick={handledateconfirm}>Confirm</span>
                    <div className={styles["rectangle-9"]} />
                  </button>
                  <button className={styles["cancel-button"]} onClick={handlecancledate}>
                    <div className={styles["cancel-button-a"]}>
                      <span className={styles["cancel-button-b"]}>Cancel</span>
                      <div className={styles["rectangle-c"]} />
                    </div>
                  </button>
                </div>
                
                <div className={styles["start-time"]}>
                  <span className={styles["start-time-d"]}>
                    Start Time
                    <br />
                  </span>
              
                  <input className={styles["rectangle-e"]}
                    type="time"
                    id="time"
                    value={selectedstartTime}
                    onChange={handlestartTimeChange}
                  />
                </div>
                <div className={styles["end-time-10"]}>
                  <span className={styles["end-time-11"]}>End Time</span>
                  
                  <input className={styles["rectangle-12"]}
                    type="time"
                    id="time"
                    value={selectedendTime}
                    onChange={handleendTimeChange}
                  />
                </div>
              </div>
            </div>
        )}
        <span className={styles["no-schedule"]}>No schedule created yet</span>
        <span className={styles["flex-row-f"]}>Let’s create your schedule!</span>
        <div className={styles["add-dates-button"]}>
          <div className={styles["rectangle-14"]}>
            <span className={styles["add-dates"]} onClick={()=>settimePopup(true)}>Add Dates</span>
            <div className={styles["rectangle-15"]} />
          </div>
          <div className={styles["add-specialties-button"]}>
            <span className={styles["add-specialties"]}>Add Specialties</span>
            <div className={styles["rectangle-16"]} />
          </div>
          <div className={styles["add-facilities-button"]}>
            <span className={styles["add-facilities"]}>Add Facilities</span>
            <div className={styles["rectangle-17"]} />
          </div>
        </div>
        </div>
        </>
      )}

      {!isempty &&(
        <><div className={styles["top-bar"]}>
          <div className={styles["top-bar-background"]} />
          
            <div className={styles["company-name-icon"]}>
              <span className={styles["we-cure-it"]}>WeCureIt</span>
              <div className={styles["medical-cross"]}>
                <div className={styles["group"]}>
                  <div className={styles["vector"]} />
                </div>
              </div>
            </div>
            <div className={styles["profile"]}>
              <div className={styles["unsplash-ctagwpbqg"]} />
            </div>
            <div className={styles["tabs"]}>
              <span className={styles["view-add-schedule"]}>View/Add Schedule</span>
              <span className={styles["modify-schedule"]}>View Appointments</span>
            </div>
          
        </div>
        <div className={styles["flex-row-a"]}>
            <div className={styles["rectangle-date"]}>
              <span className={styles["add-dates-date"]}>Add Dates</span>
            </div>
            <div className={styles["add-facilities-specialties"]}>
              <span className={styles["available-dates"]}>Add Facilities & Specialties</span>
            </div>
        </div>
        <div className={styles["header"]}>
            <div className={styles["cell"]}>
              <div className={styles["row-cell"]}>
                <div className={styles["date-icon"]}>
                  <div className={styles["text"]} />
                  <div className={styles["primary-text"]}>
                    <span className={styles["text-6"]}>Date</span>
                  </div>
                </div>
              </div>
              <div className={styles["cell-1"]}>
                <div className={styles["row-cell-2"]}>
                  <div className={styles["calendar-clock"]}>
                    <div className={styles["vector-3"]} />
                  </div>
                  <div className={styles["text-4"]}>
                    <span className={styles["primary-text-5"]}>Time</span>
                  </div>
                </div>
              </div>
              <div className={styles["cell-6"]}>
                <div className={styles["row-cell-7"]}>
                  <div className={styles["interface-close-circle"]}>
                    <div className={styles["icon-frame"]} />
                  </div>
                  <div className={styles["text-8"]}>
                    <span className={styles["primary-text-9"]}>Remove</span>
                  </div>
                </div>
              </div>
            </div>
            {daysWithDetails.map((dt,index)=>
              {const backgroundColors = ['white', '#eeeeff']; // Add more colors as needed

              // Select a background color based on the index
              const backgroundColor = backgroundColors[index % backgroundColors.length];
                return(
            <><div className={styles["row"]} style={{backgroundColor: backgroundColor}}>
              
                  <div className={styles["cell-a"]}>
                    <div className={styles["row-cell-b"]}>
                      <div className={styles["text-c"]}>
                        <span className={styles["primary-text-d"]}>
                          {dt.year}-{dt.month}-{dt.Date}
                          <br />
                          {dt.day}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles["cell-e"]}>
                <div className={styles["row-cell-f"]}>
                  <div className={styles["text-10"]}>
                    <span className={styles["primary-text-11"]}>
                      {dt.starttime}
                      <br />~<br />
                      {dt.endtime}
                    </span>
                  </div>
                </div>
              </div>
                  
                  <div className={styles["cell-12"]}>
                    <div className={styles["row-cell-13"]}>
                      <button className={styles["icon-left"]}>
                        <span className={styles["text-14"]}>Remove</span>
                      </button>
                    </div>
                  </div>
                </div></>
            
            );
          }
            )}
            
            
          </div><div className={styles["flex-row-c"]}>
            <div className={styles["available-facilities"]}>
              <div className={styles["header-22"]}>
                <div className={styles["cell-23"]}>
                  <div className={styles["row-cell-24"]}>
                    <div className={styles["facility-icon"]} />
                    <div className={styles["text-25"]}>
                      <span className={styles["primary-text-26"]}>Facility</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-27"]}>
                  <div className={styles["row-cell-28"]}>
                    <div className={styles["interface-close-circle-29"]}>
                      <div className={styles["icon-frame-2a"]} />
                    </div>
                    <div className={styles["text-2b"]}>
                      <span className={styles["primary-text-2c"]}>Remove</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["row-2d"]}>
                <div className={styles["cell-2e"]}>
                  <div className={styles["row-cell-2f"]}>
                    <div className={styles["text-30"]}>
                      <span className={styles["primary-text-31"]}>
                        The George Washington University Hospital
                        <br />
                        900 23rd St. NW
                        <br />
                        Washington D.C.,20037
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-32"]}>
                  <div className={styles["row-cell-33"]}>
                    <button className={styles["icon-left-34"]}>
                      <span className={styles["text-35"]}>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles["row-36"]}>
                <div className={styles["cell-37"]}>
                  <div className={styles["row-cell-38"]}>
                    <div className={styles["text-39"]}>
                      <span className={styles["primary-text-3a"]}>
                        Holy Cross Hospital
                        <br />
                        1500 Forest Glen Road
                        <br />
                        Silver Spring MD 20910
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-3b"]}>
                  <div className={styles["row-cell-3c"]}>
                    <button className={styles["icon-left-3d"]}>
                      <span className={styles["text-3e"]}>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["available-specialties"]}>
              <button className={styles["header-3f"]}>
                <div className={styles["cell-40"]}>
                  <div className={styles["row-cell-41"]}>
                    <div className={styles["medico-bold-microscope"]}>
                      <div className={styles["microscope"]} />
                    </div>
                    <div className={styles["text-42"]}>
                      <span className={styles["primary-text-43"]}>Specialties</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-44"]}>
                  <div className={styles["row-cell-45"]}>
                    <div className={styles["interface-close-circle-46"]}>
                      <div className={styles["icon-frame-47"]} />
                    </div>
                    <div className={styles["text-48"]}>
                      <span className={styles["primary-text-49"]}>Remove</span>
                    </div>
                  </div>
                </div>
              </button>
              <div className={styles["row-4a"]}>
                <div className={styles["cell-4b"]}>
                  <div className={styles["row-cell-4c"]}>
                    <div className={styles["text-4d"]}>
                      <span className={styles["primary-text-4e"]}>Cardiology</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-4f"]}>
                  <div className={styles["row-cell-50"]}>
                    <button className={styles["icon-left-51"]}>
                      <span className={styles["text-52"]}>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles["row-53"]}>
                <div className={styles["cell-54"]}>
                  <div className={styles["row-cell-55"]}>
                    <div className={styles["text-56"]}>
                      <span className={styles["primary-text-57"]}>Psychiatry</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-58"]}>
                  <div className={styles["row-cell-59"]}>
                    <button className={styles["icon-left-5a"]}>
                      <span className={styles["text-5b"]}>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div></>


      )}
   
    </div>
  );
}
