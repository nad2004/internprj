'use client';
import type { User } from '@/types/User';
import { useUsers } from '@/hooks/useUsers';
import Image from 'next/image';
import { useState } from 'react';
import BodyHeader from '@/app/admin/BodyHeader';
import GenericTable from '@/app/admin/GenericTable';

import EditIcon from '@/icons/EditIcon.svg';
import DeleteIcon from '@/icons/DeleteIcon.svg';
import ReceiptIcon from '@/icons/ReceiptIcon.svg';
const userColumns = [
  {
    key: 'avatar',
    header: 'Avatar',
    width: '60px',
    render: (user: User) => (
      <img
        src={user.avatar || '/default-cover.jpg'}
        alt={user.username || ''}
        className="object-cover rounded h-15 w-15"
      />
    ),
  },
  { key: '_id', header: 'ID', width: '50px' },
  { key: 'username', header: 'Name', width: '200px' },
  { key: 'email', header: 'Email', width: '250px' },
  {
    key: 'action',
    header: 'Action',
    width: '120px',
    render: (user: User) => (
      <div className="flex justify-start gap-4 text-gray-600">
        <button
          onClick={() => alert('Edit ' + user._id)}
          title="Edit"
          className="transform transition-transform duration-200 hover:-translate-y-1"
        >
          <EditIcon className="h-5 w-5" />
        </button>

        <button
          onClick={() => alert('Delete ' + user._id)}
          title="Delete"
          className="transform transition-transform duration-200 hover:-translate-y-1"
        >
          <DeleteIcon className="h-5 w-5" />
        </button>

        <button
          onClick={() => alert('View ' + user._id)}
          title="View"
          className="transform transition-transform duration-200 hover:-translate-y-1"
        >
          <ReceiptIcon className="h-5 w-5 text-black" />
        </button>
      </div>
    ),
  },
];

export default function ManageUsersPage() {
  const { data: users = [], isError, isLoading } = useUsers();
  const [query, setQuery] = useState('');
  console.log(users);
  const handleAdd = () => {};
  return (
    <div className="p-6">
      <BodyHeader
        title="User Management"
        addTitle="User"
        query={query}
        onQueryChange={setQuery}
        onAddClick={handleAdd}
        placeholder="Search by ID or Type"
      />

      {isLoading && <div className="text-gray-500">Loading users...</div>}
      {isError && <div className="text-red-500">Failed to load users.</div>}
      <GenericTable data={users} columns={userColumns} />
    </div>
  );
}
