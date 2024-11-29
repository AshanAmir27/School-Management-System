import React, { useState } from 'react';
import axios from 'axios';

function CreateAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/superadmin/createAdmin', {
        username,
        password,
        full_name: fullName,
        email,
      });

      setCreateSuccess(`Admin created successfully! Username: ${response.data.admin.username}`);
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error;
        if (errorMessage === 'Username already exists') {
          setCreateError('Username already exists. Please choose another one.');
        } else if (errorMessage === 'Email already exists') {
          setCreateError('Email already exists. Please use a different email.');
        } else {
          setCreateError('Error occurred while creating admin. Please try again.');
        }
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Create a New Admin</h2>
      <form onSubmit={handleCreateAdmin} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new admin's username"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new admin's password"
            required
            minLength="6"
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="full_name" className="font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter new admin's full name"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter new admin's email"
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Admin
        </button>
      </form>

      {/* Success or Error Messages */}
      {createError && <p className="mt-4 text-red-600">{createError}</p>}
      {createSuccess && <p className="mt-4 text-green-600">{createSuccess}</p>}
    </div>
  );
}

export default CreateAdmin;
