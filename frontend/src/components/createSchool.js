import React, { useState } from "react";

function CreateSchool() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [established_year, setEstablished_year] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/superAdmin/addSchool",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            address,
            contact_number,
            email,
            established_year,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Information saved successfully");
        console.log("Information saved : ", data.message);

        setName("");
        setAddress("");
        setEmail("");
        setContactNumber("");
        setEstablished_year("");
      } else {
        setMessage(data.error || "Information not saved");
        console.log("Information saving Error", data.error);
      }
    } catch (error) {
      setMessage("An error occurred while saving information");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Add School</h1>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="Name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-medium mb-2"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="contact_number"
              value={contact_number}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="school_id"
              className="block text-gray-700 font-medium mb-2"
            >
              Established Year
            </label>
            <input
              type="number"
              id="established_year"
              value={established_year}
              onChange={(e) => setEstablished_year(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSchool;
