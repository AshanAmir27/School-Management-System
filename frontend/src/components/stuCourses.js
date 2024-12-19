import React, { useState, useEffect } from "react";

function StuGrades() {
  const [error, setError] = useState("");
  const [grades, setGrades] = useState([]);

  // Fetch grades for the student
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const student_id = 1; // Hardcoded student ID for testing
        const response = await fetch(
          `http://localhost:5000/api/student/${student_id}/grades`
        );
        if (!response.ok) {
          throw new Error("Error fetching grades");
        }
        const data = await response.json();
        console.log("API Response:", data); // Log the response to check what is returned
        setGrades(data.grades || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while fetching grades.");
      }
    };

    fetchGrades(); // Fetch grades when component mounts
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Student Grades
      </h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {grades.length === 0 ? (
        <p className="text-gray-500 text-center">No grade records found.</p>
      ) : (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Subject
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Grade
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Obtained Marks
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Total Marks
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Percentage
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Faculty
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.subject} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.grade}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.obtainedMarks}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.totalMarks}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.percentage}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.faculty_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StuGrades;
