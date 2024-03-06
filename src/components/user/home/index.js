import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import { dummyDepartment } from "../../common/constants";

export default function Home() {
  const navigate = useNavigate();

  const handleClick = useCallback((departmentId, departmentName) => {
    try {
      navigate("/department", {
        state: {
          departmentId,
          departmentName,
        },
      });
    } catch (error) {
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className={styles.home}>
        <h1>USER PAGE</h1>
        <h3 style={{ color: "red" }}>
          Please select the department you want to wait
        </h3>
        <hr />
        {dummyDepartment.map((value, index) => {
          return (
            <button
              key={index}
              onClick={() =>
                handleClick(value.departmentId, value.departmentName)
              }
            >
              {value.departmentName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
