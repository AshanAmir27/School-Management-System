import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch grades when the component mounts
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/faculty/getGrades"
        );
        setGrades(response.data.grades); // Assuming response contains a 'grades' array
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch grades.");
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">View Grades</h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {loading && (
        <p className="text-center text-gray-500">Loading grades...</p>
      )}

      {/* Show message if no grades are found */}
      {!loading && !error && grades.length === 0 && (
        <p className="text-gray-500 text-center">No grades available.</p>
      )}

      {/* Table to display grades */}
      {!loading && !error && grades.length > 0 && (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Student ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Class ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Subject
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Obtained Marks
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Total Marks
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Grade
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.student_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.classId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.obtainedMarks}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.totalMarks}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.grade}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {grade.remarks}
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

export default ViewGrades;
