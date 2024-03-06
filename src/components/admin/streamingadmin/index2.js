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
      if (!data) return;

      let index = links.findIndex((e) => e.departmentId === data.departmentId);
      if (links.length && index >= 0) {
        links[index].imageSrc = data.imageSrc;
      } else {
        links.push(data);
      }
      setImgLink([...links]);

      let index2 = buttons.findIndex((e) => e === data.departmentId);
      if (buttons.length && index2 >= 0) {
        buttons[index2] = data.departmentId;
      } else {
        buttons.push(data.departmentId);
      }
      setDisButton([...buttons]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStopCapture = useCallback((departmentId) => {
    socketServer.current.emit("stopCapture", { departmentId });
    let index = buttons.findIndex((e) => e === departmentId);
    if (index > -1) {
      buttons.splice(index, 1);
      setDisButton([...buttons]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.stream}>
        <h2>A visitor is waiting to be check-in</h2>
        <hr />
        <div className={styles.divImg}>
          {dummyDepartment?.map((value, index) => {
            return (
              <div key={index} className={styles.cam}>
                <span>{value.departmentName}</span>
                <img
                  src={
                    imgLink.find((e) => e.departmentId === value.departmentId)
                      ? imgLink.find(
                          (e) => e.departmentId === value.departmentId
                        ).imageSrc || notFaultImg
                      : notFaultImg
                  }
                  alt=""
                />
                <button
                  type="button"
                  disabled={!disButton.includes(value.departmentId)}
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
            <i className="fa-solid fa-backward"></i>
            {" Previous"}
          </Link>
        </div>
      </div>
    </div>
  );
}
