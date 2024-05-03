import React from "react";
import styles from './UserHomePage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
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
                  <div  className={styles['row']}>
                    <div  className={styles['date-f']}>
                      <div  className={styles['date-10']}>
                        <div  className={styles['date-11']}>
                          <span  className={styles['date-text']}>03/30/2024</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['time-12']}>
                      <div  className={styles['time-13']}>
                        <button  className={styles['time-button']}>
                          <span  className={styles['time-text']}>10:00 AM - 10:30 AM</span>
                        </button>
                      </div>
                    </div>
                    <div  className={styles['doctor-14']}>
                      <div  className={styles['doctor-15']}>
                        <div  className={styles['doctor-16']}>
                          <span  className={styles['doctor-17']}>Dr. Gordon Ortiz</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['specialty-18']}>
                      <div  className={styles['specialty-19']}>
                        <div  className={styles['specialty-1a']}>
                          <span  className={styles['specialty-1b']}>Cardiology</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['facility-1c']}>
                      <div  className={styles['facility-1d']}>
                        <div  className={styles['facility-1e']}>
                          <span  className={styles['facility-1f']}>
                            The George Washington University Hospital
                            <br />
                            900 23rd St. NW
                            <br />
                            Washington D.C.,20037
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div  className={styles['row-20']}>
                    <div  className={styles['date-21']}>
                      <div  className={styles['date-22']}>
                        <div  className={styles['date-23']}>
                          <span  className={styles['date-24']}>04/25/2024</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['time-25']}>
                      <div  className={styles['time-26']}>
                        <div  className={styles['time-27']}>
                          <span  className={styles['time-28']}>12:00 PM - 1:00 PM</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['doctor-29']}>
                      <div  className={styles['doctor-2a']}>
                        <div  className={styles['doctor-2b']}>
                          <span  className={styles['doctor-2c']}>Dr. Amir Wright</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['specialty-2d']}>
                      <div  className={styles['specialty-2e']}>
                        <div  className={styles['specialty-2f']}>
                          <span  className={styles['specialty-30']}>Pediatrics</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['facility-31']}>
                      <div  className={styles['facility-32']}>
                        <div  className={styles['facility-33']}>
                          <span  className={styles['facility-34']}>
                            Holy Cross Hospital
                            <br />
                            1500 Forest Glen Road
                            <br />
                            Silver Spring MD 20910
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <span  className={styles['past-appointments']}>Past Appointments</span>
              <div  className={styles['filter']}>
                <span  className={styles['date-filter']}>Date Filter</span>
                <div  className={styles['form']}>
                  <div  className={styles['text-wrap']}>
                    <span  className={styles['selected-option']}>No Filter Selected</span>
                  </div>
                  <div  className={styles['keyboard-arrow-down']} />
                </div>
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
                  <div  className={styles['row-55']}>
                    <div  className={styles['date-56']}>
                      <div  className={styles['date-57']}>
                        <div  className={styles['date-58']}>
                          <span  className={styles['date-59']}>02/01/2024</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['time-5a']}>
                      <div  className={styles['time-5b']}>
                        <div  className={styles['time-5c']}>
                          <span  className={styles['time-5d']}>3:00 PM - 4:00 PM</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['doctor-5e']}>
                      <div  className={styles['doctor-5f']}>
                        <div  className={styles['doctor-60']}>
                          <span  className={styles['doctor-61']}>Dr. Bernard Webb</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['specialty-62']}>
                      <div  className={styles['specialty-63']}>
                        <div  className={styles['specialty-64']}>
                          <span  className={styles['specialty-65']}>Cardiology</span>
                        </div>
                      </div>
                    </div>
                    <div  className={styles['facility-66']}>
                      <div  className={styles['facility-67']}>
                        <div  className={styles['facility-68']}>
                          <span  className={styles['facility-69']}>
                            The George Washington University Hospital
                            <br />
                            900 23rd St. NW
                            <br />
                            Washington D.C.,20037
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 );
}  
  
  