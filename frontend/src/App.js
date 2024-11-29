import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdmin from "./components/SuperAdmin";
import SuperDashboard from "./components/SuperAdminDashboard";
import ManageAdmins from "./components/ManageAdmins";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SuperAdmin />} />
          <Route path="/superAdminDashboard" element={<SuperDashboard />} />
          <Route path="/ManageAdmins" element={<ManageAdmins />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
