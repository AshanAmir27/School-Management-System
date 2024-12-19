import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-11/12 max-w-4xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome to the School Management System
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please select your role to log in.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <NavLink
            to="/superAdminLogin"
            className="block p-4 bg-blue-600 text-white rounded-lg text-center shadow hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Super Admin Login
          </NavLink>
          <NavLink
            to="/adminLogin"
            className="block p-4 bg-green-600 text-white rounded-lg text-center shadow hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Admin Login
          </NavLink>
          <NavLink
            to="/facultyLogin"
            className="block p-4 bg-purple-600 text-white rounded-lg text-center shadow hover:bg-purple-700 transition duration-300 ease-in-out"
          >
            Faculty Login
          </NavLink>
          <NavLink
            to="/studentLogin"
            className="block p-4 bg-orange-600 text-white rounded-lg text-center shadow hover:bg-orange-700 transition duration-300 ease-in-out"
          >
            Student Login
          </NavLink>
          <NavLink
            to="/parentLogin"
            className="block p-4 bg-yellow-500 text-white rounded-lg text-center shadow hover:bg-yellow-700 transition duration-300 ease-in-out"
          >
            Parent Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Home;
