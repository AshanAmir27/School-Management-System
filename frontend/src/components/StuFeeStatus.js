import React, { useState, useEffect } from "react";

function StuFeeStatus() {
  const [error, setError] = useState("");
  const [feeStatus, setFeeStatus] = useState(null);

  // Fetch fee payment status for the student
  useEffect(() => {
    const fetchFeeStatus = async () => {
      try {
        const student_id = 1; // Hardcoded for now, you can make this dynamic
        const response = await fetch(
          `http://localhost:5000/api/student/${student_id}/fee-status`
        );
        if (!response.ok) {
          throw new Error("Error fetching fee status");
        }
        const data = await response.json();
        setFeeStatus(data.fee_status || {});
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while fetching fee status.");
      }
    };

    fetchFeeStatus(); // Fetch fee status when component mounts
  }, []);

  // Logic for downloading the fee challan
  const handleDownloadChallan = async () => {
    try {
      const student_id = 1; // Hardcoded for now, make it dynamic as needed
      const response = await fetch(
        `http://localhost:5000/api/student/${student_id}/download-challan`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download challan");
      }

      // Create a blob from the response data
      const blob = await response.blob();

      // Create a download link dynamically
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `challan-${student_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(""); // Clear any previous error
    } catch (err) {
      console.error(err);
      setError(
        err.message || "An error occurred while downloading the challan."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Student Fee Status
      </h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {!feeStatus ? (
        <p className="text-gray-500 text-center">No fee status available.</p>
      ) : (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Amount Paid
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Due Date
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {feeStatus.amount_paid}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {feeStatus.total_amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {feeStatus.payment_status}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {feeStatus.due_date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={handleDownloadChallan}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Download Challan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StuFeeStatus;
