import React, { useState, useEffect } from "react";

function StuAttendance() {
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to access this page");
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/student/attendance",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch attendance data");
        }
        setAttendance(data.attendance || []);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchStatus();
  }, []);

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        Attendance Management
      </h1>
      {error && (
        <div className="mb-6 w-full max-w-2xl text-center">
          <p className="text-red-600 font-medium text-lg">{error}</p>
        </div>
      )}
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                Present
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                Absent
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendance && attendance.length > 0 ? (
              attendance.map((att, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td>{att.created_at ? formatDate(att.created_at) : "N/A"}</td>

                  <td className="px-6 py-4 text-green-600 font-bold">
                    {att.present || 0}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-bold">
                    {att.absent || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StuAttendance;
