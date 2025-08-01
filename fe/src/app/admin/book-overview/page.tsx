'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from '@/components/SearchInput';
import type { Book } from '@/types/Books';
import { useBooks } from '@/hooks/useBooks';
import type { Category } from '@/types/Books';

export default function BookOverviewPage() {
  const [query, setQuery] = useState('');
  const { data: books = [], isError, isLoading } = useBooks();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Catalog Management</h1>

      {/* Search bar */}
      <div className="relative mb-4 mt-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="w-full"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-500" />
      </div>

      {/* Book table */}
      {isLoading && <div className="text-gray-500">Loading books...</div>}
      {isError && <div className="text-red-500">Failed to load books.</div>}

      <div className="overflow-x-auto bg-white border rounded-md shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: Book, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{book.title}</td>
                <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                  {book.authors?.[0] || 'Unknown Author'}
                </td>
                <td className="px-4 py-3">
                  {book.categories?.map((c: Category) => c.name).join(' - ')}
                </td>
                <td className="px-4 py-3">{book.status}</td>
                <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Book Button */}
      <div className="flex justify-end mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
          Add Book
        </button>
      </div>
    </div>
  );
}
