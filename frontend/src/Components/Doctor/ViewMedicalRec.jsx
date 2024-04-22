import { useEffect,useState } from 'react';
import styles from "./ViewMedicalRec.module.css";
import axios from 'axios'; 
import {useLocation,useNavigate } from 'react-router-dom';

export default function Main() {
 //the patient_rec_id is passed by the review patient info page which is not implemented by my end
 //you can change to the real id when integrate this page
  // Initialize patient_rec_id state
  const [patientRecData, setPatientRecData] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { data1, data2 } = location.state;
  console.log("data1:",data1,"data2:",data2);

    
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/patientmedicalrec/${data1}/`);
        setPatientRecData(response.data); 
        
        // Handle the response data here
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData(); // Fetch data when component mounts or when patient_rec_id changes
  }, []);
  console.log('Data:', patientRecData.medical_diagnosis);

  const handleexit = () =>{
    //this may change to the real doctor home page path which is not implemented by my end
    navigate(-1);  
  }


  return (
    <div className={styles["main-container"]}>
      <div className={styles["top-bar"]}>
        <div className={styles["top-bar-bg"]} />
        <div className={styles["frame"]}>
          <div className={styles["company-name-icon"]}>
            <span className={styles["we-cure-it"]}>WeCureIt</span>
            <div className={styles["medical-cross"]}>
              <div className={styles["group"]}>
                <div className={styles["vector-stroke"]} />
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
      </div>
      <div className={styles["contents"]}>
        <div className={styles["records"]}>
          <div className={styles["frame-1"]}>
            <div className={styles["diagonsis-date"]}>
              <span className={styles["diagnosis-date"]}>Diagnosis Date</span>
              <div className={styles["flex-row-c"]}>
                <div className={styles["frame-2"]} >{patientRecData.diagnosis_date}</div>
              </div>
            </div>
            <div className={styles["flex-column"]}>
              <div className={styles["medical-diagonsis"]}>
                <span className={styles["medical-diagnosis"]}>Medical Diagnosis</span>
                <div className={styles["flex-row-eb"]}>
                  <div className={styles["frame-3"]} >{patientRecData.medical_diagnosis}</div>
                  
                </div>
              </div>
              <div className={styles["current-signs-symptoms"]}>
                <span className={styles["current-signs-symptoms-4"]}>
                  Current Signs and Symptoms
                </span>
                <div className={styles["frame-5"]} >{patientRecData.symptoms}</div>
                
              </div>
              <div className={styles["vital-signs"]}>
              
      <div className={styles["frame-7"]}>
        <div className={styles["row1"]}>
          <div className={styles["cell"]}>Temperature</div>
          <div className={styles["cell"]}>Blood Pressure</div>
          <div className={styles["cell"]}>Heart Rate</div>
          <div className={styles["cell"]}>Respiratory Rate</div>
        </div>
        <div className={styles["row2"]}>
          <div className={styles["cell"]}>{patientRecData.temperature}</div>
          <div className={styles["cell"]}>{patientRecData.blood_pressure}</div>
          <div className={styles["cell"]}>{patientRecData.heart_rate}</div>
          <div className={styles["cell"]}>{patientRecData.respiratory_rate}</div>
        </div>
      </div>
      
    
                
              </div>
              <div className={styles["current-medications"]}>
                <span className={styles["current-medications-8"]}>
                  Please list the current medications the client is taking
                </span>
                <div className={styles["frame-9"]} >{patientRecData.current_medications}</div>
                
              </div>
            </div>
          </div>
        </div>
        <button className={styles["exit-button"]} onClick={handleexit}>
          <span className={styles["exit"]}>Exit</span>
          <div className={styles["rectangle"]} />
        </button>
        <div className={styles["frame-a"]}>
          <div className={styles["patient-info"]}>
            <span className={styles["patient-name"]}>Patient’s Name</span>
            <span className={styles["colon"]}>: </span>
            <span className={styles["nancy-smith"]}>{patientRecData.patient_firstname} {patientRecData.patient_lastname}</span>
            <span className={styles["colon-b"]}>
              
              <br />
            </span>
            <span className={styles["patient-name-c"]}>Address</span>
            <span className={styles["colon-d"]}>: </span>
            <span className={styles["nancy-smith-e"]}>{patientRecData.patient_address} </span>
            <span className={styles["colon-f"]}>
              
              <br />
            </span>
            <span className={styles["patient-name-10"]}>City</span>
            <span className={styles["colon-11"]}>: </span>
            <span className={styles["nancy-smith-12"]}>{patientRecData.patient_city}</span>
            <span className={styles["colon-13"]}>
              
              <br />
            </span>
            <span className={styles["patient-name-14"]}>State</span>
            <span className={styles["colon-15"]}>: </span>
            <span className={styles["nancy-smith-16"]}>{patientRecData.patient_state}</span>
            <span className={styles["colon-17"]}>
              
              <br />
            </span>
            <span className={styles["patient-name-18"]}>Zip Code</span>
            <span className={styles["colon-19"]}>: </span>
            <span className={styles["nancy-smith-1a"]}>
              {patientRecData.patient_zip}
              <br />
            </span>
          </div>
          <div className={styles["section-8"]}>
            <span className={styles["text-22"]}>Doctor’s Name: </span>
            <span className={styles["text-23"]}>Dr. {patientRecData.doctor_firstname} {patientRecData.doctor_lastname}</span>
          </div>
        </div>
        <span className={styles["text-24"]}>Patient Assessment Record</span>
      </div>
    </div>
  );
}
