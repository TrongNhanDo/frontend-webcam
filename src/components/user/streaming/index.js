import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import socketIOClient from "socket.io-client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./streaming.module.css";

export default function Streaming() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state || !state.departmentId) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const webcamRef = useRef(null);
  const socketServer = useRef(null);
  const hostSocket = "http://localhost:4000/";
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [stop, setStop] = useState(true);
  const [wait, setWait] = useState(false);

  const capture = useCallback((count) => {
    const imageSrc = webcamRef.current.getScreenshot();
    socketServer.current.emit("sendImage", {
      departmentId: state.departmentId,
      imageSrc,
      count,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stop) {
      setDisabledBtn(false);
      return;
    }

    let times = 0;
    const interval = setInterval(() => {
      times += 1;
      setDisabledBtn(true);
      capture(times);
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop]);

  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("stopCaptureCommand", (data) => {
      if (data.departmentId === state.departmentId) {
        setStop(true);
        setWait(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className={styles.stream}>
        {!wait ? (
          <>
            <h1>{`Please wait until the staff receive your's notification!`}</h1>
            <div className={styles.divImg}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user",
                }}
              />
            </div>
            <div className={styles.divBtn}>
              <button
                className={styles.start}
                disabled={disabledBtn}
                onClick={() => setStop(false)}
              >
                START
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>Please wait for someone to come get you!</h1>
          </>
        )}

        <Link className={styles.back} to={"/"}>
          {"< Previous"}
        </Link>
      </div>
    </div>
  );
}
