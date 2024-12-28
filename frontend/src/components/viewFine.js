import React, { useState, useEffect } from "react";

function ViewFine() {
  const [fines, setFines] = useState([]);
  const [selectedFineId, setSelectedFineId] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [status, setStatus] = useState("Paid");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in. Please login first");
    // Optionally redirect
    // window.location.href = "http://localhost:3000/login";
  }

  const fetchFines = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/getFineDetail",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch fines");
      }

      const data = await response.json();
      setFines(data.fine);
    } catch (err) {
      console.error("Error fetching fines:", err);
    }
  };

  // Initial fetch of fines when component mounts
  useEffect(() => {
    fetchFines();
  }, [token]);

  const handleShowForm = (fineId) => {
    setSelectedFineId(fineId);
    setShowForm(true);
  };

  const handleDelete = async (fineId, student_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/${student_id}/fine`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fine_id: fineId }), // Sending fine_id here
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete fine");
      }

      const data = await response.json();
      console.log("Fine deleted:", data);

      // Update the fine status in the UI
      fetchFines();
    } catch (err) {
      console.error("Error deleting fine:", err);
    }
  };

  const handlePaid = async (e, fineId) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/student/${fineId}/fine`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fineId, status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update fine");
      }

      const data = await response.json();
      console.log("Fine updated:", data);

      // Update the fine status in the UI
      fetchFines();

      setShowForm(false); // Hide the form after successful update
    } catch (err) {
      console.error("Error updating fine:", err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Fines
      </h1>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Student ID</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine) => (
            <tr key={fine.id}>
              <td className="text-center">{fine.id}</td>
              <td className="text-center">{fine.student_id}</td>
              <td className="text-center">{fine.amount}</td>
              <td className="text-center">{fine.reason}</td>
              <td className="text-center">{fine.status}</td>
              <td className="text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleShowForm(fine.student_id)} // Updated function name
                >
                  Paid
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(fine.student_id, fine.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup form for updating fine */}
      {showForm && selectedFineId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Update Fine</h2>
            <form onSubmit={(e) => handlePaid(e, selectedFineId)}>
              <label>Status: </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mb-4 p-2 border rounded"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 ml-2 rounded"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ViewFine;
