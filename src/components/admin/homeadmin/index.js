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

export default function HomeAdmin() {
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
        <h1>WELCOME TO FRONTIER</h1>
        <h3>A visitor is waiting to be check-in</h3>
        <hr />
        {dummy.map((value, index) => {
          return (
            <>
              <button
                onClick={() =>
                  handleClick(value.departmentId, value.departmentName)
                }
              >
                {value.departmentName}
              </button>
            </>
          );
        })}
      </div>
    </div>
  );
}
