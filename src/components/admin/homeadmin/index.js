import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./homeadmin.module.css";
import socketIOClient from "socket.io-client";
import { dummyDepartment, hostSocket } from "../../common/constants";

export default function HomeAdmin() {
  const navigate = useNavigate();
  const socketServer = useRef(null);
  const ids = [];
  const [arrayId, setArrayId] = useState([]);

  const handleClick = useCallback((departmentId, departmentName) => {
    try {
      navigate("/admin/department", {
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

  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("receiveImage", (data) => {
      if (!data) {
        setArrayId([]);
        return;
      }

      if (!ids.includes(data.departmentId)) {
        ids.push(data.departmentId);
        setArrayId(ids);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className={styles.home}>
        <h1>ADMIN PAGE</h1>
        <h3 style={{ color: "red" }}>A visitor is waiting to be check-in</h3>
        <hr />
        {dummyDepartment.map((value, index) => {
          return (
            <button
              key={index}
              style={
                arrayId.includes(value.departmentId)
                  ? {
                      backgroundColor: "greenyellow",
                    }
                  : {}
              }
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
