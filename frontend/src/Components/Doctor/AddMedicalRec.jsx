import { useEffect,useState } from "react";
import styles from "./AddMedicalRec.module.css";
import axios from "axios"; 
import { useLocation,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';


export default function Main() {

  const navigate = useNavigate();
  const [diagnosis_date, setInputdate] = useState("");
  const [medical_diagnosis, setInputdiagnosis] = useState("");
  const [symptoms, setInputsymptoms] = useState("");
  const [temperature, setInputtemperature] = useState("");
  const [blood_pressure, setInputbloodpressure] = useState("");
  const [heart_rate, setInputheartrate] = useState("");
  const [respiratory_rate, setInputrespiratoryrate] = useState("");
  const [current_medications, setInputmedicine] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  // the appintmentinfo may get by the review patient info page which is not
  //implemented yet, you can change to the real data once you get the info by that review patient info page
  

  const [patientData, setPatientData] = useState('');
  const location = useLocation();
  const{data1,data2} = location.state || {};

  


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleInputDateChange = (e) => {
    setInputdate(e.target.value);
  };

  const handleInputDiagnosisChange = (e) => {
    setInputdiagnosis(e.target.value);
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if ischecked is true
    if (isChecked) {
      // Here you can handle the form submission, such as sending the data to your backend
      const patient_id = data1;
      const doctor_id = data2;
      const formData = {
        medical_diagnosis,
        diagnosis_date,
        symptoms,
        temperature,
        blood_pressure,
        heart_rate,
        respiratory_rate,
        current_medications,
        doctor_id,
        patient_id
      };
   
      // Check if formData is not empty
      if (Object.keys(formData).length !== 0) {
        console.log(JSON.stringify(formData));
        axios.post('http://127.0.0.1:8000/api/patientmedicalcreate/', formData)
          .then(response => {
            console.log('Form submitted successfully!', response.data);
            // Handle any post-submission logic here, like redirecting to another page
          })
          .catch(error => {
            console.error('Error submitting form:', error);
          });
          navigate(-1);  
      }
    } else {
      console.log('ischecked is false, form not submitted');
    }
    
    
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/patientDetail/${data1}/`);
        setPatientData(response.data) 
        
        // Handle the response data here
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData(); // Fetch data when component mounts or when patient_rec_id changes
    // eslint-disable-next-line
  }, []);
  


  return (
    
    <div className={styles["main-container"]}>
      <div className={styles["top-bar"]}>
        
        <div className={styles['main-container2']}>
                      <span className={styles['we-cure-it']}>WeCureIt</span>
                    <div className={styles['icon']} />
                    
                    <div  className={styles['profile']}>
                      <div className={styles['dropdown']}>
                        <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ marginTop: '-6px' }}/>
                        <div className={styles['dropdown-content']}>
                          <a href="/">Logout</a>
                        </div>
                      </div>
                    </div>
                  </div>
      </div>
      <div className={styles["contents"]}>
        <div className={styles["records"]}>
          <div className={styles["frame-1"]}>
            <div className={styles["diagnosis-date"]}>
              <span className={styles["diagnosis-date-2"]}>Diagnosis Date</span>
              <input
                className={styles["frame-3"]}
                type="text"
                value={diagnosis_date}
                onChange={handleInputDateChange}
                placeholder="YYYY-MM-DD"
          />
            </div>
            <div className={styles["flex-column-a"]}>
              <div className={styles["medical-diagnosis"]}>
                <span className={styles["medical-diagnosis-4"]}>Medical Diagnosis</span>
                <input
                className={styles["frame-5"]}
                type="text"
                value={medical_diagnosis}
                onChange={handleInputDiagnosisChange}
          />
                
              </div>
              <div className={styles["current-signs-symptoms"]}>
                <span className={styles["current-signs-symptoms-6"]}>
                  Current Signs and Symptoms
                </span>
                <input
                className={styles["frame-7"]}
                type="text"
                value={symptoms}
                onChange={(e)=>setInputsymptoms(e.target.value)}
          />
              </div>
              <div className={styles["vital-signs"]}>
                <span className={styles["vital-signs-8"]}>Vital Signs</span>
                <div className={styles["frame-9"]}>
                  <div className={styles["row1"]}>
                    <div className={styles["cell"]}>Temperature</div>
                    <div className={styles["cell"]}>Blood Pressure</div>
                    <div className={styles["cell"]}>Heart Rate</div>
                    <div className={styles["cell"]}>Respiratory Rate</div>
                  </div>
                  <div className={styles["row2"]}>
                    
                    <input
                      className={styles["cell2"]}
                      type="text"
                      value={temperature}
                      onChange={(e)=>setInputtemperature(e.target.value)}/>
                    <input
                      className={styles["cell2"]}
                      type="text"
                      value={blood_pressure}
                      onChange={(e)=>setInputbloodpressure(e.target.value)}/>
                    <input
                      className={styles["cell2"]}
                      type="text"
                      value={heart_rate}
                      onChange={(e)=>setInputheartrate(e.target.value)}/>
                    <input
                      className={styles["cell2"]}
                      type="text"
                      value={respiratory_rate}
                      onChange={(e)=>setInputrespiratoryrate(e.target.value)}/>
                    
                  </div>
                </div>
              </div>
              <div className={styles["current-medications"]}>
                <span className={styles["current-medications-text"]}>
                  Please list the current medications the client is taking
                </span>
                
                <input
                      className={styles["frame-a"]}
                      type="text"
                      value={current_medications}
                      onChange={(e)=>setInputmedicine(e.target.value)}/>
              </div>
              <div className={styles["consent-checkbox"]}>
                <span className={styles["consent-text"]}>
                  I have the consent of the patient or the patient’s conatct
                  person to release this health information for health care
                  purpose.
                </span>
                <div className={styles["checkbox"]}>
                  
                
                  <input className={styles["rectangle"]}
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}/>
       
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className={styles["submit-button"]} onClick={handleSubmit}>
          <span className={styles["submit-button-b"] }>Submit</span>
          <div className={styles["rectangle-c"]} />
        </button>
        <div className={styles["frame-d"]}>
          <div className={styles["patient-info"]}>
            <span className={styles["state-span"]}>Patient’s Name</span>
            <span className={styles["name-span"]}>: </span>
            <span className={styles["location-span"]}>{patientData.first_name} {patientData.last_name} </span>
            <span className={styles["name-span-e"]}>
              
              <br />
            </span>
            <span className={styles["state-span-f"]}>Address</span>
            <span className={styles["name-span-10"]}>: </span>
            <span className={styles["location-span-11"]}>{patientData.addressLine1}</span>
            <span className={styles["name-span-12"]}>
              
              <br />
            </span>
            <span className={styles["state-span-13"]}>City</span>
            <span className={styles["name-span-14"]}>: </span>
            <span className={styles["location-span-15"]}>{patientData.city}</span>
            <span className={styles["name-span-16"]}>
              
              <br />
            </span>
            <span className={styles["state-span-17"]}>State</span>
            <span className={styles["name-span-18"]}>: </span>
            <span className={styles["location-span-19"]}>{patientData.state}</span>
            <span className={styles["name-span-1a"]}>
              
              <br />
            </span>
            <span className={styles["state-span-1b"]}>Zip Code</span>
            <span className={styles["name-span-1c"]}>: </span>
            <span className={styles["location-span-1d"]}>{patientData.zipCode}</span>
          </div>
        </div>
        <span className={styles["record-span"]}>Patient Assessment Record</span>
      </div>
    </div>
  );
}
