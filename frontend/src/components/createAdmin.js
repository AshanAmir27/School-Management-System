import React, { useState } from "react";

function CreateAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [school_id, setSchool_Id] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to create an admin.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/superAdmin/createAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token here
          },
          body: JSON.stringify({
            username,
            password,
            full_name,
            email,
            school_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Information saved successfully");
        console.log("Information saved : ", data.message);

        // Clear form inputs after successful creation
        setUsername("");
        setPassword("");
        setEmail("");
        setFullName("");
        setSchool_Id("");
      } else {
        setMessage(data.error || "Information not saved");
        console.log("Information saving Error", data.error);
      }
    } catch (error) {
      setMessage("An error occurred while saving information");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create New Admin
        </h1>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="school_id"
              className="block text-gray-700 font-medium mb-2"
            >
              School ID
            </label>
            <input
              type="number"
              id="school_id"
              value={school_id}
              onChange={(e) => setSchool_Id(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAdmin;
