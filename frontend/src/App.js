import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import SuperAdminLogin from "./components/superAdminLogin";
import SuperAdminDashboard from "./components/superAdminDashboard";
import CreateAdmin from "./components/createAdmin";
import AdminLogin from "./components/adminLogin";
import AdminDashboard from "./components/adminDashboard";
import ApproveLeave from "./components/approveLeave";
import Announcement from "./components/announcement";
import ViewAssignedClasses from "./components/viewAssignedClasses";
import ViewAnnouncement from "./components/viewAnnouncements";
import FacultyLogin from "./components/facultyLogin";
import FacultyDashboard from "./components/facultyDashboard";
import ViewAttendance from "./components/viewAttendance";

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
          <Route path="/approveLeave" element={<ApproveLeave />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/viewAnnouncement" element={<ViewAnnouncement />} />
          <Route path="/assigned-classes" element={<ViewAssignedClasses />} />
          <Route path="/facultyLogin" element={<FacultyLogin />} />
          <Route path="/facultyDashboard" element={<FacultyDashboard />} />
          <Route path="/viewAttendance" element={<ViewAttendance />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
