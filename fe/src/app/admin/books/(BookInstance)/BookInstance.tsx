'use client';
import Image from 'next/image';
import { useState } from 'react';
import GenericTable from '@/app/admin/GenericTable';
import BodyHeader from '@/app/admin/BodyHeader';
import type { User } from '@/types/User';
import type { Book } from '@/types/Books';
import type { BookInstance, BookInstanceInput } from '@/types/BookInstance';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { bookInstanceQueries } from '@/lib/api/bookInstance';
import { addBookInstance } from '@/lib/api/bookInstance';
import EditIcon from '@/icons/EditIcon.svg';
import DeleteIcon from '@/icons/DeleteIcon.svg';
import { Badge } from '@/components/ui/badge';

import AddBookISPopup from './AddBookISPopup';
import UpdateBookISPopup from './UpdateBookISPopup';
import DeleteConfirmPopup from './DeleteConfirmPopup';

import { useDebounce } from '@/hooks/useDebounce';
import { BookPagination } from '@/components/BookPagination';
import { PageSizeSelect } from '@/components/PageSizeSelect';

const STATUSES = ['available', 'borrowed', 'reserved', 'lost', 'damaged', 'unavailable'] as const;

export default function BookInstancePage() {
  const columns = [
    {
      key: 'cover',
      header: 'Cover',
      width: '60px',
      render: (bi: BookInstance) => (
        <Image
          src={bi.book_id?.imageLinks?.thumbnail || '/default-cover.jpg'}
          alt={bi.book_id?.title || ''}
          className="object-cover rounded"
          width={65}
          height={30}
        />
      ),
    },
    {
      key: 'title',
      header: 'Book',
      width: '260px',
      render: (bi: BookInstance) => bi.book_id?.title || '—',
    },
    { key: 'code', header: 'Code', width: '140px' },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      render: (bi: BookInstance) => (
        <Badge className="capitalize">
          {STATUSES.includes((bi.status as (typeof STATUSES)[number]) || '')
            ? bi.status
            : 'unknown'}
        </Badge>
      ),
    },
    {
      key: 'holder',
      header: 'Holder',
      width: '220px',
      render: (bi: BookInstance) => {
        const u = bi.currentHolder as User | undefined;
        return u ? `${u.username || u.email || u._id}` : '—';
      },
    },
    {
      key: 'action',
      header: 'Action',
      width: '120px',
      render: (bi: BookInstance) => (
        <div className="flex justify-start gap-4 text-gray-600">
          <button
            onClick={() => {
              setSelected(bi);
              setShowUpdate(true);
            }}
            title="Edit"
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setSelected(bi);
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
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selected, setSelected] = useState<BookInstance | null>(null);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState('-createdAt');

  const { data, isError, isLoading, isRefetching, error } = useQuery({
    ...bookInstanceQueries.list({
      search: debouncedQuery.trim() || '',
      page,
      limit,
      sort,
    }),
    placeholderData: keepPreviousData,
  });
  const items = data?.items ?? ([] as BookInstance[]);
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.pages ?? Math.max(1, Math.ceil(total / limit));
  const from = total ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, total);

  async function handleAdd(payload: {
    book_id: string; // book _id
    code: string;
    status: string;
    currentHolder?: string;
  }) {
    try {
      await addBookInstance(payload);
      qc.invalidateQueries({
        queryKey: bookInstanceQueries.list({ search: debouncedQuery || '', page, limit, sort })
          .queryKey,
      });
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 max-w-full space-y-4">
      <BodyHeader
        title="Book Instance Management"
        addTitle="Instance"
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
        onAddClick={() => setShowAdd(true)}
        placeholder="Search by Code or Book Title"
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isLoading ? 'Loading…' : `Showing ${from}-${to} of ${total}`}
          {isRefetching && !isLoading && <span className="ml-2 text-gray-400">(updating…)</span>}
        </div>
        <PageSizeSelect
          value={limit}
          onChange={(n) => {
            setLimit(n);
            setPage(1);
          }}
        />
      </div>

      {isError && (
        <div className="text-red-500">
          {(error as Error)?.message || 'Failed to load book instances.'}
        </div>
      )}

      <GenericTable data={items} columns={columns} />

      {showAdd && <AddBookISPopup onCancel={() => setShowAdd(false)} onAdd={handleAdd} />}

      {showUpdate && selected && (
        <UpdateBookISPopup
          selected={selected}
          onCancel={() => setShowUpdate(false)}
          onUpdate={() => {
            setShowUpdate(false);
            qc.invalidateQueries({
              queryKey: bookInstanceQueries.list({
                search: debouncedQuery || '',
                page,
                limit,
                sort,
              }).queryKey,
            });
          }}
        />
      )}

      {showDelete && selected && (
        <DeleteConfirmPopup
          message={`Delete instance ${selected.code} of “${selected.book_id?.title || ''}”?`}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            setShowDelete(false);
            qc.invalidateQueries({
              queryKey: bookInstanceQueries.list({
                search: debouncedQuery || '',
                page,
                limit,
                sort,
              }).queryKey,
            });
          }}
          id={selected._id || ''}
        />
      )}

      <div className="flex items-center justify-center">
        <BookPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
