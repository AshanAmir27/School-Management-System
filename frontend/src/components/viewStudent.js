import React, { useEffect, useState } from "react";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  // Fetch student data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/viewStudents"
        );
        const data = await response.json();

        console.log("Response data:", data);

        setStudents(data.student || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">View Students</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {students.length === 0 && !error ? (
        <p className="text-gray-500">No student data available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Username
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Full Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Phone
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Class
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.username}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.full_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.phone}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.studentClass}
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

export default ViewStudents;
