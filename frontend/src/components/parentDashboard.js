import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import components for different sections of the Parent Dashboard
import StudentAttendance from "./stuAttendance";
import Announcements from "./viewAnnouncements";
import StuFine from "./stuFine";
import ViewGrade from "./viewGrades";
import FeePayment from "./feePayment";

function ParentDashboard() {
  // State to manage which component to render
  const [activeComponent, setActiveComponent] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-4 hidden md:block">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Parent Dashboard
        </h1>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveComponent("studentAttendance")}
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 transition duration-300"
          >
            Student Attendance
          </button>
          <button
            onClick={() => setActiveComponent("Announcements")}
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 transition duration-300"
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveComponent("ViewGrade")}
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 transition duration-300"
          >
            View Grades
          </button>
          <button
            onClick={() => setActiveComponent("StuFine")}
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 transition duration-300"
          >
            Child Fine
          </button>
          <button
            onClick={() => setActiveComponent("FeePayment")}
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 transition duration-300"
          >
            Fee Payment
          </button>
          <button
            onClick={() => setActiveComponent("Logout")}
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-red-500 transition duration-300"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navbar (Visible on smaller screens) */}
        <header className="md:hidden bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-lg font-bold">Parent Dashboard</h1>
          <button
            onClick={() => setActiveComponent("Logout")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm"
          >
            Logout
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="container mx-auto p-6">
          {activeComponent === "studentAttendance" && <StudentAttendance />}
          {activeComponent === "Announcements" && <Announcements />}
          {activeComponent === "StuFine" && <StuFine />}
          {activeComponent === "ViewGrade" && <ViewGrade />}
          {activeComponent === "FeePayment" && <FeePayment />}

          {activeComponent === "Logout" && handleLogout()}

          {!activeComponent && (
            <div className="text-center text-gray-500 font-semibold">
              Please select an option from the sidebar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
