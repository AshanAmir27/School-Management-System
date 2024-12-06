import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import CreateAdmin from "./createAdmin"; // Import CreateAdmin component
import CreateSchool from "./createSchool";
import ViewAdmins from "./viewAdmins";
import ViewSchool from "./viewSchool";

function SuperAdminDashboard() {
  // State to manage which component to display
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div>
      {/* Top bar */}
      <div className="flex justify-between pl-4 pt-2 pb-2 pr-6 bg-gray-800 text-white fixed w-full z-10">
        <h1 className="text-xl">SuperAdmin</h1>

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
              onClick={() => setActiveComponent("CreateAdmin")}
            >
              Create Admin
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("CreateSchool")}
            >
              Create School
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewAdmins")}
            >
              View Admins
            </button>
          </div>
          <div className="mb-2">
            <button
              className="w-full text-left"
              onClick={() => setActiveComponent("ViewSchool")}
            >
              View School
            </button>
          </div>
        </section>

        {/* Main Section */}
        <section className="bg-gray-100 text-black w-full pl-64 pt-5">
          {activeComponent === "CreateAdmin" && <CreateAdmin />}
          {activeComponent === "CreateSchool" && <CreateSchool />}
          {activeComponent === "ViewAdmins" && <ViewAdmins />}
          {activeComponent === "ViewSchool" && <ViewSchool />}
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

export default SuperAdminDashboard;
