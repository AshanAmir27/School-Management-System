import React, { useState, useEffect } from "react";

function StuAttendance() {
  const [error, setError] = useState("");
  const [classId, setClassId] = useState(""); // State for selected class ID
  const [attendanceList, setAttendanceList] = useState([]);

  // Fetch attendance based on class ID
  const fetchAttendanceByClass = async () => {
    try {
      if (!classId) {
        setError("Please select a class.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/getAttendance?classId=${classId}`
      );

      if (!response.ok) {
        throw new Error("Error fetching attendance data");
      }

      const data = await response.json();
      console.log("Attendance API Response:", data);

      setAttendanceList(data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while fetching attendance.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Attendance Management
      </h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <div className="mb-6">
        <label
          htmlFor="classId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Class:
        </label>
        <select
          id="classId"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select Class --</option>
          <option value="1">Class 1</option>
          <option value="2">Class 2</option>
          <option value="3">Class 3</option>
          {/* Add more class options as needed */}
        </select>
        <button
          onClick={fetchAttendanceByClass}
          className="ml-4 px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
        >
          Fetch Attendance
        </button>
      </div>

      {attendanceList.length === 0 ? (
        <p className="text-gray-500 text-center">
          No attendance records found.
        </p>
      ) : (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Student ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Full Name
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Date
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Attendance Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((record) => (
                <tr
                  key={record.student_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.student_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.updated_at}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StuAttendance;
