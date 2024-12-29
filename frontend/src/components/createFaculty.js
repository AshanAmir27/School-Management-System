import React, { useState, useEffect } from "react";

function CreateFaculty() {
  const [schoolId, setSchoolId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [employment_type, setEmployment_type] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to create a faculty account");
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/createFaculty",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token here
          },
          body: JSON.stringify({
            schoolId,
            username,
            password,
            full_name,
            email,
            phone,
            department,
            employment_type,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Faculty Account created successfully");
        console.log("Faculty Information saved", data.message);

        setSchoolId("");
        setUsername("");
        setPassword("");
        setFullName("");
        setEmail("");
        setPhone("");
        setDepartment("");
        setEmployment_type("");
      } else {
        setMessage(data.error || "Information not saved");
        console.log("Error in creating Faculty", data.error);
      }
    } catch (error) {
      console.log("Error", error);
      alert("Failed to create faculty account");
    }
  };

  useEffect(() => {
    const getSchoolId = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in to create faculty account");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getSchoolId",
          {
            method: "Get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setSchoolId(data.schoolId);
          console.log("School Id fetched: ", data.schoolId);
        } else {
          setMessage(data.error || "Failed to fetch school Id");
        }
      } catch (error) {
        console.error("Error fetching school id: ", error);
        setMessage("An error occurred while fetching school id");
      }
    };
    getSchoolId();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Faculty Account
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
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              School Id
            </label>
            <input
              type="number"
              id="schoolId"
              value={schoolId}
              readOnly
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="username"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Phone
            </label>
            <input
              type="number"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Employment Type
            </label>
            <input
              type="text"
              id="employment"
              value={employment_type}
              onChange={(e) => setEmployment_type(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFaculty;
