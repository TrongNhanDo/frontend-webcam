import { useCallback, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./streamingadmin.module.css";

export default function StreamingAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [disButton, setDisButton] = useState(true);

  useEffect(() => {
    if (!state || !state.departmentId) {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [imgLink, setImgLink] = useState("");
  const socketServer = useRef(null);
  const hostSocket = "http://localhost:4000/";

  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("receiveImage", (data) => {
      if (data.departmentId === state.departmentId) {
        setDisButton(false);
        setImgLink(data.imageSrc);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStopCapture = useCallback(() => {
    socketServer.current.emit("stopCapture", {
      departmentId: state.departmentId,
    });
    setDisButton(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className={styles.stream}>
        <h2>{`Please wait until the staff receive your's notification!`}</h2>
        <div className={styles.divImg}>
          <img
            src={
              imgLink ||
              "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
            }
            alt=""
          />
        </div>
        <div className={styles.divBtn} onClick={handleStopCapture}>
          <button disabled={disButton} className={styles.start}>
            STOP CAPTURE
          </button>
        </div>

        <Link className={styles.back} to={"/admin"}>
          {"< Previous"}
        </Link>
      </div>
    </div>
  );
}
