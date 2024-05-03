import React from 'react';
import styles from './HomePage.module.css';
import logo from '../../../src/assets/images/Logo.png';
//import Image from './LoginImg.png';
import { Link } from 'react-router-dom';
import createicon from '../../../src/assets/createuser.png';
import searchicon from '../../../src/assets/search-icon.png';
import dateicon from '../../../src/assets/dateicon.svg';
import checkedicon from '../../../src/assets/checked.svg';

function HomePage() {
  return (
    <div className={styles['main-container']}>
      <div className={styles['main-container2']}>
        <div className={styles['topBar']}>
          <img src={logo} alt="WeCureIt" className={styles['logo']} />
          <span className={styles['logoTitle']}>WeCureIT</span>
          <div className={styles['tabs']}>
          <a href='#works'><button className={styles['tab1']}>How it Works?</button></a>
          <a href='#about'><button className={styles['tab2']}>About Us</button></a>
          </div>
          <div>
          <Link to="/login"><button className={styles['login']} ><label>Login</label></button></Link>
          </div>
        </div>
        <div className={styles['headerbox']}>
            <h1>Find Your <span className={styles['fontColor']}>Doctor</span> and Book an <span className={styles['fontColor']}>Appointment</span></h1>
            <p>Unlock Your Path to Better Health: Sign Up Today and Take Control of Your Wellness Journey with WeCureIt!</p>
            <Link to="/signUp"><button className={styles['signup']} ><label>Sign Up</label></button></Link>
        </div>
      </div>
      <div className={styles['main-container3']} id="works">
        <h4>How it Works?</h4>
        <p>4 Steps to Finding the Right Doctor</p>
        <table>
           <tr>
            <td><img src={createicon} alt="icon" className={styles['icon']}></img></td>
            <td><img src={searchicon} alt="icon" className={styles['icon2']}></img></td>
            <td><img src={dateicon} alt="icon" className={styles['icon2']}></img></td>
            <td><img src={checkedicon} alt="icon" className={styles['icon2']}></img></td>
           </tr>
           <tr>
            <th>Create an Account</th>
            <th>Browse Doctors</th>
            <th>Book Appointment</th>
            <th> Happy Consultation</th>
           </tr>
           <tr>
            <td><p>Begin by creating a WeCureIt account on our website. Provide basic information such as your name, contact details, and preferred login credentials.</p></td>
            <td><p>Find a doctor who is right for you, with convenient locations and flexible hours.</p></td>
            <td><p>Easily book an appointment. Pick a convenient date and time for your appointment from the doctor's available slots. </p></td>
            <td><p>Enjoy a relaxing and comfortable consultation with a doctor who listens to your needs.</p></td>
           </tr>
        </table>
      </div>
      <div className={styles['main-container4']} id='about'>
        <h4> <span className={styles['margin-left']}>About Us</span></h4>
        <div className={styles['contentbox']}>
            <p>Welcome to WeCureIt, your trusted partner in healthcare. WeCureIt was founded with a simple yet powerful mission: to revolutionize the way people access and experience healthcare. We believe that everyone deserves convenient, reliable, and personalized healthcare solutions tailored to their unique needs, and we're here to make that a reality.</p>
            <p>At WeCureIt, we understand the challenges and frustrations that often accompany navigating the healthcare system. That's why we've built a platform that seamlessly connects patients with expert doctors, streamlining the entire healthcare experience from start to finish.</p>
            <p>Our team is comprised of passionate individuals dedicated to improving the health and well-being of our users. From our experienced doctors to our tech-savvy developers and customer support specialists, every member of the WeCureIt family shares a common commitment to excellence and innovation.</p>
            <p>What sets WeCureIt apart is our unwavering focus on providing personalized care. We recognize that healthcare is not one-size-fits-all, which is why we take the time to listen to each patient's unique concerns and develop customized treatment plans tailored to their specific needs.</p>
            <p>Whether you're seeking preventive care, managing a chronic condition, or simply looking for expert medical advice, WeCureIt is here to support you every step of the way. Our comprehensive range of services includes primary care, specialty consultations, diagnostic tests, and more, all conveniently accessible through our user-friendly platform.</p>
            <p>WeCureIt is more than just a healthcare provider; we're your trusted partner on your wellness journey. Join us today and experience the difference that personalized, accessible healthcare can make in your life.</p>
            <p>Thank you for choosing WeCureIt.</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage