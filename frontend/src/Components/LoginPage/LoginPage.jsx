import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import axios from 'axios'; 
//import Image from './LoginImg.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Main() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const handleLogin =async () => {
        
        try {
            const payload = {
                email: email,
                password: password,
            };
            console.log('email', payload)
            const response = await axios.post('http://127.0.0.1:8000/api/patientLogin/', payload);
    
            if (response.status === 200) {
                console.log("Login Successful:", response.data);
                const patientId = response.data.patient_id;
            navigate(`/patientHomepage/${patientId}`);
            } else {
                console.error("Login Failed with status:", response.status);
            }
        } catch (error) {
            if (error.response) {
                console.error("Login Failed:", error.response.data);
            } else if (error.request) {
                
                console.error("No response received:", error.request);
            } else {
                
                console.error("Error:", error.message);
            }
        }
    };

    return (
    <div className={styles['main-container']}>
    <div className={styles['section']}>
        <div className={styles['box']} />
        <div className={styles['group']}>
            <div className={styles['group-2']}>
                <span className={styles['text']}>WeCureIt</span>
                <div className={styles['group-3']}>
                    <div className={styles['section-2']}>
                        <div className={styles['pic']}></div>
                    </div>
                </div>
            </div>
            <div className={styles['wrapper']}>
                <div className={styles['group-4']}>
                    <div className={styles['group-5']}>
                        <span className={styles['text-2']}>Login / Sign-Up</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className={styles['box-2']}>
        <div className={styles['section-3']}>
            <div className={styles['box-3']}>
                <span className={styles['text-3']}>Welcome back!</span>
            </div>
            <span className={styles['text-4']}>
                Enter your Credentials to access your account
            </span>
            <div className={styles['box-4']}>
                <div className={styles['wrapper-2']}>
                    <span className={styles['text-5']}>Email address</span>
                </div>
                <div className={styles['inputfield']}>
                    <div className={styles['wrapper-3']}>
                        <input
                            className={styles['section-4']}
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                        />
                    </div>
                </div>
            </div>
            <div className={styles['section-5']}>
                <div className={styles['section-6']}>
                    <span className={styles['text-7']}>Password</span>
                </div>
                <div className={styles['inputpassword']}>
                    <div className={styles['section-7']}>
                        <input
                            className={styles['wrapper-4']}
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                        />
                    </div>
                </div>
            </div>
            <div className={styles['group-6']}>
                <div className={styles['box-5']}>
                    <div className={styles['box-6']}>
                        <div className={styles['wrapper-5']} />
                    </div>
                </div>
                <button className={styles['box-6'] + ' ' + styles['button']} onClick={handleLogin}>
                    <label className={styles['text-9']}>Login</label>
                </button>
            </div>
            <div className={styles['group-7']}>
                <div className={styles['group-8']}>
                    <span className={styles['text-a']}>Don’t have an account? </span>
                    <Link to="/signUp">Sign Up</Link>
                    {/* <span className={styles['text-c']}>Sign Up</span> */}
                </div>
            </div>
        </div>
    </div>
    <div className={styles['pic-2']}></div>
</div>

    );
}