import React, { useEffect, useState } from "react";

function ViewParents() {
  const [parents, setParents] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  // Fetch Parent data
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("You must be logged in to view parent information");
    }
    const fetchParents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/viewParents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch parent information");
        }
        const data = await response.json();
        setParents(data.parents || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchParents();
  }, []);

  // Handle Edit button click
  const handleEdit = (parent) => {
    setSelectedParent(parent);
    setIsModalOpen(true);
  };

  // Handle input change in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedParent((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save action
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update parent information");
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/parents/${selectedParent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedParent),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update parent information");
      }

      setParents((prev) =>
        prev.map((parent) =>
          parent.id === selectedParent.id ? selectedParent : parent
        )
      );
      alert("Parent information updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this parent?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete parent information");
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/parents/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete parent");
      }

      setParents(parents.filter((parent) => parent.id !== id));
      alert("Parent deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">View Parents</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {parents.length === 0 && !error ? (
        <p className="text-gray-500">No parent data available.</p>
      ) : (
        <div className="w-full max-w-5xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Student Id
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Username
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Full Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Phone
                </th>

                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {parents.map((parent, index) => (
                <tr key={parent.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-12 py-3 text-sm text-gray-700">
                    {parent.student_id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.username}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.full_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {parent.phone}
                  </td>

                  <td className="px-6 py-3 text-sm text-gray-700 flex gap-2">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedParent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Parent</h2>
            <div className="space-y-4">
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={selectedParent.full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={selectedParent.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedParent.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>Student Id</label>
                <input
                  type="text"
                  name="student_id"
                  value={selectedParent.student_id}
                  onChange={handleInputChange}
                  placeholder="Student ID"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewParents;
