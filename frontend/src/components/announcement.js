import React, { useState } from "react";

function Announcement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add announcement information");
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/createAnnouncement",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            message,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Announcement Information saved", data.message);

        setTitle("");
        setMessage("");
      } else {
        setError(data.error || "Information not saved");
        console.log("Error in adding announcement", data.error);
      }
    } catch (error) {
      console.log("Error", error);
      alert("Failed to add announcement information");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Adding Announcements
        </h1>

        {error && (
          <p
            className={`text-center mb-4 ${
              error.includes("successfully") ? "text-green-500" : "text-red-500"
            }`}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="username"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <label htmlFor="" className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-300 "
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Announcement;
