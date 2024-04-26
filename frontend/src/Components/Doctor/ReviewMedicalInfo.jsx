import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";
import styles from "./ReviewMedicalInfo.module.css";
import { useParams,useLocation } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';




export default function Main() {
  const { patientId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const{data1,data2,data3,data4,data5} = location.state;
  const [ifshowcreate,setifshowcreate] = useState(false);
  const [docf, setdocf] = useState("");
  const [docl, setdocl] = useState("");
  const [fn, setfn] = useState("");
  const [fadd1, setadd1] = useState("");
  const [fadd2, setadd2] = useState("");
  const [fzip, setfzip] = useState("");
  const [fs, setfs] = useState("");
  const [fc, setfc] = useState("");
  const [spname, setspname] = useState("");

  const today = new Date();
  let month = today.getMonth() + 1; 


if (month < 10) {
  month = '0' + month; 
}



const formattedDate = `${today.getFullYear()}-${month}-${today.getDate()}`;



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/patientmedicalcreate/medical_info/${patientId}`);
        setData(response.data);
        const response2 = await axios.get(`http://127.0.0.1:8000/api/patientmedicalcheck/?diagnosis_date=${formattedDate}&doctor_id=${data3}&patient_id=${data2}`)
        const rp3 = await axios.get(`http://127.0.0.1:8000/api/doctorinfo/${data3}`);
        const rp4 = await axios.get(`http://127.0.0.1:8000/api/facilityinfo/${data5}`);
        const rp5 = await axios.get(`http://127.0.0.1:8000/api/specialtyinfo/${data4}`);
        setdocf(rp3.data.first_name);
        setdocl(rp3.data.last_name);
        setfn(rp4.data.name);
        setadd1(rp4.data.addressLine1);
        setadd2(rp4.data.addressLine2);
        setfzip(rp4.data.zipCode);
        setfc(rp4.data.city);
        setfs(rp4.data.state);
        setspname(rp5.data.name);

        if (response2.data.detail) {
          setifshowcreate(true);
          
        } 
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]); 

  const handleview =async(info)=>{

    navigate(`/viewpatientrec/${info}`, { state: {
      data1: info,
      data2: patientId}});

  }
  const handleEdit =async(info)=>{

    navigate(`/addpatientrec/`, { state: {
      data1: info,
      data2: data3,
      }});

  }

  return (
    <div className={styles["main-container"]}>
      <div className={styles["top-bar"]}>
        <div className={styles["top-bar-background"]} />
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
      <div className={styles["medical-history"]}>
        <span className={styles["medical-history-of"]}>Medical History of </span>
        <span className={styles["nancy-smith"]}>{data1}</span>
      </div>
      <div className={styles["full-table"]}>
       
          <div className={styles["header"]}>
            <div className={styles["cell"]}>
              <div className={styles["row-cell"]}>
                <div className={styles["date-icon"]} />
                <div className={styles["text"]}>
                  <span className={styles["primary-text"]}>Date</span>
                </div>
              </div>
            </div>
            <div className={styles["cell-1"]}>
              <div className={styles["row-cell-2"]}>
                <div className={styles["patient-icon"]}>
                  <div className={styles["vector"]} />
                  <div className={styles["vector-3"]} />
                </div>
                <div className={styles["text-4"]}>
                  <span className={styles["primary-text-5"]}>Doctor Diagnosed</span>
                </div>
              </div>
            </div>
            <div className={styles["cell-6"]}>
              <div className={styles["row-cell-7"]}>
                <div className={styles["specialty-icon"]}>
                  <div className={styles["vector-8"]} />
                </div>
                <div className={styles["text-9"]}>
                  <span className={styles["primary-text-a"]}>Specialty</span>
                </div>
              </div>
            </div>
            <div className={styles["cell-b"]}>
              <div className={styles["row-cell-c"]}>
                <div className={styles["facility-icon"]} />
                <div className={styles["text-d"]}>
                  <span className={styles["facility"]}>Facility</span>
                </div>
              </div>
            </div>
            <div className={styles["cell-e"]}>
              <div className={styles["row-cell-f"]}>
                <div className={styles["file-note-edit"]}>
                  <div className={styles["vector-10"]} />
                </div>
                <div className={styles["text-11"]}>
                  <span className={styles["patient-medical-information"]}>
                    Patient Medical <br />
                    Information
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["cell-12"]}>
              <div className={styles["row-cell-13"]}>
                <div className={styles["interface-check-circle"]}>
                  <div className={styles["icon-frame"]} />
                </div>
                <div className={styles["text-14"]}>
                  <span className={styles["completed"]}>Completed</span>
                </div>
              </div>
            </div>
          </div>
          {ifshowcreate ? (
          <>
          <div className={styles["row"]}>
                <div className={styles["cell-15"]}>
                  <div className={styles["row-cell-16"]}>
                    <div className={styles["text-17"]}>
                      <span className={styles["text-c"]}>{formattedDate}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-18"]}>
                  <div className={styles["row-cell-19"]}>
                    <div className={styles["text-1a"]}>
                      <span className={styles["primary-text-1b"]}>Dr. {docf} {docl}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-1c"]}>
                  <div className={styles["row-cell-1d"]}>
                    <div className={styles["text-1e"]}>
                      <span className={styles["primary-text-1f"]}>{spname}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-20"]}>
                  <div className={styles["row-cell-21"]}>
                    <div className={styles["text-22"]}>
                      <span className={styles["primary-text-23"]}>
                        {fn}
                        <br />
                        {fadd1} {fadd2}
                        <br />
                        {fc}, {fs}, {fzip}
                      </span>
                    </div>
                  </div>
                </div>
          <div className={styles["cell-24"]}>
            <div className={styles["row-cell-25"]}>
              <button className={styles["icon-left"]} onClick={() => handleEdit(data2)}>
                <span className={styles["text-26"]}>Edit</span>
              </button>
            </div>
          </div>
    <div className={styles["cell-27"]}>
      <div className={styles["row-cell-28"]}>
        <div className={styles["icon-left-29"]} />
      </div>
    </div>
    </div>
  </>
) : null}
          
          {data && Array.isArray(data) ? (
            data.map((info, index) => {
             
              return (
                <div className={styles["row"]}>
                <div className={styles["cell-15"]}>
                  <div className={styles["row-cell-16"]}>
                    <div className={styles["text-17"]}>
                      <span className={styles["text-c"]}>{info.diagnosis_date}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-18"]}>
                  <div className={styles["row-cell-19"]}>
                    <div className={styles["text-1a"]}>
                      <span className={styles["primary-text-1b"]}>Dr. {info.doctor_firstname} {info.doctor_lastname}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-1c"]}>
                  <div className={styles["row-cell-1d"]}>
                    <div className={styles["text-1e"]}>
                      <span className={styles["primary-text-1f"]}>{info.specialty}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["cell-20"]}>
                  <div className={styles["row-cell-21"]}>
                    <div className={styles["text-22"]}>
                      <span className={styles["primary-text-23"]}>
                        {info.locname}
                        <br />
                        {info.locadd}
                        <br />
                        {info.locCSZ}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles["cell-24"]}>
                          <div className={styles["row-cell-25"]}>
                            <button className={styles["icon-left-3d"]} onClick={() => handleview(info.patient_rec_id)}>
                              <span className={styles["text-26"]}>View</span>
                            </button>
                          </div>
                        </div>
                        <div className={styles["cell-3f"]}>
                            <div className={styles["row-cell-40"]}>
                              <div className={styles["icon-left-41"]} >
                              <div className={styles["icon-check"]} >
                              <div className={styles["check"]} >
                              </div>
                              </div>
                              </div>
                            </div>
                          </div>
              </div>
    );
  })
) : (
  <p>None Data...</p>
)}


          
          

          
        
      </div>
    </div>
  );
}
