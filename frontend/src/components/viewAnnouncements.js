import React, { useEffect, useState } from "react";

function ViewAnnouncement() {
  const [announcement, setAnnouncement] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      console.log("Token retrieved:", token); // Debugging

      if (!token) {
        setError("User is not logged in. Please log in to view announcements.");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getAnnouncements",
          {
            headers: {
              "Content-Type": "application/json", // Include Content-Type header
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        console.log("API response:", data);
        setAnnouncement(Array.isArray(data) ? data : []); // Ensure it's an array
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSchools();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Announcements
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {announcement.length === 0 && !error ? (
        <p className="text-gray-500">No announcements available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {announcement.map((announcements) => (
                <tr
                  key={announcements.id}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {announcements.id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {announcements.title}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {announcements.message}
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

export default ViewAnnouncement;
