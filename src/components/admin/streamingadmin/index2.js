import { useCallback, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { Link } from "react-router-dom";
import styles from "./streamingadmin2.module.css";
import { dummyDepartment, notFaultImg } from "../../common/constants";

export default function StreamingAdmin2() {
  let buttons = [];
  let links = [];
  const [disButton, setDisButton] = useState([]);
  const [imgLink, setImgLink] = useState([]);
  const socketServer = useRef(null);
  const hostSocket = "http://localhost:4000/";

  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("receiveImage", (data) => {
      if (!data) {
        links.length = 0;
        setImgLink([]);
        buttons.length = 0;
        setDisButton([]);
        return;
      }

      if (!links.find((value) => value.departmentId === data.departmentId)) {
        links.push({
          departmentId: data.departmentId,
          imageSrc: data.imageSrc,
        });
        setImgLink(links);
        buttons.push(data.departmentId);
        setDisButton(buttons);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStopCapture = useCallback((departmentId) => {
    socketServer.current.emit("stopCapture", { departmentId });
    const newArr = buttons.filter((e) => e !== departmentId);
    setDisButton(newArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.stream}>
        <h2>A visitor is waiting to be check-in</h2>
        <hr />
        <div className={styles.divImg}>
          {dummyDepartment.map((value, index) => {
            return (
              <div key={index} className={styles.cam}>
                <span>{value.departmentName}</span>
                <img
                  src={
                    imgLink.find((e) => e.departmentId === value.departmentId)
                      ? imgLink.find(
                          (e) => e.departmentId === value.departmentId
                        ).imageSrc
                      : notFaultImg
                  }
                  alt=""
                />
                <button
                  type="button"
                  disabled={
                    !disButton.find(
                      (e) => e.departmentId === value.departmentId
                    )
                  }
                  className={styles.start}
                  title={value.departmentName}
                  onClick={() => handleStopCapture(value.departmentId)}
                >
                  STOP CAPTURE
                </button>
              </div>
            );
          })}
        </div>
        <div className={styles.bottom}>
          <Link className={styles.back} to={"/admin"}>
            <i class="fa-solid fa-backward"></i>
            {" Previous"}
          </Link>
        </div>
      </div>
    </div>
  );
}
