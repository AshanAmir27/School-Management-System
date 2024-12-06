import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SuperAdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/superAdmin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Login Successful");
        console.log("Super Admin Details", data.superAdmin);
        navigate("/superAdminDashboard");
      } else {
        setMessage(data.error || "Login Failed");
        console.log("Login Failed Error", data.error);
      }
    } catch (error) {
      setMessage("An error occurred, Pleas try again");
      console.log("Login Error", error);
    }
  };
  return (
    <div className="bg-gray-600 h-screen pt-28">
      <form onSubmit={handleSubmit} className="bg-red-500 w-fit p-5 m-auto ">
        <h1 className="text-center text-white">Super Admin Login Page</h1>

        {message && <p>{message}</p>}

        <div className="mt-3">
          <label htmlFor="">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="ml-3"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ml-4"
          />
        </div>
        <div className="mt-2 text-center">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default SuperAdminLogin;
