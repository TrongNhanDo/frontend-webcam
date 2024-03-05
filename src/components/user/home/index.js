import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";

const dummy = [
  {
    departmentId: 1,
    departmentName: "Department 1",
  },
  {
    departmentId: 2,
    departmentName: "Department 2",
  },
  {
    departmentId: 3,
    departmentName: "Department 3",
  },
  {
    departmentId: 4,
    departmentName: "Department 4",
  },
  {
    departmentId: 5,
    departmentName: "Department 5",
  },
  {
    departmentId: 6,
    departmentName: "Department 6",
  },
];

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
        {dummy.map((value, index) => {
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
