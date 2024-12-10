import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";

// Import the components for different sections of the dashboard
// import MarkAttendance from "./markAttendance";
import ViewAttendance from "./viewAttendance";
import FacultySubmitLeave from "./facultySubmitLeave";
// import ViewLeaveRequests from "./viewLeaveRequests";
// import AddGrades from "./addGrades";
// import ViewGrades from "./viewGrades";

function FacultyDashboard() {
  // State to manage which component to display
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div>
      {/* Top bar */}
      <div className="flex justify-between pl-4 pt-2 pb-2 pr-6 bg-gray-800 text-white fixed w-full z-10">
        <h1 className="text-xl">Faculty Dashboard</h1>

        <div className="flex gap-2">
          <IoMdNotificationsOutline className="text-2xl" />
          <IoSettingsOutline className="text-2xl" />
        </div>
      </div>

      {/* Sidebar and main content */}
      <section className="flex pt-12">
        {/* Sidebar */}
        <section className="bg-gray-800 text-white w-60 h-[calc(100vh)] pl-4 pt-5 fixed">
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("FacultySubmitLeave")}
            >
              Submit Leave
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("viewAttendance")}
            >
              View Attendance
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("SubmitLeave")}
            >
              Submit Leave Request
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewLeaveRequests")}
            >
              View Leave Requests
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("AddGrades")}
            >
              Add Grades
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewGrades")}
            >
              View Grades
            </button>
          </div>
        </section>

        {/* Main Section */}
        <section className="bg-gray-100 text-black w-full pl-64 pt-5">
          {activeComponent === "FacultySubmitLeave" && <FacultySubmitLeave />}
          {activeComponent === "viewAttendance" && <ViewAttendance />}
          {/*{activeComponent === "SubmitLeave" && <SubmitLeave />}
          {activeComponent === "ViewLeaveRequests" && <ViewLeaveRequests />}
          {activeComponent === "AddGrades" && <AddGrades />}
          {activeComponent === "ViewGrades" && <ViewGrades />} */}

          {!activeComponent && (
            <div className="text-gray-400">
              Select an option from the sidebar
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default FacultyDashboard;
