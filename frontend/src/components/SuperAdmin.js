import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [superAdmin, setSuperAdmin] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/superadmin/login",
        {
          username,
          password,
        }
      );

      const loggedInAdmin = response.data.superAdmin;
      setSuperAdmin(loggedInAdmin);
      setLoginError("");

      // Save super admin info to localStorage
      localStorage.setItem("superAdmin", JSON.stringify(loggedInAdmin));

      // Redirect to the super admin dashboard
      navigate("/superAdminDashboard");

      alert("Login successful!");
    } catch (error) {
      setLoginError(
        error.response?.data?.error || "An error occurred during login"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      {superAdmin ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {superAdmin.username}!</h2>
          <p className="text-gray-600">You are logged in as a super admin.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Super Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="username" className="font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>

          {loginError && <p className="mt-4 text-red-600 text-center">{loginError}</p>}
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
