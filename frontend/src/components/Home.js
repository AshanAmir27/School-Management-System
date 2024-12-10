import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home</h1>

      <NavLink to="/superAdminLogin">Super Admin Login</NavLink>
      <br />
      <NavLink to="/adminLogin">Admin Login</NavLink>

      <br />

      <NavLink to="/facultyLogin">Faculty Login</NavLink>
    </div>
  );
}

export default Home;
