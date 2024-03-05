import { useCallback, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./streaming.module.css";

export default function StreamingAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state || !state.departmentId) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [imgLink, setImgLink] = useState("");
  const socketServer = useRef(null);
  const hostSocket = "http://localhost:4000/";

  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("receiveImage", (data) => {
      console.log({ admin: data });
      if (data.departmentId === state.departmentId) {
        setImgLink(data.imageSrc);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStopCapture = useCallback(() => {
    socketServer.current.emit("stopCapture", {
      departmentId: state.departmentId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className={styles.stream}>
        <h1>{`Please wait until the staff receive your's notification!`}</h1>
        <div className={styles.divImg}>
          <img src={imgLink} alt="" />
        </div>
        <div className={styles.divBtn} onClick={handleStopCapture}>
          <button className={styles.start}>STOP CAPTURE</button>
        </div>

        <Link className={styles.back} to={"/"}>
          {"< Previous"}
        </Link>
      </div>
    </div>
  );
}
