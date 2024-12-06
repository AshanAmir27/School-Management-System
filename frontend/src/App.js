import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import SuperAdminLogin from "./components/superAdminLogin";
import SuperAdminDashboard from "./components/superAdminDashboard";
import CreateAdmin from "./components/createAdmin";
import AdminLogin from "./components/adminLogin";
import AdminDashboard from "./components/adminDashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/superAdminLogin" element={<SuperAdminLogin />} />
          <Route
            path="/superAdminDashboard"
            element={<SuperAdminDashboard />}
          />
          <Route path="/createAdmin" element={<CreateAdmin />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
