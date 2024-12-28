import React, { useEffect, useState } from "react";

function Fine() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState(""); // State for student name
  const [fineAmount, setFineAmount] = useState("");
  const [fineReason, setFineReason] = useState("");
  const [error, setError] = useState(null);

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/classes");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data.classes); // Set available classes
      } catch (err) {
        setError(err.message);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students based on selected class
  const fetchStudents = async (class_name) => {
    try {
      const url = `http://localhost:5000/api/admin/students?class_name=${class_name}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data.students); // Set students for the selected class
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedStudentId("");
    setSelectedStudentName("");
    fetchStudents(e.target.value);
  };

  // Handle student ID selection
  const handleStudentIdChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);

    // Find the student's name from the list of students
    const selectedStudent = students.find(
      (student) => student.id === studentId
    );
    if (selectedStudent) {
      setSelectedStudentName(selectedStudent.name); // Set student name if found
    } else {
      setSelectedStudentName(""); // Reset if no match is found
    }
  };

  // Handle fine submission
  const handleFineSubmit = async (e) => {
    e.preventDefault();

    if (!fineAmount || !fineReason || !selectedStudentId) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/student/${selectedStudentId}/fine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: fineAmount,
            reason: fineReason,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFineAmount("");
        setFineReason("");
        setSelectedStudentId("");
        setSelectedStudentName("");
        setError(null);
        alert("Fine assigned successfully");
      } else {
        setError(data.error || "Failed to add fine.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-6">Charge Fine to Student</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form to assign fine to a student */}
      <form
        onSubmit={handleFineSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div>
          <label
            htmlFor="class_name"
            className="block text-gray-700 font-medium mb-2"
          >
            Select Class
          </label>
          <select
            id="class_name"
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
          >
            <option value="">Select a class</option>
            {classes.map((classItem) => (
              <option key={classItem.class} value={classItem.class}>
                {classItem.class}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="student_id"
            className="block text-gray-700 font-medium mb-2"
          >
            Select Student
          </label>
          <select
            id="student_id"
            value={selectedStudentId}
            onChange={handleStudentIdChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} (ID: {student.id})
              </option>
            ))}
          </select>
        </div>

        {selectedStudentName && (
          <div>
            <label
              htmlFor="studentName"
              className="block text-gray-700 font-medium mb-2"
            >
              Selected Student Name
            </label>
            <input
              type="text"
              id="studentName"
              value={selectedStudentName}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="fineAmount"
            className="block text-gray-700 font-medium mb-2"
          >
            Fine Amount
          </label>
          <input
            type="number"
            id="fineAmount"
            value={fineAmount}
            onChange={(e) => setFineAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
          />
        </div>

        <div>
          <label
            htmlFor="fineReason"
            className="block text-gray-700 font-medium mb-2"
          >
            Fine Reason
          </label>
          <input
            type="text"
            id="fineReason"
            value={fineReason}
            onChange={(e) => setFineReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Assign Fine
          </button>
        </div>
      </form>
    </div>
  );
}

export default Fine;
