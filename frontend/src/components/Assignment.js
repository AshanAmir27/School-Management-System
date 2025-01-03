import React, { useState, useEffect } from "react";

function ClassAssignment() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClassDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login to view class details.");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/get-class-details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch class details");
        }

        console.log("Fetched Data:", data); // Check the structure of the fetched data

        // Extract class names and subjects from the response
        const classNames = data.data.map((item) => item.class_name); // Extracting class_name
        const subjects = data.data.map((item) => item.subject); // Extracting subject

        setClasses(classNames || []); // Set class names
        setSubjects(subjects || []); // Set subjects
      } catch (error) {
        console.error("Error fetching class details:", error);
      }
    };

    fetchClassDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login to assign assignment.");
      return;
    }

    const payload = {
      class_name: className,
      subject,
      title,
      description,
      due_date: dueDate,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/assign-class-assignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to assign assignment");

      const data = await response.json();
      setMessage(data.message);
      setTitle("");
      setDescription("");
      setClassName("");
      setSubject("");
      setDueDate("");
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message || "Failed to assign assignment.");
    }
  };

  return (
    <div className="assignment-container">
      <h1 className="text-2xl font-bold">Assign Assignment to Class</h1>
      {message && <p className="mt-4 text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Class</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Subject</option>
          {subjects.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
        />

        <textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded"
        ></textarea>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Assign
        </button>
      </form>
    </div>
  );
}

export default ClassAssignment;
