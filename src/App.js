import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/user/home";
import Streaming from "./components/user/streaming";
import HomeAdmin from "./components/admin/homeadmin";
import StreamingAdmin from "./components/admin/streamingadmin";
import StreamingAdmin2 from "./components/admin/streamingadmin/index2";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/department" element={<Streaming />} />
        <Route path="/admin/" element={<HomeAdmin />} />
        <Route path="/admin/department" element={<StreamingAdmin />} />
        <Route path="/admin/department2" element={<StreamingAdmin2 />} />
      </Routes>
    </div>
  );
}

export default App;
