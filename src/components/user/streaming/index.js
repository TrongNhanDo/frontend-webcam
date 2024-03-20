import { io } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./streaming.module.css";
import { hostSocket, notFaultImg, socketHeader } from "../../common/constants";

export default function Streaming() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const webcamRef = useRef(null);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [stop, setStop] = useState(true);
  const [wait, setWait] = useState(false);
  const socketServer = io(hostSocket, socketHeader);
  const [socketId, setSocketId] = useState("");
  const [img, setImg] = useState("");

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
        socketId,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.departmentId, socketId]
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
    socketServer.on("connect", () => {
      setSocketId(socketServer.id);
    });

    socketServer.on("receiveImage", (data) => {
      if (data.socketId !== socketId) {
        setImg(data.imageSrc);
      }
    });

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
            <h2>{"Video Real-time"}</h2>
            <br />
            <div className={styles.divImg}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user",
                }}
              />
              <img src={img || notFaultImg} alt="" />
            </div>
            <br />
            <div className={styles.divBtn}>
              <button
                className={styles.start}
                disabled={disabledBtn}
                onClick={handleCapture}
              >
                START VIDEO CALL
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
      </div>
    </div>
  );
}
