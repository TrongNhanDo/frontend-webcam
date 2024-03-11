import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import Home from "./components/user/home";
import Streaming from "./components/user/streaming";
import HomeAdmin from "./components/admin/homeadmin";
import StreamingAdmin from "./components/admin/streamingadmin";
import StreamingAdmin2 from "./components/admin/streamingadmin/index2";
import { hostSocket } from "./components/common/constants";

function App() {
  const socketServer = io(hostSocket);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home socketServer={socketServer} />} />
        <Route
          path="/department"
          element={<Streaming socketServer={socketServer} />}
        />
        <Route
          path="/admin/"
          element={<HomeAdmin socketServer={socketServer} />}
        />
        <Route
          path="/admin/department"
          element={<StreamingAdmin socketServer={socketServer} />}
        />
        <Route
          path="/admin/department2"
          element={<StreamingAdmin2 socketServer={socketServer} />}
        />
      </Routes>
    </div>
  );
}

export default App;
