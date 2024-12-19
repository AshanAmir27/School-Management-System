import React, { useEffect, useState } from "react";

function ViewFaculty() {
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");
  const [editingFaculty, setEditingFaculty] = useState(null); // For tracking the faculty being edited
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        console.log("Getting faculty data");
        const response = await fetch(
          "http://localhost:5000/api/admin/viewFaculty"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch faculty information");
        }
        const data = await response.json();
        setFaculties(data.data || []); // Correct key: 'data'
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFaculties();
  }, []);

  const handleEdit = (faculty) => {
    // Set the faculty to be edited
    setEditingFaculty(faculty);
    // Set the form data to match the selected faculty
    setFormData({
      username: faculty.username,
      full_name: faculty.full_name,
      email: faculty.email,
      phone: faculty.phone,
      department: faculty.department,
      password: "", // Keep it empty unless the user wants to change the password
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/faculty/${id}`, // Use the actual id of the faculty
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setFaculties(faculties.filter((faculty) => faculty.id !== id));
          alert("Faculty deleted successfully");
        } else {
          throw new Error("Failed to delete faculty");
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, full_name, email, phone, department } =
      formData;

    const updatedFaculty = {
      username,
      password,
      full_name,
      email,
      phone,
      department,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/faculty/${editingFaculty.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFaculty),
        }
      );

      if (response.ok) {
        // const updatedFacultyData = await response.json();
        setFaculties(
          faculties.map((faculty) =>
            faculty.id === editingFaculty.id
              ? { ...faculty, ...updatedFaculty }
              : faculty
          )
        );
        alert("Faculty updated successfully");
        setEditingFaculty(null); // Close the modal after successful update
      } else {
        throw new Error("Failed to update faculty");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">View Faculty</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {faculties.length === 0 && !error ? (
        <p className="text-gray-500">No faculty data available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  #
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
                  Department
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty, index) => (
                <tr key={faculty.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.full_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.phone}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {faculty.department}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 space-x-2">
                    <button
                      onClick={() => handleEdit(faculty)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faculty.id)}
                      className="text-red-500 hover:text-red-700"
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

      {editingFaculty && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Faculty</h2>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleFormChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingFaculty(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewFaculty;
