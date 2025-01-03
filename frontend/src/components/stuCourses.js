import React, { useState, useEffect } from "react";

function StuGrades() {
  const [error, setError] = useState("");
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized access. Please log in.");
      window.location.href = "/login"; // Redirect to login page
      return;
    }

    const fetchGrades = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student/grades",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch grades");
        }
        const data = await response.json();
        setGrades(data.grades || []);
        setError("");
      } catch (err) {
        console.error("Error fetching grades:", err.message);
        setError(err.message || "An error occurred.");
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Student Grades
      </h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {grades.length === 0 ? (
        <p className="text-gray-500">No grade records found.</p>
      ) : (
        <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Obtained Marks</th>
              <th className="px-4 py-2">Total Marks</th>
              <th className="px-4 py-2">Percentage</th>
              <th className="px-4 py-2">Faculty</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.subject} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{grade.subject}</td>
                <td className="px-4 py-2">{grade.grade}</td>
                <td className="px-4 py-2">{grade.obtainedMarks}</td>
                <td className="px-4 py-2">{grade.totalMarks}</td>
                <td className="px-4 py-2">{grade.percentage}%</td>
                <td className="px-4 py-2">{grade.faculty_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StuGrades;
