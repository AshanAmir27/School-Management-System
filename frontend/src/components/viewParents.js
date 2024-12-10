import React, { useEffect, useState } from "react";

function ViewParents() {
  const [parents, setParents] = useState([]);
  const [error, setError] = useState("");

  // Fetch Parent data
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/viewParents"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch parent information");
        }
        const data = await response.json();
        setParents(data.parents || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchParents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">View Parents</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {parents.length === 0 && !error ? (
        <p className="text-gray-500">No parent data available.</p>
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
                  Student Id
                </th>
              </tr>
            </thead>
            <tbody>
              {parents.map((parent, index) => (
                <tr key={parent.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.username}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.full_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.phone}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.student_id}
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

export default ViewParents;
