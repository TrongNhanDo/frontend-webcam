import { useCallback, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./streamingadmin.module.css";
import { hostSocket } from "../../common/constants";

export default function StreamingAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [disButton, setDisButton] = useState(true);

  useEffect(() => {
    if (!state || !state.departmentId) {
      navigate("/admin");
    }
  }, [navigate, state]);

  const [imgLink, setImgLink] = useState("");
  const socketServer = useRef(null);

  const handleSocket = useCallback(
    (data) => {
      if (data.departmentId === state.departmentId) {
        setDisButton(false);
        setImgLink(data.imageSrc);
      }
    },
    [state.departmentId]
  );

  const handleDisabledButton = useCallback(
    (data) => {
      if (data.departmentId === state.departmentId) {
        setDisButton(true);
      }
    },
    [state.departmentId]
  );

  useEffect(() => {
    socketServer.current = socketIOClient.connect(hostSocket);
    socketServer.current.on("receiveImage", (data) => {
      handleSocket(data);
    });

    socketServer.current.on("disabledCapture", (data) => {
      handleDisabledButton(data);
    });

    return () => {
      socketServer.current.off("receiveImage", (data) => {
        handleSocket(data);
      });

      socketServer.current.off("disabledCapture", (data) => {
        handleDisabledButton(data);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStopCapture = useCallback(async () => {
    socketServer.current.emit("stopCapture", {
      departmentId: state.departmentId,
    });
  }, [state.departmentId]);

  return (
    <div className="container">
      <div className={styles.stream}>
        <h2>A visitor is waiting to be check-in</h2>
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
          <i className="fa-solid fa-backward"></i>
          {" Previous"}
        </Link>
      </div>
    </div>
  );
}
