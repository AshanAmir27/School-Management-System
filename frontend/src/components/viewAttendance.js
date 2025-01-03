import React, { useState, useEffect } from "react";

function StuAttendance() {
  const [error, setError] = useState("");
  const [classId, setClassId] = useState(""); // Selected class ID
  const [classes, setClasses] = useState([]); // List of available classes
  const [students, setStudents] = useState([]); // List of students based on selected class
  const [attendanceList, setAttendanceList] = useState([]); // List of attendance status for students

  // Fetch classes on component load
  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view this page.");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/getClasses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error fetching classes");

        const data = await response.json();

        setClasses(data.classes || []);

        setError("");
      } catch (err) {
        console.error(err.message);
        setError(err.message || "An error occurred while fetching classes.");
      }
    };

    fetchClasses();
  }, []);

  // Fetch students based on selected class ID
  const fetchStudentsByClass = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("unauthorized");
    }
    try {
      if (!classId) {
        setError("Please select a class.");
        return;
      }
      console.log("Class id from frontend", classId);
      const response = await fetch(
        `http://localhost:5000/api/faculty/getStudents/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching students data");
      }

      const data = await response.json();
      console.log("Students API Response:", data);

      setStudents(data.students || []); // Set the students data
      setAttendanceList(
        data.students.map((student) => ({
          student_id: student.student_id,
          status: "absent", // Default status is absent
          present: 0, // Default count of present
          absent: 1, // Default count of absent
        }))
      ); // Initialize attendance list with default absent status
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while fetching students.");
    }
  };

  // Handle attendance status change
  const handleStatusChange = (studentId, status) => {
    setAttendanceList((prevList) =>
      prevList.map((attendance) =>
        attendance.student_id === studentId
          ? {
              ...attendance,
              status,
              present:
                status === "present"
                  ? attendance.present + 1
                  : attendance.present,
              absent:
                status === "absent" ? attendance.absent + 1 : attendance.absent,
            }
          : attendance
      )
    );
  };

  const submitAttendance = async () => {
    if (!classId || attendanceList.length === 0) {
      setError("Class or attendance data is missing.");
      return;
    }

    try {
      const attendanceData = attendanceList.map((attendance) => ({
        student_id: attendance.student_id,
        status: attendance.status, // Just send status ('present' or 'absent')
      }));
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view this page.");
      }
      const response = await fetch(
        "http://localhost:5000/api/faculty/markAttendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            classId: classId,
            attendance: attendanceData, // Send the updated attendance list
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error submitting attendance");
      }

      const data = await response.json();
      console.log("Attendance submitted successfully:", data);
      setError(""); // Clear any previous errors
      alert("Attendance marked successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while submitting attendance.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Students Attendance Management
      </h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <div className="mb-6">
        <label
          htmlFor="classId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Class:
        </label>
        <select
          id="classId"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select Class --</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <button
          onClick={fetchStudentsByClass}
          className="ml-4 px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
        >
          Fetch Students
        </button>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-500 text-center">No students found.</p>
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
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Attendance Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((attendance) => (
                <tr
                  key={attendance.student_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {attendance.student_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {
                      students.find(
                        (student) =>
                          student.student_id === attendance.student_id
                      )?.full_name
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {
                      students.find(
                        (student) =>
                          student.student_id === attendance.student_id
                      )?.email
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <select
                      value={attendance.status}
                      onChange={(e) =>
                        handleStatusChange(
                          attendance.student_id,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-md px-4 py-2"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={submitAttendance}
        className="mt-6 px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
      >
        Submit Attendance
      </button>
    </div>
  );
}

export default StuAttendance;
