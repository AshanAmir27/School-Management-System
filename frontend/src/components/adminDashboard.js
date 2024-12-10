import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";

import CreateFaculty from "./createFaculty";
import ViewFaculty from "./viewFaculty";
import CreateParents from "./createParents";
import ViewParents from "./viewParents";
import CreateStudent from "./createStudent";
import ViewStudent from "./viewStudent";

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
    <div>
      {/* Top bar */}
      <div className="flex justify-between pl-4 pt-2 pb-2 pr-6 bg-gray-800 text-white fixed w-full z-10">
        <h1 className="text-xl">Admin</h1>

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
              onClick={() => setActiveComponent("CreateFaculty")}
            >
              Create Faculty
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("CreateParent")}
            >
              Create Parent
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("CreateStudent")}
            >
              Create Student
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewFaculty")}
            >
              View Faculty
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewParents")}
            >
              View Parents
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewStudents")}
            >
              View Students
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ClassAssignment")}
            >
              Class Assignment
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewAssignedClasses")}
            >
              View Assigned Classes
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ApproveLeave")}
            >
              Approve Leave
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("FeeStructure")}
            >
              Fee structure
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("Announcements")}
            >
              Announcements
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("viewAnnouncements")}
            >
              View Announcements
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("Fine")}
            >
              Fine Management
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("FeePayment")}
            >
              Fee Payments
            </button>
          </div>
        </section>

        {/* Main Section */}
        <section className="bg-gray-100 text-black w-full pl-64 pt-5">
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
          {activeComponent === "FeePayment" && <FeePayment />}

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

export default AdminDashboard;
