import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import styles from "./home.module.css";
import { dummyDepartment, hostSocket } from "../../common/constants";

export default function Home() {
  const navigate = useNavigate();
  const [listId, setListId] = useState([]);

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

  const handleSocket = useCallback((data) => {
    setListId(data.listId);
  }, []);

  const socketServer = useRef(null);
  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("receiveDepartmentList", (data) => {
      handleSocket(data);
    });

    return () => {
      socketServer.current.off("receiveDepartmentList", (data) => {
        handleSocket(data);
      });
    };
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
