'use client';
import Image from 'next/image';
import { useState } from 'react';
import GenericTable from '@/app/admin/GenericTable';
import BodyHeader from '@/app/admin/BodyHeader';
import type { Book } from '@/types/Books';
import type { Category } from '@/types/Books';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { booksQueries } from '@/lib/api/book';
import { addBook } from '@/lib/api/book';
import EditIcon from '@/icons/EditIcon.svg';
import DeleteIcon from '@/icons/DeleteIcon.svg';

import AddBookPopup from './AddBookPopup';
import UpdateBookPopup from './UpdateBookPopup';
import DeleteConfirmPopup from './DeleteConfirmPopup';

import { useDebounce } from '@/hooks/useDebounce';
import { BookPagination } from '@/components/BookPagination';
import { PageSizeSelect } from '@/components/PageSizeSelect';

export default function BookOverviewPage() {
  const bookColumns = [
    {
      key: 'imageLinks',
      header: 'Cover',
      width: '60px',
      render: (book: Book) => (
        <Image
          src={book.imageLinks?.thumbnail || '/default-cover.jpg'}
          alt={book.title}
          className="object-cover rounded"
          width={65}
          height={30}
        />
      ),
    },
    { key: 'title', header: 'Name', width: '300px' },
    {
      key: 'categories',
      header: 'Type',
      width: '150px',
      render: (book: Book) => book.categories?.map((c: Category) => c.name).join(' - '),
    },
    { key: 'language', header: 'Language', width: '120px' },
    { key: 'status', header: 'Availability', width: '120px' },
    {
      key: 'action',
      header: 'Action',
      width: '120px',
      render: (book: Book) => (
        <div className="flex justify-start gap-4 text-gray-600">
          <button
            onClick={() => {
              setSelectedBook(book);
              setShowUpdate(true);
            }}
            title="Edit"
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <EditIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setSelectedBook(book);
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
  // UI state
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();

  // Filters (local state, không dùng Zustand)
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [page, setPage] = useState(1); // 1-based
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState('-createdAt'); // nếu cần UI đổi sort thì thêm Select

  // Fetch: API trả { items, pagination: { total, page, limit, pages } }
  const { data, isError, isLoading, isRefetching, error } = useQuery({
    ...booksQueries.list({
      search: debouncedQuery || '',
      page,
      limit,
      sort,
    }),
    placeholderData: keepPreviousData,
  });
  const items = data?.items ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.pages ?? Math.max(1, Math.ceil(total / limit));

  const from = total ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, total);

  async function handleAdd(payload: {
    name: string;
    author: string;
    type: string;
    description: string;
    date: string;
    imageLinks: string;
  }) {
    try {
      await addBook(payload);
      qc.invalidateQueries({ queryKey: booksQueries.list().queryKey });
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function handleUpdate() {
    setShowUpdate(false);
  }
  async function handleDelete() {
    setShowDelete(false);
  }

  return (
    <div className="p-6 max-w-full space-y-4">
      {/* Search bar */}
      <BodyHeader
        title="Book Management"
        addTitle="Book"
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
        onAddClick={() => setShowAdd(true)}
        placeholder="Search by Name"
      />

      {/* Top toolbar: info + page size */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isLoading ? 'Loading…' : `Showing ${from}-${to} of ${total}`}
          {isRefetching && !isLoading && <span className="ml-2 text-gray-400">(updating…)</span>}
        </div>
        <PageSizeSelect
          value={limit}
          onChange={(n) => {
            setLimit(n);
            setPage(1); // thay đổi page size thì về trang 1
          }}
        />
      </div>

      {/* Book table */}
      {isError && (
        <div className="text-red-500">{(error as Error)?.message || 'Failed to load books.'}</div>
      )}
      <GenericTable data={items} columns={bookColumns} />

      {/* Popups */}
      {showAdd && <AddBookPopup onCancel={() => setShowAdd(false)} onAdd={handleAdd} />}
      {showUpdate && selectedBook && (
        <UpdateBookPopup
          selectedBook={selectedBook}
          onCancel={() => setShowUpdate(false)}
          onUpdate={handleUpdate}
        />
      )}
      {showDelete && selectedBook && (
        <DeleteConfirmPopup
          message={`Are you certain you wish to delete “${selectedBook.title}”?`}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
          id={selectedBook._id ?? ''}
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center">
        <BookPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
