import React, { useState } from "react";

function superAdminLogin() {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {};
  return (
    <div className="bg-gray-600 h-screen pt-28">
      <form onSubmit={handleSubmit} className="bg-red-500 w-fit p-5 m-auto ">
        <h1 className="text-center text-white">Super Admin Login Page</h1>
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
          <input type="text" className="ml-4" />
        </div>
        <div className="mt-2 text-center">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default superAdminLogin;
