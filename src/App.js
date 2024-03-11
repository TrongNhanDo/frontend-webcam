import { Route, Routes } from "react-router-dom";
import socketIOClient from "socket.io-client";
import "./App.css";
import Home from "./components/user/home";
import Streaming from "./components/user/streaming";
import HomeAdmin from "./components/admin/homeadmin";
import StreamingAdmin from "./components/admin/streamingadmin";
import StreamingAdmin2 from "./components/admin/streamingadmin/index2";
import { hostSocket } from "./components/common/constants";

function App() {
  const socket = socketIOClient.connect(hostSocket);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/department" element={<Streaming socket={socket} />} />
        <Route path="/admin/" element={<HomeAdmin socket={socket} />} />
        <Route
          path="/admin/department"
          element={<StreamingAdmin socket={socket} />}
        />
        <Route
          path="/admin/department2"
          element={<StreamingAdmin2 socket={socket} />}
        />
      </Routes>
    </div>
  );
}

export default App;
