import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import socketIOClient from "socket.io-client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./streaming.module.css";
import { hostSocket } from "../../common/constants";

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

  const handleData = useCallback(
    (data) => {
      if (data.departmentId === state.departmentId) {
        setStop(true);
        setWait(true);
      }
    },
    [state.departmentId]
  );

  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("stopCaptureCommand", (data) => {
      handleData(data);
    });

    return () => {
      socketServer.current.off("stopCaptureCommand", (data) => {
        handleData(data);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className={styles.stream}>
        {!wait ? (
          <>
            <h2>Please wait for someone to come get you!</h2>
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
                START CAPTURE
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Please wait for someone to come get you!</h2>
            <img
              src="https://png.pngtree.com/png-clipart/20210718/original/pngtree-wait-a-moment-please-text-korean-speech-bubble-cute-free-png-png-image_6545669.jpg"
              alt=""
              style={{ width: "100%", height: "600px", objectFit: "fill" }}
            />
          </>
        )}

        <Link className={styles.back} to={"/"}>
          <i className="fa-solid fa-backward"></i>
          {" Previous"}
        </Link>
      </div>
    </div>
  );
}
