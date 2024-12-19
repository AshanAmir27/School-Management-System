import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsFillHouseDoorFill } from "react-icons/bs"; // Example for additional icon

// Import the components for different sections of the dashboard
import Assignment from "./Assignment";
import ViewAttendance from "./viewAttendance";
import FacultySubmitLeave from "./facultySubmitLeave";
import StudentLeaveRequest from "./viewStdLeaveReq";
import ViewAnnouncement from "./viewAnnouncements";
import AddGrades from "./addGrade";
import ViewGrades from "./viewGrades";
import FacultyAssignedClasses from "./facultyAssignedClasses";

function FacultyDashboard() {
  // State to manage which component to display
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="font-sans antialiased bg-gray-100 min-h-screen">
      {/* Top bar */}
      <div className="flex justify-between px-6 py-4 bg-blue-900 text-white shadow-lg fixed w-full z-10">
        <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
        <div className="flex gap-4 items-center">
          <IoMdNotificationsOutline className="text-2xl hover:text-yellow-400 cursor-pointer transition duration-300" />
          <IoSettingsOutline className="text-2xl hover:text-yellow-400 cursor-pointer transition duration-300" />
        </div>
      </div>

      {/* Sidebar and main content */}
      <section className="flex pt-16">
        {/* Sidebar */}
        <section className="bg-blue-900 text-white w-64 h-screen p-5 fixed shadow-lg">
          <div className="flex items-center gap-2 text-2xl text-white mb-8">
            <BsFillHouseDoorFill />
            <span className="font-bold text-xl">Dashboard</span>
          </div>

          <div className="space-y-4">
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("FacultyAssignedClasses")}
            >
              FacultyAssignedClasses
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("assignment")}
            >
              Assignment
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("FacultySubmitLeave")}
            >
              Submit Leave Request
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("viewAttendance")}
            >
              View Attendance
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("StudentLeaveRequest")}
            >
              Student Leave Request
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ViewAnnouncement")}
            >
              View Announcement
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("AddGrades")}
            >
              Add Grades
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ViewGrades")}
            >
              View Grades
            </button>
          </div>
        </section>

        {/* Main Section */}
        <section className="bg-gray-50 w-full ml-64 p-6">
          {activeComponent === "assignment" && <Assignment />}
          {activeComponent === "FacultySubmitLeave" && <FacultySubmitLeave />}
          {activeComponent === "viewAttendance" && <ViewAttendance />}
          {activeComponent === "StudentLeaveRequest" && <StudentLeaveRequest />}
          {activeComponent === "FacultyAssignedClasses" && (
            <FacultyAssignedClasses />
          )}
          {activeComponent === "ViewAnnouncement" && <ViewAnnouncement />}
          {activeComponent === "AddGrades" && <AddGrades />}
          {activeComponent === "ViewGrades" && <ViewGrades />}
          {!activeComponent && (
            <div className="text-center text-gray-500 font-semibold">
              Please select an option from the sidebar.
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default FacultyDashboard;
