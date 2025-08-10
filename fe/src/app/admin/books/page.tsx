'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import GenericTable from '@/app/admin/GenericTable';
import BodyHeader from '@/app/admin/BodyHeader';
import type { Book } from '@/types/Books';
import type { Category } from '@/types/Books';

import EditIcon from '@/icons/EditIcon.svg';
import DeleteIcon from '@/icons/DeleteIcon.svg';
import ReceiptIcon from '@/icons/ReceiptIcon.svg';

import AddBookPopup from './AddBookPopup';
import UpdateBookPopup from './UpdateBookPopup';

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
            onClick={() => {}}
            title="Delete"
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <DeleteIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => {}}
            title="View"
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <ReceiptIcon className="h-5 w-5 text-black" />
          </button>
        </div>
      ),
    },
  ];
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState('');
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const { data: books = [], isError, isLoading } = useBooks();

  function handleAdd(data: { name: string; author: string; type: string; description: string }) {
    console.log('Add book', data);
    setShowAdd(false);
  }
  function handleUpdate(data: typeof selectedBook) {
    console.log('Updated data:', data);
    setShowUpdate(false);
  }
  return (
    <div className="p-6 max-w-full">
      {/* Search bar */}
      <BodyHeader
        title="Book Management"
        addTitle="Book"
        query={query}
        onQueryChange={setQuery}
        onAddClick={() => setShowAdd(true)}
        placeholder="Search by ID or Type"
      />

      {/* Book table */}
      {isLoading && <div className="text-gray-500">Loading books...</div>}
      {isError && <div className="text-red-500">Failed to load books.</div>}
      <GenericTable data={books} columns={bookColumns} />
      {showAdd && <AddBookPopup onCancel={() => setShowAdd(false)} onAdd={handleAdd} />}
      {showUpdate && (
        <UpdateBookPopup
          selectedBook={selectedBook}
          onCancel={() => setShowUpdate(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
