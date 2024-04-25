import React, {useState} from "react";
import styles from "./ViewAppointment.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Main() {
  let navigate = useNavigate();
  const transferDoctorAddSchedule = () =>{
    //change to real add/edit appointment page
    navigate('/addschedule');
  }
  const [selectedDate, setSelectedDate] = useState(new Date());
  let newDate = new Date()
  let date = newDate.getDate();
  let year = newDate.getFullYear();
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthname = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const actualmonth = monthname[newDate.getMonth()]
  const weekDayName = weekDays[newDate.getDay()];
 

  const getWeekDates = (currentDate) => {
    let week = [];
    const current = new Date(currentDate);
    current.setDate(current.getDate() - current.getDay());
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  const [weekDates, setWeekDates] = useState(getWeekDates(selectedDate));

  
  const updateWeek = (offset) => {
    const newSelectedDate = new Date(selectedDate);
    newSelectedDate.setDate(newSelectedDate.getDate() + offset);
    setSelectedDate(newSelectedDate);
    setWeekDates(getWeekDates(newSelectedDate));
  };

  const handleDate = (clickeddate) => {
    //which is the selected date you can pass to get api to get real data for that day
    setSelectedDate(clickeddate);
  };

  const [data, setData] = useState([
    {
      id: 1,
      start_time: '10:30:00',
      end_time: '10:45:00',
      name: 'GWU',
      addressLine1: '900 23rd St NW',  
      city: 'D.C',
      state: 'Washington',
      zipCode: '20037',
      first_name: 'Nancy',
      last_name: 'Smith',
      patient_id: '2',
    },
    {
      id: 2,
      start_time: '11:00:00',
      end_time: '11:30:00',
      name: 'GWU',
      addressLine1: '900 23rd St NW',  
      city: 'D.C',
      state: 'Washington',
      zipCode: '20037',
      first_name: 'Cyrus',
      last_name: 'Harmon',
      patient_id: '1',
    }
  ]);
  /*
  useEffect(() => {
    // Define the function that fetches data
    const fetchData = async () => {
      try {
        // Replace 'https://api.example.com/data' with the actual API endpoint
        const response = await axios.get('https://api.example.com/data');
        setData(response.data); // Set the data in state
      } catch (error) {
        setError(error); // If there's an error, set it in state
      } finally {
        setLoading(false); // Set loading to false regardless of outcome
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);*/
  const handleMedicalInfo = (id) =>{
    navigate(`/doctorHomepage/${id}/medical_info/`);
  };
  return (
    <div className={styles["main-container"]}>
      <div className={styles["top-bar"]}>
        <div className={styles["top-bar-background"]}>
        <div className={styles["frame"]}>
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
            <span className={styles["view-add-schedule"]} onClick={transferDoctorAddSchedule}>View/Add Schedule</span>
            <span className={styles["modify-schedule"]}>View Appointments</span>
          </div>
        </div>
        </div>
      </div>
      <div className={styles["frame-1"]}>
        <span className={styles["today-march"]}>Today, {actualmonth} {date}, {year}</span>
        <div className={styles["flex-row-f"]}>
          
          {weekDates.map((date) => (
          <div
            key={date.toISOString()}
            className={`${styles["frame-2"]} ${selectedDate.toDateString() === date.toDateString() ? styles.selected : ''}`}
            onClick={() => handleDate(date)}
          >
            <span className={styles["sunday"]}>{date.toLocaleString('default', { weekday: 'short' })}</span>
            <span className={styles["text-6"]}>{date.getDate()}</span>
          </div>
        ))}
          <div className={styles["frame-9"]} onClick={() => updateWeek(-7)}>
            <div className={styles["arrow"]} />
          </div>
          <div className={styles["frame-a"]} onClick={() => updateWeek(7)}>
            <div className={styles["arrow-b"]} />
          </div>
        </div>
      </div>
      <div className={styles["frame-c"]}>
        
        {data.map((user) => {
          // You can perform other operations here before returning
          return (
            <div className={styles["frame-d"]}>
          <div className={styles["location"]}>
            <span className={styles["location-e"]}>Location: </span>
            <span className={styles["location-f"]}>
              {user.name}
              <br />
              {user.addressLine1} {user.addressLine2}
              <br />
              {user.city} {user.state}.,{user.zipCode}
            </span>
          </div>
          <span className={styles["time"]}>Time: {user.start_time}-{user.end_time}</span>
          <span className={styles["nancy-smith"]}>{user.first_name} {user.last_name}</span>
          <button className={styles["icon-left"]} onClick={()=>handleMedicalInfo(user.patient_id)}>
            <span className={styles["medical-info"]}>Medical Info</span>
          </button>
        </div>
          );
        })}
      </div>
    </div>
  );
}
