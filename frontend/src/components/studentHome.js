import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import components for different sections
import Grades from "./stuCourses";
import Attendance from "./stuAttendance";
import FeeStatus from "./StuFeeStatus";
import StuAnnouncement from "./stuAnnouncement";
import StuLeaveRequest from "./stuLeaveRequest";
import StuFine from "./stuFine";
import StuAssignments from "./stuAssignments";

function StudentDashboard() {
  // State to keep track of the active component
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const navigate = useNavigate();

  // Function to handle sidebar link click and set the active component
  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const token = () => {
      const fetchToken = localStorage.getItem("token");
      console.log("Token for student ", fetchToken);
    };
    token();
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white p-6 flex flex-col shadow-lg transition-transform duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Student Dashboard
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleSidebarClick("StuAssignments")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              StuAssignments
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick("studentGrades")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              Grades
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick("attendance")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              Attendance
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick("feeStatus")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              Fee Status
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick("stuLeaveRequest")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              Leave Request
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick("stuAnnouncement")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              Announcement
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick("viewFine")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              View Fine
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick("logout")}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-700 hover:text-white rounded-md transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gradient-to-b from-blue-800 to-blue-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="text-xl font-semibold">Welcome, Student</div>
          <div className="flex items-center space-x-6">
            <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
              Notifications
            </button>
            <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
              Profile
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Render components conditionally based on activeComponent */}

          {activeComponent === "studentCourses" && <Grades />}
          {activeComponent === "attendance" && <Attendance />}
          {activeComponent === "feeStatus" && <FeeStatus />}
          {activeComponent === "stuLeaveRequest" && <StuLeaveRequest />}
          {activeComponent === "stuAnnouncement" && <StuAnnouncement />}
          {activeComponent === "viewFine" && <StuFine />}
          {activeComponent === "StuAssignments" && <StuAssignments />}
          {activeComponent === "logout" && handleLogout()}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
