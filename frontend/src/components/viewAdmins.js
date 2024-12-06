import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

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
        console.log("Fetched Admins Data:", data);
        setAdmins(data.admins);
        setLoading(false);
      } catch (err) {
        console.error("Error Fetching Admins:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

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

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAdmin(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/superAdmin/${selectedAdmin.id}/updateAdmin`,
        formData
      );
      alert(response.data.message);
      setModalVisible(false);

      // Update admins list locally
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === selectedAdmin.id ? { ...admin, ...formData } : admin
        )
      );
    } catch (error) {
      console.log("Error updating admin", error);
      alert("Failed to update admin");
    }
  };

  const handleDelete = (admin) => {
    setSelectedAdmin(admin); // Set selected admin for deletion
    setModalDelete(true);
  };

  const handleCancel = () => {
    setModalDelete(false);
  };

  const handleConfirmDelete = async () => {
    setModalDelete(false);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/superAdmin/deleteAdmin/${selectedAdmin.id}`
      );

      alert(response.data.message);

      // Remove deleted admin from the list
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.id !== selectedAdmin.id)
      );
      setSelectedAdmin(null); // Reset selected admin
    } catch (error) {
      console.log("Error deleting admin", error);
      alert("Error in deleting admin");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">View Admins</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && Array.isArray(admins) && admins.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">School ID</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              console.log("Rendering Admin:", admin); // Debug log
              return (
                <tr key={admin.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {admin.id}
                  </td>
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
                  <td className="border border-gray-300 px-4 py-2 ">
                    <button
                      className="text-blue-500 p-1  px-2"
                      onClick={() => handleUpdate(admin)}
                    >
                      Edit
                    </button>
                    <button
                      className=" ml-2 p-1 text-red-500 px-2"
                      onClick={() => handleDelete(admin)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
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
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
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
                  onClick={handleCloseModal}
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

      {modalDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 gap-4">
            <h1 className="text-center">Are you sure you want to delete?</h1>
            <div className="mt-5 flex justify-center gap-10">
              <button
                className="bg-blue-500 text-white p-1"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white p-1"
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
