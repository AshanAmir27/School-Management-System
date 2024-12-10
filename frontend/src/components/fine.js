import React, { useEffect, useState } from "react";

function Fine() {
  const [fineDetails, setFineDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFineDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getFineDetail"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fine details");
        }
        const data = await response.json();
        console.log("Fetched Fine Details:", data); // Logging API response
        setFineDetails(data.fine); // Set state here
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFineDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">Student Fine Details</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {fineDetails.length === 0 && !error ? (
        <p className="text-gray-500">No fine details available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Student ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Fine Amount
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Reason
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Fine Date
                </th>
              </tr>
            </thead>
            <tbody>
              {fineDetails.map((fine) => (
                <tr key={fine.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {fine.student_id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {fine.amount}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {fine.reason}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {new Date(fine.fine_date).toLocaleDateString()}
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

export default Fine;
