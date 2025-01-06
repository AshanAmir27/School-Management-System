import React, { useState, useEffect } from "react";

function StuGrades() {
  const [error, setError] = useState("");
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("stuToken");
    const studentData = JSON.parse(sessionStorage.getItem("studentData"));
    console.log(studentData);
    if (!token || !studentData) {
      alert("Unauthorized access. Please log in.");
      window.location.href = "/login";
      return;
    }

    const fetchGrades = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student/grades",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              student_id: studentData.student_id,
              class: studentData.class,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setGrades(data);
        } else {
          setError(data.error || "Failed to fetch grades");
        }
      } catch (err) {
        setError("An error occurred while fetching grades.");
        console.error("Error fetching grades:", err);
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
            {grades.map((grade, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
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
