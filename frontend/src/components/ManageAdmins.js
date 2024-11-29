import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [editAdmin, setEditAdmin] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/superadmin/getAdmins');
        setAdmins(response.data.admins);
      } catch (error) {
        setError('Error fetching admins');
      }
    };

    fetchAdmins();
  }, []);

  // Handle editing an admin
  const handleEditAdmin = (admin) => {
    setEditAdmin(admin);
    setUsername(admin.username);
    setFullName(admin.full_name);
    setEmail(admin.email);
    setPassword(''); // Don't show password for edit
  };

  // Handle saving an edited admin
  const handleSaveAdmin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:5000/api/superadmin/updateAdmin', {
        id: editAdmin.id,
        username,
        password,
        full_name: fullName,
        email,
      });

      setAdmins(admins.map(admin => (admin.id === editAdmin.id ? { ...admin, username, full_name: fullName, email } : admin)));
      setSuccess('Admin updated successfully');
      setEditAdmin(null);
      setUsername('');
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Error updating admin');
    }
  };

  // Handle deleting an admin
  const handleDeleteAdmin = async (adminId) => {
    try {
      await axios.delete(`http://localhost:5000/api/superadmin/deleteAdmin/${adminId}`);
      setAdmins(admins.filter(admin => admin.id !== adminId));
      setSuccess('Admin deleted successfully');
    } catch (error) {
      setError('Error deleting admin');
    }
  };

  return (
    <div>
      {/* Display success messages */}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}

      {/* Admin List Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-6">
        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="px-4 py-2">{admin.username}</td>
                <td className="px-4 py-2">{admin.full_name}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-600 text-white py-1 px-3 rounded-md mr-2"
                    onClick={() => handleEditAdmin(admin)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white py-1 px-3 rounded-md"
                    onClick={() => handleDeleteAdmin(admin.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Admin Form */}
      {editAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Edit Admin</h2>
          <form onSubmit={handleSaveAdmin} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border rounded-md"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="full_name" className="font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="p-2 border rounded-md"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-md"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageAdmins;
