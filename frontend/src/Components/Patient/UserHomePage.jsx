import React, { useEffect, useState } from "react";
import styles from './UserHomePage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';


export const UserHomePage = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const navigateToAppointment = () =>
  {
    navigate(`/schedule/appointment/${patientId}`); 
  }

  const message = location.state?.message;

  const [upcomingAppointments, setUpComingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [cardNumber, setCardNumber] = useState('');

  // Handle when a date was selected as a filter for past appointments:
  // Convert date from YYYY-MM-DD to MM/DD/YYYY
  const convertDateFormat = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${month}/${day}/${year}`;
  };

  const [selectedDate, setSelectedDate] = useState('');
  const formattedDate = convertDateFormat(selectedDate);

  const handleDateChange = (event) => {
    const dateSelected = event.target.value;

    setSelectedDate(dateSelected);
    setPastAppointments([]);
  };

  // Fetch patient's appointments & payment information:
  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const patientUpResp = await axios.get(`http://127.0.0.1:8000/api/patientUpcomingAppointment/${patientId}/`);
        const formatedApp = patientUpResp.data.map(item => ({
          DateTime: item.DateTime,
          Doctor: item.DoctorName,
          Specialty: item.SpecialityType,
          FacilityName: item.Location,
          Address: item.Address,
          StartTime: item.start_time,
          EndTime: item.end_time,
          DateOnly: item.DateOnly,
          TimeOnly: item.TimeOnly,
          AppointmentID: item.appointment_id
        }));

        setUpComingAppointments(formatedApp);
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
      }
    };

    const fetchPastAppointments = async () => {
      try {
        const patientPastApp = await axios.get(`http://127.0.0.1:8000/api/patientPastAppointment/${patientId}/`);
        const formatedApp = patientPastApp.data.map(item => ({
          DateTime: item.DateTime,
          Doctor: item.DoctorName,
          Specialty: item.SpecialityType,
          FacilityName: item.Location,
          Address: item.Address,
          EndTime: item.end_time,
          DateOnly: item.DateOnly,
          TimeOnly: item.TimeOnly
        }));

        if (selectedDate !== '') {
          const newFormated = formatedApp.filter((item) => item.DateOnly === formattedDate);

          setPastAppointments(newFormated);
        } else {
          setPastAppointments(formatedApp);
        }
      } catch (error) {
        console.error("Error fetching past appointments:", error);
      }
    }

    const fetchPatientPayment = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/patientPayment/${patientId}`);

        if (response.status === 200) {
          var cardNum = response.data.card_number;
          if (cardNum.length >= 4) {
            let cardNumStr = String(cardNum).slice(-4);
            setCardNumber(cardNumStr);
          } else {
            setCardNumber(response.data.card_number);
          }
        } else {
          console.error("Error fetching data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching patient's payment:", error);
      }
    }

    fetchUpcomingAppointments();
    fetchPastAppointments();
    fetchPatientPayment();
    // eslint-disable-next-line
  }, [patientId, selectedDate]);

  // Handle trying to cancel an appointment given a selected appointment:
  const [showCancelApp, setShowCancelApp] = useState(false);
  const [showCancelAppConfirm, setShowCancelAppConfirm] = useState(false);
  const [appToCancel, setAppToCancel] = useState(null);
  const [cancelFee, setCancelFee] = useState(false);

  const currentDay = new Date();
  const currentDate = format(new Date(), "MM/dd/yyyy");
  const nextDate = format(currentDay.setDate(currentDay.getDate() + 1), "MM/dd/yyyy");

  const handleCancel = (appoint) => {
    setShowCancelApp(true);
    setAppToCancel(appoint);
    setShowCancelAppConfirm(false);
    setCancelFee(false);

    let date1 = new Date(appoint.DateOnly).getTime();
    let date2 = new Date(currentDate).getTime();
    let date3 = new Date(nextDate).getTime();

    if (date1 === date2) {
      setCancelFee(true);
    } else if (date2 === date3) {
      setCancelFee(true);
    } else {
      setCancelFee(false);
    }
  };

  const cancelAppointment = async() => {
    try {
      var appointID = appToCancel.AppointmentID;
      // eslint-disable-next-line
      const cancelApp = await axios.delete(`http://127.0.0.1:8000/api/patientCancelAppointment/${appointID}/`);
    } catch (error) {
      console.error("Error cancelling an appointment:", error);
    }
  };

  const handleCloseButton = () => {
    setShowCancelApp(false);
    setAppToCancel(null);
    setShowCancelAppConfirm(false);
    setCancelFee(false);
  }

  const handleCloseButtonRefresh = () => {
    setShowCancelApp(false);
    setAppToCancel(null);
    setShowCancelAppConfirm(false);
    setCancelFee(false);

    window.location.reload();
  }

  const handleConfirmButton = () => {
    setShowCancelApp(false);
    setShowCancelAppConfirm(true);

    cancelAppointment();
  }

  return (      
            <div  className={styles['main-container']}>
              <div  className={styles['top-bar']}>
               
                <div  className={styles['frame']}>
                 
                <div className={styles['main-container2']}>
                  <span className={styles['we-cure-it']}>WeCureIt</span>
                  <div className={styles['vector']} />
                </div>
                  <div  className={styles['create-appointment-button']}>
                    <button  className={styles['create-appointment-btn']} onClick={navigateToAppointment}>
                      <div  className={styles['frame-1']}>
                        <span  className={styles['create-new-appointment']}>
                          Schedule Appointment
                        </span>
                      </div>
                    </button>
                  </div>


                  <div  className={styles['profile']}>
                    {/* <div  className={styles['unsplash-ctagwpbqg']} /> */}
                    <div className={styles['dropdown']}>
                    {/* <button className={styles['dropbtn']}> */}
                    <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ marginTop: '-6px' }}/>
                    {/* </button> */}
                    <div className={styles['dropdown-content']}>
                    <Link to={`/editProfile/${patientId}`}>Edit Profile</Link>
                    <a href="/">Logout</a>
                   </div>
                  </div>
                  </div>
                </div>
              </div>
              {message && <div style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: '5%', color: 'green', fontSize: '20px' }}>{message}</div>}
              <span  className={styles['upcoming-appointments']}>Upcoming Appointments</span>
              <div  className={styles['upcoming-appointment-table']}>
                <div  className={styles['table']}>
                  <div  className={styles['header']}>
                    <button  className={styles['date-btn']}>
                      <div  className={styles['date']}>
                        <div  className={styles['date-icon']}>
                          <div  className={styles['date-icon-2']} />
                        </div>
                        <div  className={styles['text']}>
                          <span  className={styles['primary-text']}>Date</span>
                        </div>
                      </div>
                    </button>
                    <div  className={styles['time']}>
                      <div  className={styles['time-3']}>
                        <div  className={styles['clock-icon']}/>
                        <div  className={styles['time-4']}>
                          <span  className={styles['time-5']}>Time</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['doctor']}>
                      <div  className={styles['doctor-6']}>
                        <div  className={styles['doctor-icon']}>
                          
                          <div  className={styles['vector-7']} />
                        </div>
                        <div  className={styles['doctor-8']}>
                          <span  className={styles['doctor-text']}>Doctor</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['specialty']}>
                      <div  className={styles['specialty-9']}>
                        <div  className={styles['specialty-icon']}>
                          <div  className={styles['vector-a']} />
                        </div>
                        <div  className={styles['specialty-b']}>
                          <span  className={styles['specialty-text']}>Specialty</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['facility']}>
                      <div  className={styles['facility-c']}>
                        <div  className={styles['facility-icon']} />
                        <div  className={styles['facility-d']}>
                          <span  className={styles['primary-text-e']}>Facility</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Display Upcoming Appointments: */}
                  {upcomingAppointments.length > 0 ? upcomingAppointments.map((upcomingApp, index)=> {
                    const backgroundColors = ['white', '#eeeeff']; // Add more colors as needed

                    // Select a background color based on the index
                    const backgroundColor = backgroundColors[index % backgroundColors.length];

                    return(
                      <div  className={styles["row"]} style={{backgroundColor: backgroundColor}} key={index} onClick={()=>handleCancel(upcomingApp)}>
                        {/* Date: */}
                        <div className={styles['date-f']}>
                          <div className={styles['date-10']}>
                            <div className={styles['date-11']}>
                              <span className={styles['date-text']}>{upcomingApp.DateOnly}</span>
                            </div>
                          </div>
                        </div>

                        {/* Time: */}
                        <div className={styles['time-12']}>
                          <div className={styles['time-13']}>
                            <div className={styles['time-button']}>
                              <span className={styles['time-text']}>{upcomingApp.TimeOnly}</span>
                            </div>
                          </div>
                        </div>

                        {/* Doctor: */}
                        <div className={styles['doctor-14']}>
                          <div className={styles['doctor-15']}>
                            <div className={styles['doctor-16']}>
                              <span className={styles['doctor-17']}>Dr. {upcomingApp.Doctor}</span>
                            </div>
                          </div>
                        </div>

                        {/* Specialty: */}
                        <div className={styles['specialty-18']}>
                          <div className={styles['specialty-19']}>
                            <div className={styles['specilty-1a']}>
                              <span className={styles['specialty-1b']}>{upcomingApp.Specialty}</span>
                            </div>
                          </div>
                        </div>

                        {/* Facility: */}
                        <div className={styles['facility-1c']}>
                          <div className={styles['facility-1d']}>
                            <div className={styles['facility-1e']}>
                              <span className={styles['facility-1f']}>{upcomingApp.FacilityName}
                              <br />
                              {upcomingApp.Address}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }): (
                    <div  className={styles["row"]}>
                      <div className={styles['date-f']}>
                          <div className={styles['date-10']}>
                            <div className={styles['date-11']}>
                              <span className={styles['date-text']}>No Upcoming Appointments Found</span>
                            </div>
                          </div>
                        </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Pop-up screen for cancel */}
              {showCancelApp && (
                <div className={styles["pop-up-modify"]}>
                  <img alt="" className={styles['bench-accounting']}></img>
                  <p className={styles["appointment"]}>
                    <span className={styles["text-wrapper"]}>
                      {appToCancel.DateOnly}
                      <br />
                      {appToCancel.TimeOnly}
                      <br />
                      Dr. {appToCancel.Doctor}
                      <br />
                      Specialty: {appToCancel.Specialty}
                      <br />
                    </span>
                    <span className={styles["span"]}>
                      <br />
                    </span>
                    <span className={styles["text-wrapper-2"]}>
                      {appToCancel.FacilityName}
                      <br />
                    </span>
                    <span className={styles["text-wrapper-3"]}>
                      {appToCancel.Address}
                    </span>
                  </p>
                  <p className={styles["div"]}>Note: Cancellation fee will be applied to appointments canceled 24 hours prior!</p>
                  <div className={styles["group-button"]}>
                    <div className={styles["cancel-button"]}>
                      <div className={styles["overlap-group-wrapper"]}>
                        <div className={styles["overlap-group"]} onClick={handleConfirmButton}>
                          <div className={styles["text-wrapper-4"]}>Cancel Appointment</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles["close-button"]}>
                      <div className={styles["overlap-group-wrapper"]}>
                        <div className={styles["close-button-wrapper"]} onClick={handleCloseButton}>
                          <div className={styles["text-wrapper-4"]}>Close</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pop-up screen for cancel: Confirmation */}
              {showCancelAppConfirm && (
                <div className={styles["pop-up-modify"]}>
                <img alt="" className={styles['bench-accounting']}></img>
                <p className={styles["appointment"]}>
                  <span className={styles["text-wrapper"]}>
                    {appToCancel.DateOnly}
                    <br />
                    {appToCancel.TimeOnly}
                    <br />
                    Dr. {appToCancel.Doctor}
                    <br />
                    Specialty: {appToCancel.Specialty}
                    <br />
                  </span>
                  <span className={styles["span"]}>
                    <br />
                  </span>
                  <span className={styles["text-wrapper-2"]}>
                    {appToCancel.FacilityName}
                    <br />
                  </span>
                  <span className={styles["text-wrapper-3"]}>
                    {appToCancel.Address}
                  </span>
                </p>
                <div>
                  <p className={styles['this-appointment-has']}>
                    <span className={styles['text-wrapper-5']}>This appointment has been</span>
                    <span className={styles['text-wrapper-6']}> canceled</span>
                  </p>
                </div>
                {cancelFee &&
                <div>
                  <p className={styles['this-appointment-has']}>
                    <span className={styles['text-wrapper-5']}>
                      .<br />
                      $50 cancellation fee was charged to your payment
                      <br />
                      ending at {cardNumber}.
                      <br />
                      Thank you!
                    </span>
                  </p>
                </div>
                }
                <div className={styles["close-button2"]}>
                    <div className={styles["overlap-group-wrapper"]}>
                      <div className={styles['overlap-group2']} onClick={handleCloseButtonRefresh}>
                        <div className={styles['text-wrapper-4']}>Close</div>
                      </div>
                    </div>
                  </div>
              </div>
              )}

              <span  className={styles['past-appointments']}>Past Appointments</span>
              <div  className={styles['filter']}>
                <span  className={styles['date-filter']}>Date Filter</span>
                {/* Filter by date: */}
                <input
                    className={styles["date-input"]}
                    type="date"
                    id="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
              </div>
              <div  className={styles['upcoming-appointment-table-35']}>
                <div  className={styles['table-36']}>
                  <div  className={styles['header-37']}>
                    <button  className={styles['date-38']}>
                      <div  className={styles['date-39']}>
                        <div  className={styles['date-icon-3a']}>
                          <div  className={styles['date-icon-3b']} />
                        </div>
                        <div  className={styles['text-3c']}>
                          <span  className={styles['primary-text-3d']}>Date</span>
                        </div>
                      </div>
                    </button>
                    <div  className={styles['time-3e']}>
                      <div  className={styles['time-3f']}>
                        <div  className={styles['clock-icon-40']} />
                        <div  className={styles['time-41']}>
                          <span  className={styles['time-42']}>Time</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['doctor-43']}>
                      <div  className={styles['doctor-44']}>
                        <div  className={styles['doctor-icon-45']}>
                         
                          <div  className={styles['vector-47']} />
                        </div>
                        <div  className={styles['doctor-48']}>
                          <span  className={styles['doctor-49']}>Doctor</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['specialty-4a']}>
                      <div  className={styles['specialty-4b']}>
                        <div  className={styles['specialty-icon-4c']}>
                          <div  className={styles['vector-4d']} />
                        </div>
                        <div  className={styles['specialty-4e']}>
                          <span  className={styles['specialty-4f']}>Specialty</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['facility-50']}>
                      <div  className={styles['facility-51']}>
                        <div  className={styles['facility-icon-52']} />
                        <div  className={styles['facility-53']}>
                          <span  className={styles['primary-text-54']}>Facility</span>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* Display Past Appointments */}
                {pastAppointments.length > 0 ? pastAppointments.map((pastApp,index)=> {
                  const backgroundColors = ['white', '#eeeeff']; // Add more colors as needed

                  // Select a background color based on the index
                  const backgroundColor = backgroundColors[index % backgroundColors.length];

                  return (
                    <div className={styles['row-55']} style={{backgroundColor: backgroundColor}} key={index}>
                      {/* Date: */}
                      <div className={styles['date-56']}>
                        <div className={styles['date-57']}>
                          <div className={styles['date-58']}>
                            <span className={styles['date-59']}>{pastApp.DateOnly}</span>
                          </div>
                        </div>
                      </div>

                      {/* Time: */}
                      <div className={styles['time-5a']}>
                        <div className={styles['time-5b']}>
                          <div className={styles['time-5c']}>
                            <span className={styles['time-5d']}>{pastApp.TimeOnly}</span>
                          </div>
                        </div>
                      </div>

                      {/* Doctor: */}
                      <div className={styles['doctor-5e']}>
                        <div className={styles['doctor-5f']}>
                          <div className={styles['doctor-60']}>
                            <span className={styles['doctor-61']}>Dr. {pastApp.Doctor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Specialty: */}
                      <div className={styles['specialty-62']}>
                        <div className={styles['specialty-63']}>
                          <div className={styles['specialty-64']}>
                            <span className={styles['specialty-65']}>{pastApp.Specialty}</span>
                          </div>
                        </div>
                      </div>

                      {/* Facility: */}
                      <div className={styles['facility-66']}>
                        <div className={styles['facility-67']}>
                          <div className={styles['facility-68']}>
                            <span className={styles['facility-69']}>{pastApp.FacilityName}
                            <br />
                              {pastApp.Address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }): (
                  <div className={styles['row-55']} >
                    <div className={styles['date-56']}>
                      <div className={styles['date-57']}>
                        <div className={styles['date-58']}>
                          <span className={styles['date-59']}>No Past Appointments Found</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
 );
}  
  
  