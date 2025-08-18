'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import GenericTable from '@/app/admin/GenericTable';
import Input from '@/components/SearchInput';
import type { Loan } from '@/types/Borrow';
import { loanQueries } from '@/lib/api/loan';
import ReceiptIcon from '@/icons/ReceiptIcon.svg';
import UpdateLoanTracking from './UpdateLoanTracking';
function formatDate(s?: string) {
  if (!s) return '—';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
}

const statusClass: Record<string, string> = {
  reserve: 'bg-yellow-100 text-yellow-800',
  borrowed: 'bg-blue-100 text-blue-800',
  returned: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cooldown: 'bg-purple-100 text-purple-800',
};

export default function BorrowingPage() {
  const [query, setQuery] = useState('');

  // 🔎 Fetch all loans
  const { data, isLoading, isError, error } = useQuery({ ...loanQueries.all() });
  const items: Loan[] = data ?? [];
  // 🔍 Client-side filtering for quick search by book, user, code, note
  const filtered: Loan[] = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((l) => {
      const bookTitle = (l as Loan)?.bookId?.book_id?.title || '';
      const userName = (l as Loan)?.userId?.username || '';
      const desc = l.description || '';
      return [bookTitle, userName, desc, l.status, l.borrowedAt, l.dueAt]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [items, query]);

  // 🧱 Columns for GenericTable
  const loanColumns = [
    {
      key: 'book',
      header: 'Book',
      width: '260px',
      render: (l: Loan) => (l as Loan)?.bookId?.book_id?.title || '—',
    },
    {
      key: 'user',
      header: 'User',
      width: '200px',
      render: (l: Loan) => (l as Loan)?.userId?.username || '—',
    },
    {
      key: 'code',
      header: 'Serial',
      width: '120px',
      render: (l: Loan) => (l as Loan)?.bookId?.code || '—',
    },
    {
      key: 'borrowedAt',
      header: 'Borrowed',
      width: '140px',
      render: (l: Loan) => <span className="text-blue-600">{formatDate(l.borrowedAt)}</span>,
    },
    {
      key: 'dueAt',
      header: 'Due',
      width: '140px',
      render: (l: Loan) => <span className="text-blue-600">{formatDate(l.dueAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (l: Loan) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass[l.status] || 'bg-gray-100 text-gray-700'}`}
        >
          {l.status}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Note',
      width: '280px',
      render: (l: Loan) => l.description || '—',
    },
    {
      key: 'action',
      header: 'Action',
      width: '120px',
      render: (l: Loan) => (
        <div className="flex justify-start gap-4 text-gray-600">
          <button
            onClick={() => {
              setSelectedLoan(l);
              setShowUpdate(true);
            }}
            title="Edit"
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <ReceiptIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan>();
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Borrowing</h1>
        <p className="text-sm text-gray-500">Manage all loans across users and books.</p>
      </div>

      <div className="relative max-w-xl">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by book, user, code, status, date…"
          className="w-full"
        />
      </div>

      {isError && (
        <div className="text-red-600 text-sm">
          {(error as Error)?.message || 'Failed to load loans.'}
        </div>
      )}
      <div className="text-sm text-gray-600">
        {isLoading ? 'Loading…' : `Showing ${filtered.length} record(s)`}
      </div>

      <GenericTable<Loan> data={filtered} columns={loanColumns} />
      {showUpdate && selectedLoan && (
        <>
          <UpdateLoanTracking
            open={showUpdate}
            selectedLoan={selectedLoan}
            onCancel={() => setShowUpdate(false)}
            onUpdate={() => {}}
          />
        </>
      )}
    </div>
  );
}
