import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsFillHouseDoorFill } from "react-icons/bs"; // Example for additional icon

// Import the components for different sections of the dashboard
import CreateFaculty from "./createFaculty";
import ViewFaculty from "./viewFaculty";
import CreateParents from "./createParents";
import ViewParents from "./viewParents";
import CreateStudent from "./createStudent";
import ViewStudent from "./viewStudent";
import ViewFine from "./viewFine";
import ClassAssignment from "./classAssignment";
import ViewAssignedClasses from "./viewAssignedClasses";
import ApproveLeave from "./approveLeave";
import FeeStructure from "./feeStructure";
import Announcement from "./announcement";
import ViewAnnouncement from "./viewAnnouncements";
import Fine from "./fine";
import FeePayment from "./feePayment";

function AdminDashboard() {
  // State to manage which component to display
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="font-sans antialiased bg-gray-100 min-h-screen">
      {/* Top bar */}
      <div className="flex justify-between px-6 py-4 bg-blue-900 text-white shadow-lg fixed w-full z-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4 items-center">
          <IoMdNotificationsOutline className="text-2xl hover:text-yellow-400 cursor-pointer transition duration-300" />
          <IoSettingsOutline className="text-2xl hover:text-yellow-400 cursor-pointer transition duration-300" />
        </div>
      </div>

      {/* Sidebar and main content */}
      <section className="flex pt-16">
        {/* Sidebar */}
        <section className="bg-blue-900 text-white w-64 h-screen p-5 fixed shadow-lg overflow-y-auto">
          <div className="flex items-center gap-2 text-2xl text-white mb-8">
            <BsFillHouseDoorFill />
            <span className="font-bold text-xl">Dashboard</span>
          </div>

          <div className="space-y-4">
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("CreateFaculty")}
            >
              Create Faculty
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("CreateParent")}
            >
              Create Parent
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("CreateStudent")}
            >
              Create Student
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ViewFaculty")}
            >
              View Faculty
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ViewParents")}
            >
              View Parents
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ViewStudents")}
            >
              View Students
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ClassAssignment")}
            >
              Class Assignment
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ViewAssignedClasses")}
            >
              View Assigned Classes
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ApproveLeave")}
            >
              Approve Leave
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("FeeStructure")}
            >
              Fee Structure
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("Announcements")}
            >
              Announcements
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("viewAnnouncements")}
            >
              View Announcements
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("Fine")}
            >
              Fine Management
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("ViewFine")}
            >
              View Fine
            </button>
            <button
              className="w-full text-left text-lg font-semibold hover:bg-blue-700 px-4 py-2 rounded-md transition duration-200"
              onClick={() => setActiveComponent("FeePayment")}
            >
              Fee Payments
            </button>
          </div>
        </section>

        {/* Main Section */}
        <section className="bg-gray-50 w-full ml-64 p-6">
          {activeComponent === "CreateFaculty" && <CreateFaculty />}
          {activeComponent === "CreateParent" && <CreateParents />}
          {activeComponent === "CreateStudent" && <CreateStudent />}
          {activeComponent === "ViewFaculty" && <ViewFaculty />}
          {activeComponent === "ViewParents" && <ViewParents />}
          {activeComponent === "ViewStudents" && <ViewStudent />}
          {activeComponent === "ClassAssignment" && <ClassAssignment />}
          {activeComponent === "ViewAssignedClasses" && <ViewAssignedClasses />}
          {activeComponent === "ApproveLeave" && <ApproveLeave />}
          {activeComponent === "FeeStructure" && <FeeStructure />}
          {activeComponent === "Announcements" && <Announcement />}
          {activeComponent === "viewAnnouncements" && <ViewAnnouncement />}
          {activeComponent === "Fine" && <Fine />}
          {activeComponent === "ViewFine" && <ViewFine />}
          {activeComponent === "FeePayment" && <FeePayment />}

          {!activeComponent && (
            <div className="text-center text-gray-500 font-semibold">
              Please select an option from the sidebar.
            </div>
          )}
        </section>
      </section>

      {/* Custom Scrollbar CSS */}
      <style jsx>{`
        /* Styling for custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px; /* Width of the scrollbar */
        }
        ::-webkit-scrollbar-thumb {
          background-color: #38bdf8; /* Light blue color for the scrollbar thumb */
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background-color: #f1f1f1; /* Light background for the track */
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
