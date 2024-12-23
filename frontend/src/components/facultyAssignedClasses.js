import React, { useState, useEffect } from "react";

function FacultyAssignedClasses() {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        const facultyId = 3; // Replace with the actual faculty ID, or make it dynamic
        const response = await fetch(
          `http://localhost:5000/api/faculty/${facultyId}/classes`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned classes.");
        }

        const data = await response.json();
        setAssignedClasses(data.classes || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedClasses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Faculty Assigned Classes
      </h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {assignedClasses.length === 0 && !loading && (
        <p className="text-gray-500 text-center">No assigned classes found.</p>
      )}

      {assignedClasses.length > 0 && (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Class Name
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Subject
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Time
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Room Number
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Year
                </th>
              </tr>
            </thead>
            <tbody>
              {assignedClasses.map((classItem, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {classItem.class_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {classItem.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {classItem.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {classItem.room_no}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {classItem.year}
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

export default FacultyAssignedClasses;
