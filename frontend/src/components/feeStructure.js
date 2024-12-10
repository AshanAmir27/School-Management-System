import React, { useEffect, useState } from "react";

function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState([]);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    id: "",
    class_name: "",
    amount: "",
    academic_year: "",
  });

  // Fetch all fee structures
  const fetchFeeStructures = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/fees/all");
      if (!response.ok) {
        throw new Error("Failed to fetch fee structures");
      }
      const data = await response.json();
      setFeeStructures(data.feeStructures || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create/update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = form.id ? "PUT" : "POST";
      const endpoint = form.id
        ? `http://localhost:5000/api/admin/fees/${form.id}`
        : "http://localhost:5000/api/admin/fees";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class: form.class_name,
          amount: form.amount,
          academic_year: form.academic_year,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save fee structure");
      }
      fetchFeeStructures();
      setForm({ id: "", class_name: "", amount: "", academic_year: "" });
      setFormVisible(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete fee structure
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/fees/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete fee structure");
      }
      fetchFeeStructures();
    } catch (err) {
      setError(err.message);
    }
  };

  // Load fee structures on component mount
  useEffect(() => {
    fetchFeeStructures();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="flex space-x-96">
        <h1 className="text-3xl font-bold mb-6">Fee Structure Management</h1>

        {/* Add Fee Button */}
        <button
          onClick={() => {
            setFormVisible(!formVisible);
            setForm({ id: "", class_name: "", amount: "", academic_year: "" }); // Reset form for new entry
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {formVisible ? "Close Form" : "Add Fee"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form for Create/Update */}
      {formVisible && (
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class Name
            </label>
            <input
              type="text"
              name="class_name"
              value={form.class_name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="Enter class name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Academic Year
            </label>
            <input
              type="text"
              name="academic_year"
              value={form.academic_year}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="Enter academic year (e.g., 2023-2024)"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {form.id ? "Update Fee Structure" : "Create Fee Structure"}
          </button>
        </form>
      )}

      {/* Fee Structures Table */}
      <table className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              ID
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Class
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Amount
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Academic Year
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {feeStructures.map((structure) => (
            <tr key={structure.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-3 text-sm text-gray-700">
                {structure.id}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {structure.class}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {structure.amount}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {structure.academic_year}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700 flex space-x-2">
                <button
                  onClick={() => {
                    setForm({
                      id: structure.id,
                      class_name: structure.class,
                      amount: structure.amount,
                      academic_year: structure.academic_year,
                    });
                    setFormVisible(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(structure.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeeStructure;
