import React, { useEffect, useState } from "react";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view students");
        return;
      }

      console.log(token);
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/viewStudents",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Correct placement of the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data.student || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudents();
  }, []);

  // Open modal to edit student
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Update student information in the state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated student data
  const handleSave = async () => {
    console.log("Saving student data:", selectedStudent);

    const { password, studentClass, ...studentData } = selectedStudent;
    studentData.class = studentClass; // Rename field
    delete studentData.studentClass;

    const requiredFields = ["full_name", "email", "phone", "class", "username"];

    for (let field of requiredFields) {
      if (!studentData[field]) {
        alert(`${field} is required.`);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update student data");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/students/${selectedStudent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Correct placement of the Authorization header
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update student");
      }

      setStudents((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id ? selectedStudent : student
        )
      );
      alert("Student updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a student");
      return; // Ensure function exits if no token
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/students/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Correct placement of the Authorization header
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete student");
      }

      setStudents(students.filter((student) => student.id !== id));
      alert("Student deleted successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">View Students</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {students.length === 0 && !error ? (
        <p className="text-gray-500">No student data available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  #
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
                  Class
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.username}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.full_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.phone}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {student.studentClass}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 flex gap-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
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
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="full_name"
                value={selectedStudent.full_name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={selectedStudent.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                value={selectedStudent.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="studentClass"
                value={selectedStudent.studentClass}
                onChange={handleInputChange}
                placeholder="Class"
                className="w-full px-4 py-2 border rounded"
              />
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

export default ViewStudents;
