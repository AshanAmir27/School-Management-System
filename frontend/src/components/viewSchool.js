import React, { useEffect, useState } from "react";

function ViewSchools() {
  const [schools, setSchool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null); // For the selected school
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_number: "",
    email: "",
    established_year: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // State for delete confirmation modal
  const [schoolToDelete, setSchoolToDelete] = useState(null); // Store school to delete

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/superAdmin/getSchools"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch schools");
        }
        const data = await response.json();
        setSchool(data.schools);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleEditClick = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      contact_number: school.contact_number,
      email: school.email,
      established_year: school.established_year,
    });
    setIsModalOpen(true); // Open modal when edit button is clicked
  };

  const handleDeleteClick = (school) => {
    setSchoolToDelete(school); // Set the school to be deleted
    setIsDeleteConfirmOpen(true); // Open the confirmation dialog
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.address ||
      !formData.contact_number ||
      !formData.email ||
      !formData.established_year
    ) {
      alert("All fields are required.");
      return;
    }

    try {
      // Sending the updated school data to the backend (ensure the id is included in the URL)
      const response = await fetch(
        `http://localhost:5000/api/superAdmin/${selectedSchool.id}/updateSchools`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update school");
      }

      const updatedSchool = await response.json();
      console.log("Updated School:", updatedSchool);

      // Immediately update the local state (no need to reload the page)
      setSchool((prevSchools) =>
        prevSchools.map((school) =>
          school.id === selectedSchool.id ? { ...school, ...formData } : school
        )
      );

      // Close the modal and reset the state
      setIsModalOpen(false);
      setSelectedSchool(null);
      setFormData({
        name: "",
        address: "",
        contact_number: "",
        email: "",
        established_year: "",
      });
    } catch (err) {
      console.error("Error updating school:", err.message);
      setError(err.message);
    }
  };

  const handleDeleteSchool = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/superAdmin/${schoolToDelete.id}/deleteSchool`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete school");
      }

      // Remove the deleted school from local state
      setSchool(schools.filter((school) => school.id !== schoolToDelete.id));
      setIsDeleteConfirmOpen(false); // Close the confirmation modal
      setSchoolToDelete(null); // Clear selected school for deletion
      alert("School deleted successfully");
    } catch (err) {
      console.error("Error deleting school:", err.message);
      setError(err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchool(null);
    setFormData({
      name: "",
      address: "",
      contact_number: "",
      email: "",
      established_year: "",
    });
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setSchoolToDelete(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">View Schools</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && Array.isArray(schools) && schools.length > 0 ? (
        <>
          <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Id</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">
                  Contact Number
                </th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">
                  Established Year
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {school.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {school.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {school.address}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {school.contact_number}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {school.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {school.established_year || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEditClick(school)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(school)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for Editing */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Edit School</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Established Year
                    </label>
                    <input
                      type="number"
                      name="established_year"
                      value={formData.established_year}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-400 text-white p-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">
                  Are you sure you want to delete this school?
                </h2>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={closeDeleteConfirm}
                    className="bg-gray-400 text-white p-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSchool}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        !loading && <p className="text-gray-400">No schools found.</p>
      )}
    </div>
  );
}

export default ViewSchools;
