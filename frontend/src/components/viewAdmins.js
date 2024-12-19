import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaEdit, FaTrash } from "react-icons/fa"; // Import eye icons

function ViewAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    school_id: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/superAdmin/getAdmins"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }
        const data = await response.json();
        setAdmins(data.admins);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Handle updating admin details
  const handleUpdate = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      password: admin.password,
      full_name: admin.full_name,
      email: admin.email,
      school_id: admin.school_id,
    });
    setModalVisible(true);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for updating admin
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/superAdmin/${selectedAdmin.id}/updateAdmin`,
        formData
      );
      alert(response.data.message);
      setModalVisible(false);

      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === selectedAdmin.id ? { ...admin, ...formData } : admin
        )
      );
    } catch (error) {
      alert("Failed to update admin");
    }
  };

  // Handle admin deletion
  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    setModalDelete(false);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/superAdmin/deleteAdmin/${selectedAdmin.id}`
      );
      alert(response.data.message);

      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.id !== selectedAdmin.id)
      );
      setSelectedAdmin(null);
    } catch (error) {
      alert("Error deleting admin");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Admins</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Admins"
          className="border p-2 w-64"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredAdmins.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">School ID</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{admin.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.school_id || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.username}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.full_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.email}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    className="text-blue-500 p-1"
                    onClick={() => handleUpdate(admin)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 p-1"
                    onClick={() => handleDelete(admin)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-gray-400">No admins found.</p>
      )}

      {/* Modal for updating admin */}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Admin</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="border w-full p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border w-full p-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="border w-full p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border w-full p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="school_id"
                >
                  School ID
                </label>
                <input
                  type="number"
                  id="school_id"
                  name="school_id"
                  value={formData.school_id}
                  onChange={handleInputChange}
                  className="border w-full p-2"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
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

      {/* Delete Modal */}
      {modalDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h1 className="text-center">Are you sure you want to delete?</h1>
            <div className="mt-5 flex justify-center gap-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setModalDelete(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAdmins;
