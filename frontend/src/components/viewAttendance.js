import React, { useState, useEffect } from "react";

function ViewAttendance() {
  const [error, setError] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  // Fetch student data
  useEffect(() => {
    const handleFetchStudent = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/getStudentList"
        );
        if (!response.ok) {
          throw new Error("Error fetching student list");
        }
        const data = await response.json();
        console.log("Fetched Student list:", data);

        if (data.StudentList && Array.isArray(data.StudentList)) {
          setStudentList(data.StudentList);
        } else {
          throw new Error(
            "Invalid data format: 'StudentList' not found or not an array."
          );
        }
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error:", error);
        setError(error.message || "An error occurred while fetching data.");
        setStudentList([]); // Reset student list on error
      }
    };

    handleFetchStudent();
  }, []); // Empty dependency array ensures this runs only once

  // Fetch attendance data
  useEffect(() => {
    const handleFetchAttendance = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/getAttendance"
        );
        if (!response.ok) {
          throw new Error("Error fetching attendance data");
        }
        const data = await response.json();
        console.log("Fetched Attendance data:", data);

        if (data.attendance && Array.isArray(data.attendance)) {
          setAttendanceList(data.attendance);
        } else {
          throw new Error(
            "Invalid data format: 'attendance' not found or not an array."
          );
        }
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error:", error);
        setError(
          error.message || "An error occurred while fetching attendance data."
        );
        setAttendanceList([]); // Reset attendance list on error
      }
    };

    handleFetchAttendance();
  }, []); // Empty dependency array ensures this runs only once

  // Merge student and attendance data
  useEffect(() => {
    if (studentList.length > 0 && attendanceList.length > 0) {
      // Merge data by matching student.id and attendance.student_id
      const merged = studentList.map((student) => {
        const attendance = attendanceList.find(
          (att) => String(att.student_id) === String(student.id) // Ensure matching IDs are consistent
        );

        // Debugging: Log attendance and status for each student
        console.log(`Checking attendance for student ID: ${student.id}`);
        console.log(`Found attendance:`, attendance);

        // Check if attendance is found and if the status is valid
        return {
          ...student,
          attendance_status:
            attendance && attendance.status ? attendance.status : "not marked", // Add attendance status
        };
      });

      console.log("Merged data", merged);

      // Update merged data state
      setMergedData(merged);
    }
  }, [studentList, attendanceList]); // Re-run this effect when either list changes

  const handleAbsent = async (studentId) => {
    const facultyId = 2; // Or dynamically get it from the user's session or state

    try {
      const response = await fetch(
        `http://localhost:5000/api/faculty/${facultyId}/update-attendance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentId,
            status: "Absent",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating attendance");
      }

      const data = await response.json();
      console.log("Attendance updated successfully:", data);

      // Update the merged data state to reflect the change in the UI
      setMergedData((prevData) =>
        prevData.map((student) =>
          student.id === studentId
            ? { ...student, attendance_status: "Absent" } // Update status
            : student
        )
      );
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred while updating attendance.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">View Attendance</h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {mergedData.length === 0 && !error ? (
        <p className="text-gray-500">No students available.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Student ID
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
                  Attendance Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(mergedData) &&
                mergedData.map((std) => (
                  <tr key={std.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {std.id}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {std.username || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {std.full_name || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {std.email || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {std.phone || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {std.class || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {std.attendance_status || "No Data"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700 flex justify-between">
                      <button
                        className="bg-red-500 text-white p-1"
                        onClick={() => handleAbsent(std.id)} // Pass the student ID
                      >
                        A
                      </button>

                      <button className="bg-green-500 text-white p-1">P</button>
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

export default ViewAttendance;
