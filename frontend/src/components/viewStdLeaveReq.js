import React, { useEffect, useState } from "react";

function ViewStdLeaveReq() {
  const [request, setRequest] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaveRequest = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/getLeaveRequest",
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
    const student_id = 1;
    try {
      const response = await fetch(
        `http://localhost:5000/api/faculty/${student_id}/updateLeaveStatus`,
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Student Leave Requests
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {request.length === 0 && !error ? (
        <p className="text-gray-500">No leave requests available.</p>
      ) : (
        <div className="w-full max-w-7xl">
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm font-semibold">
                <th className="px-6 py-3 text-left">Student ID</th>
                <th className="px-6 py-3 text-left">Leave Start Date</th>
                <th className="px-6 py-3 text-left">Leave End Date</th>
                <th className="px-6 py-3 text-left">Leave Reason</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {request.map((req) => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {req.student_id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {req.leave_start_date}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {req.leave_end_date}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {req.leave_reason}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {req.status}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 flex gap-3">
                    <button
                      className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition"
                      onClick={() => handleStatusChange(req.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition"
                      onClick={() => handleStatusChange(req.id, "Rejected")}
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

export default ViewStdLeaveReq;
