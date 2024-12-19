import React, { useState, useEffect } from "react";

function StuFine() {
  const [error, setError] = useState("");
  const [fines, setFines] = useState([]);

  // Fetch fines for the student
  useEffect(() => {
    const fetchFines = async () => {
      try {
        const student_id = 1; // Hardcoded student ID for now
        const response = await fetch(
          `http://localhost:5000/api/student/${student_id}/fines`
        );
        if (!response.ok) {
          throw new Error("Error fetching fines");
        }
        const data = await response.json();
        setFines(data.fines || []);
        setError("");
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "An error occurred while fetching fines.");
      }
    };

    fetchFines(); // Fetch fines when component mounts
  }, []);

  // Function to download the fine slip
  const handleDownloadSlip = async () => {
    const student_id = 1; // Hardcoded student ID for now
    try {
      const response = await fetch(
        `http://localhost:5000/api/student/${student_id}/fine-slip`
      );
      if (!response.ok) {
        throw new Error("Error downloading fine slip");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fine-slip.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while downloading the fine slip.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">View Fines</h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {fines.length === 0 ? (
        <p className="text-gray-500 text-center">
          No fines found for this student.
        </p>
      ) : (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Fine ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Student ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Reason
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Fine Date
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => (
                <tr key={fine.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{fine.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {fine.student_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {fine.reason}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {fine.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {fine.fine_date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={handleDownloadSlip}
                    >
                      Download Fine Slip
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

export default StuFine;
