import React, { useState, useEffect } from "react";

function StuAttendance() {
  const [error, setError] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  // Fetch student data
  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/getStudentList"
        );
        if (!response.ok) {
          throw new Error("Error fetching student list");
        }
        const data = await response.json();
        console.log("Student List API Response:", data);
        setStudentList(data.StudentList || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while fetching students.");
      }
    };
    fetchStudentList();
  }, []);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/getAttendance"
        );
        if (!response.ok) {
          throw new Error("Error fetching attendance data");
        }
        const data = await response.json();
        console.log("Attendance API Response:", data);
        setAttendanceList(data.data || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while fetching attendance.");
      }
    };
    fetchAttendanceList();
  }, []);

  // Merge student and attendance data
  useEffect(() => {
    if (studentList.length > 0 && attendanceList.length > 0) {
      const merged = studentList.map((student) => {
        const attendance = attendanceList.find(
          (att) => String(att.student_id) === String(student.id)
        );
        return {
          student_id: student.id,
          full_name: student.full_name,
          email: student.email,
          updated_at: attendance.updated_at,
          attendance_status: attendance ? attendance.status : "not marked",
        };
      });
      setMergedData(merged);
    } else {
      setMergedData([]);
    }
  }, [studentList, attendanceList]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Attendance Management
      </h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {mergedData.length === 0 ? (
        <p className="text-gray-500 text-center">No students available.</p>
      ) : (
        <div className="overflow-x-auto w-full px-4 sm:px-8">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Student ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Full Name
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Date
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Attendance Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mergedData.map((student) => (
                <tr
                  key={student.student_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.student_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.updated_at}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.attendance_status}
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

export default StuAttendance;
