import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import axios from 'axios'; 
import logo from '../../../src/assets/images/Logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


export default function Main() {

    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); 
    const message = location.state?.message;
   
    const handleLogin = async () => {
        const payload = {
            email: email.toUpperCase(),
            password: password,
        };
        console.log(payload)
        const patientLoginPromise = axios.post('http://127.0.0.1:8000/api/patientLogin/', payload);
        const doctorLoginPromise = axios.post('http://127.0.0.1:8000/api/doctorLogin/', payload);
        const adminLoginPromise = axios.post('http://127.0.0.1:8000/api/adminLogin/', payload);
    
        const results = await Promise.allSettled([patientLoginPromise, doctorLoginPromise,adminLoginPromise]);
        
        const patientResult = results[0];
        const doctorResult = results[1];
        const adminResult = results[2];
    
        if (patientResult.status === "fulfilled" && patientResult.value.status === 200) {
            console.log("Patient Login Successful:", patientResult.value.data);
            const patientId = patientResult.value.data.patient_id;
            navigate(`/patientHomepage/${patientId}`);
        } else if (doctorResult.status === "fulfilled" && doctorResult.value.status === 200) {
            console.log("Doctor Login Successful:", doctorResult.value.data);
            const doctorId = doctorResult.value.data.doctor_id;
            navigate(`/doctorHomepage/${doctorId}`);
        } else if (adminResult.status === "fulfilled" && adminResult.value.status === 200) {
            console.log("Admin Login Successful:", adminResult.value.data);
            const adminId = adminResult.value.data.admin_id;
            navigate(`/addDoctors/${adminId}`);
        }
         else {
            // Handle error: Neither login was successful
            setErrorMessage("Invalid credentials. Please try again.");
        }
    };
    
    
    return (
    <div className={styles['main-container']}>
        <div className={styles['topBar']}>
          <img src={logo} alt="WeCureIt" className={styles['logo']} />
          <span className={styles['logoTitle']}>WeCureIT</span>
          <div>
          <Link to="/signUp"><button className={styles['login']} ><label>Sign Up</label></button></Link>
          </div>
        </div>
        <div className={styles['main-container2']}>
            {message && <div className={styles['successmessage']}>{message}</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <div>
                <h4>Welcome Back!</h4>
                <p>Enter your Credentials to access your account</p>
            </div>
            <div className={styles['box']}>
                <p className={styles['text-5']}>Email Address</p>
                <input
                    className={styles['wrapper-4']}
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                />
            </div>
            <div className={styles['box']}>
                <p className={styles['text-5']}>Password</p>
                <input
                    className={styles['wrapper-4']}
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                />
            </div>
            <div className={styles['box2']}>
            <button className={styles['button']} onClick={handleLogin}><label className={styles['text-9']}>Login</label></button>
                <p className={styles['margin-left']}> Don’t have an account? <Link to="/signUp" className={styles['link']}>Sign Up</Link></p>    
            </div>
        </div>
        
        <div className={styles['main-container3']}></div>
    </div>

    );
}