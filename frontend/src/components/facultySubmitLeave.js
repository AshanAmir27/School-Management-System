import React, { useState } from "react";

function FacultySubmitLeave() {
  // const [faculty_id, setFacultyId] = useState(""); // Assuming faculty_id is provided or can be fetched dynamically
  const [leave_start_date, setLeave_start_date] = useState("");
  const [leave_end_date, setLeave_end_date] = useState("");
  const [leave_reason, setLeave_reason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!leave_start_date || !leave_end_date || !leave_reason) {
      setMessage("All fields are required.");
      return;
    }

    if (new Date(leave_start_date) > new Date(leave_end_date)) {
      setMessage("Start date cannot be after end date.");
      return;
    }

    // Prepare request data
    const leaveData = {
      // faculty_id: faculty_id, // Replace with actual faculty ID if dynamically fetched
      leave_start_date: leave_start_date,
      leave_end_date: leave_end_date,
      leave_reason: leave_reason,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized. Please login.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/leave-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(leaveData),
        }
      );

      if (response.ok) {
        const data = await response.json(); // Expecting JSON response
        setMessage(data.message);
        setLeave_start_date("");
        setLeave_end_date("");
        setLeave_reason("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Failed to submit leave request.");
      }
    } catch (error) {
      setMessage("An error occurred while submitting the leave request.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Submit Leave Request
        </h1>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div>
            <label
              htmlFor="faculty_id"
              className="block text-sm font-medium text-gray-700"
            >
              Faculty ID
            </label>
            <input
              type="text"
              id="faculty_id"
              value={faculty_id}
              onChange={(e) => setFacultyId(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div> */}

          <div>
            <label
              htmlFor="leave_start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="leave_start_date"
              value={leave_start_date}
              onChange={(e) => setLeave_start_date(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="leave_end_date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="leave_end_date"
              value={leave_end_date}
              onChange={(e) => setLeave_end_date(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="leave_reason"
              className="block text-sm font-medium text-gray-700"
            >
              Leave Reason
            </label>
            <textarea
              id="leave_reason"
              value={leave_reason}
              onChange={(e) => setLeave_reason(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default FacultySubmitLeave;
