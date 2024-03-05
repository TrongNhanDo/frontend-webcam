import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import "./App.css";
import { MainContext } from "./context/MainContext";
import Home from "./components/user/home";
import Streaming from "./components/user/streaming";
import HomeAdmin from "./components/admin/homeadmin";
import StreamingAdmin from "./components/admin/streamingadmin";

function App() {
  const { role, setRole } = useContext(MainContext);

  return (
    <div className="App">
      <button onClick={() => setRole(2)}>admin</button>
      <Routes>
        {role <= 1 ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/department" element={<Streaming />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomeAdmin />} />
            <Route path="/department" element={<StreamingAdmin />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
