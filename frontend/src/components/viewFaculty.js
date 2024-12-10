import React, { useEffect, useState } from "react";

function ViewFaculty() {
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");

  // Fetch faculty data
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/viewFaculty"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch faculty information");
        }
        const data = await response.json();
        setFaculties(data.faculties || []); // Ensure data is in the expected format
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFaculties();
  }, []); // Runs once when the component mounts

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">View Faculty</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {faculties.length === 0 && !error ? (
        <p className="text-gray-500">No faculty data available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  #
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
                  Department
                </th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty, index) => (
                <tr key={faculty.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.full_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.phone}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.department}
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

export default ViewFaculty;
