import React, { useEffect, useState } from "react";

function FeePayment() {
  const [payment, setPayment] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getFeeDetail"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fee details");
        }
        const data = await response.json();
        console.log("API response:", data);
        setPayment(data.feePayment || []); // Ensure it's an array
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFeeDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">Fee Payment Detail</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {payment.length === 0 ? (
        <p className="text-gray-500">No fee payment details available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Student ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Amount Paid
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Total amount
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Payment status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {payment.map((payments) => (
                <tr key={payments.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {payments.student_id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {payments.amount_paid}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {payments.total_amount}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {payments.payment_status}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {payments.due_date}
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

export default FeePayment;
