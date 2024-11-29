import React, { useEffect, useState } from 'react';
import CreateAdmin from './CreateAdmin'; // Import the CreateAdmin component
import ManageAdmins from './ManageAdmins';
function SuperDashboard() {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false); // State to control the visibility of CreateAdmin
  const [showManageAdmin, setShowManageAdmin] = useState(false); // State to control the visibility of CreateAdmin

  useEffect(() => {
    const adminData = localStorage.getItem('superAdmin');
    if (adminData) {
      setSuperAdmin(JSON.parse(adminData));
    }
  }, []);

  // Toggle the visibility of the CreateAdmin component
  const handleCreateAdminClick = () => {
    setShowCreateAdmin(true);  // Show CreateAdmin when clicked
    setShowManageAdmin(false);
  };

  const handleManageAdminClick = () =>{
    setShowManageAdmin(true);
    setShowCreateAdmin(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Super Admin</h2>
        <nav>
          <ul>
            <li>
              <a
                href="#create-admin"
                className="block py-2 px-4 text-lg hover:bg-blue-700 rounded-md"
                onClick={handleCreateAdminClick} // Handle the click
              >
                Create Admin
              </a>
            </li>
            <li>
              <a href="#manage-admins" className="block py-2 px-4 text-lg hover:bg-blue-700 rounded-md" 
              onClick={handleManageAdminClick}>
                Manage Admins
              </a>
            </li>
            <li>
              <a href="#settings" className="block py-2 px-4 text-lg hover:bg-blue-700 rounded-md">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        {superAdmin ? (
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-10">Welcome, {superAdmin.username}!</h1>
            {/* <p className="text-gray-600 mt-2">You are logged in as a super admin.</p> */}

            {/* Conditionally render CreateAdmin component based on state */}
            {showCreateAdmin && <CreateAdmin  />}
            {showManageAdmin && <ManageAdmins  />}
          </div>
        ) : (
          <p className="text-center text-lg font-semibold text-gray-700">Loading Super Admin...</p>
        )}
      </div>
    </div>
  );
}

export default SuperDashboard;
