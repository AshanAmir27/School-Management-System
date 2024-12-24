import React, { useEffect, useState } from "react";

function StuAnnouncement() {
  const [announcement, setAnnouncement] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (!token) {
        setError("User is not logged in. Please log in to view announcements.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getAnnouncements",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch announcements");
        }

        const data = await response.json();
        console.log("Announcements data:", data);
        setAnnouncement(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching announcements:", err); // Debugging
      }
    };

    fetchAnnouncements();
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

export default StuAnnouncement;
