import React, { useState, useEffect } from "react";

function StuAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Unauthorized Access , please login again");
  }
  // Fetch assignments when the component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student/assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        if (data.success) {
          setAssignments(data.data || []);
          setError("");
        } else {
          setError("No assignments found.");
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError(
          err.message || "An error occurred while fetching assignments."
        );
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Due Assignments
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {assignments.length === 0 && !error ? (
        <p className="text-gray-500">No assignments due at the moment.</p>
      ) : (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Subject
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Title
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Description
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr
                  key={assignment.assignment_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {assignment.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {assignment.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {assignment.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {assignment.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {assignment.due_date}
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

export default StuAssignments;
