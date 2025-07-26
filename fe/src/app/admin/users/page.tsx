'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

type User = {
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
};

const initialUsers: User[] = [
  {
    name: 'Sophia Clark',
    email: 'sophia.clark@email.com',
    phone: '555-123-4567',
    role: 'Admin',
  },
  {
    name: 'Ethan Walker',
    email: 'ethan.walker@email.com',
    phone: '555-987-6543',
    role: 'User',
  },
  {
    name: 'Olivia Reed',
    email: 'olivia.reed@email.com',
    phone: '555-246-8013',
    role: 'User',
  },
  {
    name: 'Liam Foster',
    email: 'liam.foster@email.com',
    phone: '555-369-1470',
    role: 'User',
  },
  {
    name: 'Ava Bennett',
    email: 'ava.bennett@email.com',
    phone: '555-789-0123',
    role: 'User',
  },
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');

  const filtered = users.filter((user) =>
    [user.name, user.email, user.phone, user.role]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const handleDelete = (email: string) => {
    setUsers((prev) => prev.filter((u) => u.email !== email));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <button className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1.5 rounded-md">
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-md shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.email} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                  {user.email}
                </td>
                <td className="px-4 py-3">{user.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin'
                        ? 'bg-gray-300 text-gray-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
