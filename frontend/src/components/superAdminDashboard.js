import React, { useState } from "react";
// import { IoSettingsOutline, IoMdNotificationsOutline } from "react-icons/io5";
import CreateAdmin from "./createAdmin";
import CreateSchool from "./createSchool";
import ViewAdmins from "./viewAdmins";
import ViewSchool from "./viewSchool";

function SuperAdminDashboard() {
  const [activeComponent, setActiveComponent] = useState(null);

  const menuItems = [
    { label: "Create Admin", component: "CreateAdmin" },
    { label: "Create School", component: "CreateSchool" },
    { label: "View Admins", component: "ViewAdmins" },
    { label: "View School", component: "ViewSchool" },
  ];

  const renderComponent = () => {
    switch (activeComponent) {
      case "CreateAdmin":
        return <CreateAdmin />;
      case "CreateSchool":
        return <CreateSchool />;
      case "ViewAdmins":
        return <ViewAdmins />;
      case "ViewSchool":
        return <ViewSchool />;
      default:
        return (
          <div className="text-gray-500 text-center mt-20">
            <h2 className="text-2xl font-semibold">Welcome, SuperAdmin!</h2>
            <p className="mt-2">
              Please select an option from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="flex justify-between items-center bg-gray-800 text-white px-6 py-4 shadow-md fixed w-full z-10">
        <h1 className="text-2xl font-bold">SuperAdmin Dashboard</h1>
        {/* <div className="flex items-center gap-4">
          <IoMdNotificationsOutline
            className="text-3xl cursor-pointer hover:text-gray-400"
            aria-label="Notifications"
          />
          <IoSettingsOutline
            className="text-3xl cursor-pointer hover:text-gray-400"
            aria-label="Settings"
          />
        </div> */}
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="bg-gray-800 text-white w-64 h-[calc(100vh-4rem)] shadow-md fixed top-16">
          <nav className="flex flex-col space-y-2 py-4 px-4">
            {menuItems.map((item) => (
              <button
                key={item.component}
                className={`text-left w-full px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                  activeComponent === item.component ? "bg-gray-700" : ""
                }`}
                onClick={() => setActiveComponent(item.component)}
                aria-label={item.label}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 p-6 w-full">{renderComponent()}</main>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
