import React, { useEffect, useState } from "react";
import axios from "axios";

function AddGrade() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    classId: "",
    subject: "",
    obtainedMarks: "",
    totalMarks: "",
    grade: "",
    remarks: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Handle unauthorized access
  useEffect(() => {
    if (!token) {
      alert("Unauthorized Access, Please Login again!");
    }
  }, [token]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!token) return; // Prevent the API call if the token is missing
      try {
        const response = await axios.get(
          "http://localhost:5000/api/faculty/getClasses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClasses(response.data.classes);
      } catch (err) {
        console.error("Error fetching classes:", err.message);
      }
    };
    fetchClasses();
  }, [token]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token || !formData.classId) return; // Skip if no token or classId

      try {
        const response = await axios.get(
          `http://localhost:5000/api/faculty/getStudents/${formData.classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(response.data.students);
      } catch (err) {
        console.error("Error fetching students:", err.message);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [formData.classId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      alert("Unauthorized Access, Please Login again!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/faculty/grades",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message || "Grade added successfully!");
      setFormData({
        student_id: "",
        classId: "",
        subject: "",
        obtainedMarks: "",
        totalMarks: "",
        grade: "",
        remarks: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add grade.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add Grade
        </h1>

        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class ID
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((classItem, index) => (
                <option key={index} value={classItem}>
                  {classItem}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Student</option>
              {students.map((student, index) => (
                <option key={index} value={student.student_id}>
                  {student.full_name} {student.id}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Obtained Marks
            </label>
            <input
              type="number"
              step="0.01"
              name="obtainedMarks"
              value={formData.obtainedMarks}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Marks
            </label>
            <input
              type="number"
              step="0.01"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Grade
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddGrade;
