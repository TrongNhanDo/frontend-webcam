import { io } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./streaming.module.css";
import { hostSocket } from "../../common/constants";

export default function Streaming() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const webcamRef = useRef(null);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [stop, setStop] = useState(true);
  const [wait, setWait] = useState(false);
  const socketServer = io(hostSocket);

  useEffect(() => {
    if (!state || !state.departmentId) {
      navigate("/");
    }
  }, [navigate, state]);

  const capture = useCallback(
    (stop) => {
      if (!stop) return;
      const imageSrc = webcamRef.current.getScreenshot();
      socketServer.emit("sendImage", {
        departmentId: state.departmentId,
        imageSrc,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.departmentId]
  );

  const handleCapture = useCallback(() => {
    setStop(false);
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
      capture(times, stop);
    }, 100);

    return () => clearInterval(interval);
  }, [stop, capture]);

  const handleData = useCallback(
    async (data) => {
      if (data.departmentId === state.departmentId) {
        await setStop(true);
        await setWait(true);
        socketServer.emit("stopCaptureDone", {
          departmentId: state.departmentId,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.departmentId]
  );

  useEffect(() => {
    socketServer.on("stopCaptureCommand", (data) => {
      handleData(data);
    });

    return () => {
      socketServer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className={styles.stream}>
        {!wait ? (
          <>
            <h2>{state.departmentName || ""}</h2>
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
                onClick={handleCapture}
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
