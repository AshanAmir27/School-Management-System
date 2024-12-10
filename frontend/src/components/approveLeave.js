import React, { useEffect, useState } from "react";

function ApproveLeave() {
  const [request, setRequest] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaveRequest = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getLeave_request",
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Leave Request");
        }
        const data = await response.json();
        setRequest(data.request || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeaveRequest();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/updateLeaveStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update leave status");
      }

      // Update the local state to reflect the status change
      setRequest((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">Approve Request</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {request.length === 0 && !error ? (
        <p className="text-gray-500">No request data available.</p>
      ) : (
        <div className="w-full max-w-6xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Faculty Id
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Leave Start Date
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Leave End Date
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Leave Reason
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Request date
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {request.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {request.faculty_id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {request.leave_start_date}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {request.leave_end_date}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {request.leave_reason}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {request.status}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {request.request_date}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 flex gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleStatusChange(request.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleStatusChange(request.id, "Rejected")}
                    >
                      Reject
                    </button>
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

export default ApproveLeave;
