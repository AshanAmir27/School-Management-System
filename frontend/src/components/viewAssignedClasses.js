import React, { useEffect, useState } from "react";

function ViewAssignedClasses() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized Access");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getAssignedClasses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Assigned Classes");
        }
        const data = await response.json();
        console.log("Fetched Assigned Classes:", data);
        setClasses(data.AssignedClass || []);
      } catch (err) {
        console.error("Error Fetching Assigned Classes:", err.message);
        setError(err.message);
      }
    };

    fetchAssignedClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">Assigned Classes</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {classes.length === 0 && !error ? (
        <p className="text-gray-500">No assigned classes available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Faculty ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Class Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Subject
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Time
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Room No.
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">{cls.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {cls.class_name || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {cls.subject}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {cls.time}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {cls.room_no}
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

export default ViewAssignedClasses;
