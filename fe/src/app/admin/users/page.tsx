'use client';
import type { User } from '@/types/User';
import { useState } from 'react';
import GenericTable from '@/app/admin/GenericTable';
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '@/lib/api/user';
import { useQueryClient } from '@tanstack/react-query';
import EditIcon from '@/icons/EditIcon.svg';
import DeleteIcon from '@/icons/DeleteIcon.svg';
import SearchNormalIcon from '@/icons/SearchNormalIcon.svg';
import SearchInput from '@/components/SearchInput';

import UpdateUserPopup from './UpdateUserPopup';
import DeleteUserConfirmPopup from './DeleteUserConfirmPopup';

// Kiểu tối thiểu cho Role
export type Role = { _id: string; name: string };
const roles: Role[] = [
  { _id: '1', name: 'admin' },
  { _id: '2', name: 'user' },
];

export default function ManageUsersPage() {
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
    { key: 'username', header: 'Name', width: '200px' },
    { key: 'role', header: 'Role', width: '50px' },
    { key: 'email', header: 'Email', width: '250px' },
    { key: 'status', header: 'Status', width: '250px' },
    {
      key: 'action',
      header: 'Action',
      width: '120px',
      render: (user: User) => (
        <div className="flex justify-start gap-4 text-gray-600">
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowUpdate(true);
            }}
            title="Edit"
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <EditIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setSelectedUser(user);
              setShowDelete(true);
            }}
            title="Delete"
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <DeleteIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];
  const qc = useQueryClient();
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: users = [], isError, isLoading } = useQuery(userQueries.all());
  const [query, setQuery] = useState('');
  const handleAdd = () => {};
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between space-x-4 w-full">
        <h1 className="text-2xl font-semibold text-gray-900">User Manager</h1>
        <div className="flex flex-row space-x-2 w-full max-w-md">
          <div className="relative flex-grow">
            <SearchNormalIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            <SearchInput
              value={query}
              onChange={() => {}}
              placeholder={'search user'}
              className="pl-10 pr-3 py-2 w-full border border-blue-500 rounded-md focus:outline-none focus:ring-1"
            />
          </div>
        </div>
      </div>

      {isLoading && <div className="text-gray-500">Loading users...</div>}
      {isError && <div className="text-red-500">Failed to load users.</div>}
      <GenericTable data={users} columns={userColumns} />
      {showUpdate && selectedUser && (
        <UpdateUserPopup
          selectedUser={selectedUser}
          roles={roles}
          onCancel={() => setShowUpdate(false)}
          onUpdate={() => {
            setShowUpdate(false);
            qc.invalidateQueries({ queryKey: userQueries.all().queryKey });
          }}
        />
      )}

      {showDelete && selectedUser && (
        <DeleteUserConfirmPopup
          id={selectedUser._id ?? ''}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            setShowDelete(false);
            qc.invalidateQueries({ queryKey: userQueries.all().queryKey });
          }}
        />
      )}
    </div>
  );
}
