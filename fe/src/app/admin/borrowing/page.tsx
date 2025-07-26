'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from '@/components/SearchInput';
const mockUsers = ['Sophia Clark', 'Ethan Walker', 'Olivia Reed', 'Liam Foster'];

type Record = {
  title: string;
  borrowDate: string;
  returnDate: string;
  status: string;
  fine: string;
};

const records: Record[] = [
  {
    title: 'The Great Expedition',
    borrowDate: '2023-01-15',
    returnDate: '2023-02-15',
    status: 'Returned',
    fine: '$0.00',
  },
  {
    title: 'Mystery of the Hidden Key',
    borrowDate: '2023-03-20',
    returnDate: '2023-04-20',
    status: 'Returned',
    fine: '$0.00',
  },
  {
    title: 'Science Explorations',
    borrowDate: '2023-05-10',
    returnDate: '2023-06-10',
    status: 'Returned',
    fine: '$0.00',
  },
  {
    title: 'History of Ancient Civilizations',
    borrowDate: '2023-07-05',
    returnDate: '2023-08-05',
    status: 'Returned',
    fine: '$0.00',
  },
  {
    title: 'Coding for Beginners',
    borrowDate: '2023-09-12',
    returnDate: '2023-10-12',
    status: 'Returned',
    fine: '$0.00',
  },
];

export default function BorrowingHistoryPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'book'>('user');
  const [selectedUser, setSelectedUser] = useState('');

  const filtered = records.filter((r) =>
    [r.title, r.borrowDate, r.returnDate].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Borrowing History</h1>
      <p className="text-sm text-gray-500 mb-5">
        View and manage borrowing history for users and books.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by book title, borrow date, or return date"
          className="w-full"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-500" />
      </div>

      {/* Tabs */}
      <div className="flex border-b text-sm mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'user' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('user')}
        >
          User History
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'book' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('book')}
        >
          Book History
        </button>
      </div>

      {/* Select User */}
      {activeTab === 'user' && (
        <div className="mb-6">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-64 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select User</option>
            {mockUsers.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <h2 className="text-md font-semibold mb-3">Borrowing Records</h2>
      <div className="overflow-x-auto bg-white border rounded-md shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Book Title</th>
              <th className="px-4 py-3 font-medium">Borrow Date</th>
              <th className="px-4 py-3 font-medium">Return Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Fines</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3 text-blue-600">{r.borrowDate}</td>
                <td className="px-4 py-3 text-blue-600">{r.returnDate}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">{r.fine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2 text-sm text-gray-700">
        <button className="px-2">&lt;</button>
        <button className="px-2 font-semibold border rounded text-white bg-blue-600">1</button>
        <button className="px-2">2</button>
        <button className="px-2">3</button>
        <span>...</span>
        <button className="px-2">10</button>
        <button className="px-2">&gt;</button>
      </div>
    </div>
  );
}
