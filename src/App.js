import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/user/home";
import Streaming from "./components/user/streaming";
import HomeAdmin from "./components/admin/homeadmin";
import StreamingAdmin from "./components/admin/streamingadmin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/department" element={<Streaming />} />
        <Route path="/admin/" element={<HomeAdmin />} />
        <Route path="/admin/department" element={<StreamingAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
