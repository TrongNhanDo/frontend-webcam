import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import { dummyDepartment } from "../../common/constants";

export default function Home({ socketServer }) {
  const navigate = useNavigate();
  const [listId, setListId] = useState([]);

  const handleClick = useCallback(
    (departmentId, departmentName) => {
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
    },
    [navigate]
  );

  const handleSocket = useCallback((data) => {
    setListId(data.listId);
  }, []);

  useEffect(() => {
    socketServer.on("receiveDepartmentList", (data) => {
      handleSocket(data);
    });

    return () => {
      socketServer.disconnect();
    };
  }, [handleSocket, socketServer]);

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
              disabled={listId.includes(value.departmentId)}
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
