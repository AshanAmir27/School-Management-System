import React, { useState } from "react";

function ClassAssignment() {
  const [teacher_id, setTeacher_id] = useState("");
  const [class_name, setClass_name] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [room_no, setRoom_no] = useState("");
  const [year, setYear] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (!teacher_id || !class_name || !subject || !time || !room_no || !year) {
      setMessage("All fields are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized access. Please login.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/assign-class",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            teacher_id,
            class_name,
            subject,
            time,
            room_no,
            year,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Class assigned successfully!");
      } else {
        setMessage(data.error || "Information not saved");
      }
    } catch (error) {
      console.log("Error", error);
      setMessage("Failed to assign class.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Assign Class</h1>

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
              htmlFor="teacher_id"
              className="block text-gray-700 font-medium mb-2"
            >
              Teacher Id
            </label>
            <input
              type="text"
              id="teacher_id"
              value={teacher_id}
              onChange={(e) => setTeacher_id(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="class_name"
              className="block text-gray-700 font-medium mb-2"
            >
              Assigned Class
            </label>
            <input
              type="text"
              id="class_name"
              value={class_name}
              onChange={(e) => setClass_name(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-gray-700 font-medium mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-gray-700 font-medium mb-2"
            >
              Time
            </label>
            <input
              type="text"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="room_no"
              className="block text-gray-700 font-medium mb-2"
            >
              Room No
            </label>
            <input
              type="number"
              id="room_no"
              value={room_no}
              onChange={(e) => setRoom_no(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-gray-700 font-medium mb-2"
            >
              Year
            </label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
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

export default ClassAssignment;
