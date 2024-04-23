import React from "react";
import styles from "./AddScheduleHome.module.css";

export default function Main() {
  return (
    <div className={styles["main-container"]}>
      <div className={styles["top-bar"]}>
        <div className={styles["top-bar-background"]} />
        <div className={styles["tabs"]}>
            <span className={styles["view-add-schedule"]}>View/Add Schedule</span>
            <span className={styles["view-appointments"]}>View Appointments</span>
          </div>
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
      </div>
      <div className={styles["frame-1"]}>
        <div className={styles["frame-2"]} />
        <span className={styles["no-schedule"]}>No schedule created yet</span>
        <span className={styles["create-schedule"]}>Let’s create your schedule!</span>
        <div className={styles["flex-row"]}>
          <button className={styles["add-dates-button"]}>
            <span className={styles["add-dates"]}>Add Dates</span>
            <div className={styles["rectangle"]} />
          </button>
          <button className={styles["add-facilities-button"]}>
            <span className={styles["add-facilities-specialties"]}>
              Add Facilities & Specialties
            </span>
            <div className={styles["rectangle-3"]} />
          </button>
        </div>
      </div>
    </div>
  );
}
