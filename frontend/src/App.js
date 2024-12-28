import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import SuperAdminLogin from "./components/superAdminLogin";
import SuperAdminDashboard from "./components/superAdminDashboard";
import CreateAdmin from "./components/createAdmin";
import AdminLogin from "./components/adminLogin";
import ViewFine from "./components/viewFine";
import ParentLogin from "./components/parentLogin";
import ParentDashboard from "./components/parentDashboard";
import StudentLogin from "./components/studentLogin";
import StudentHome from "./components/studentHome";
import StudentCourses from "./components/stuCourses";
import StudentFeeStatus from "./components/StuFeeStatus";
import StuAssignments from "./components/stuAssignments";
import StudentLeaveRequest from "./components/stuLeaveRequest";
import AdminDashboard from "./components/adminDashboard";
import ApproveLeave from "./components/approveLeave";
import Announcement from "./components/announcement";
import ViewAssignedClasses from "./components/viewAssignedClasses";
import ViewAnnouncement from "./components/viewAnnouncements";
import FacultyLogin from "./components/facultyLogin";
import FacultyDashboard from "./components/facultyDashboard";
import FacultyAssignedClasses from "./components/facultyAssignedClasses";
import Assignment from "./components/Assignment";
import ViewAttendance from "./components/viewAttendance";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/superAdminLogin" element={<SuperAdminLogin />} />
          <Route
            path="/superAdminLogin/superAdminDashboard"
            element={<SuperAdminDashboard />}
          />
          <Route path="/createAdmin" element={<CreateAdmin />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/viewFine" element={<ViewFine />} />
          <Route path="/studentLogin" element={<StudentLogin />} />
          <Route path="/parentLogin" element={<ParentLogin />} />
          <Route path="/parentDashboard" element={<ParentDashboard />} />
          <Route path="/studentDashboard" element={<StudentHome />} />
          <Route path="/studentCourses" element={<StudentCourses />} />
          <Route path="/stuAssignments" element={<StuAssignments />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/approveLeave" element={<ApproveLeave />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/viewAnnouncement" element={<ViewAnnouncement />} />
          <Route path="/assigned-classes" element={<ViewAssignedClasses />} />
          <Route path="/facultyLogin" element={<FacultyLogin />} />
          <Route
            path="/FacultyAssignedClasses"
            element={<FacultyAssignedClasses />}
          />
          <Route path="/facultyDashboard" element={<FacultyDashboard />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/viewAttendance" element={<ViewAttendance />} />
          <Route path="/stuFeeStatus" element={<StudentFeeStatus />} />
          <Route path="/stuLeaveRequest" element={<StudentLeaveRequest />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
