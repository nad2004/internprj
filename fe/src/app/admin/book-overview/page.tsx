'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from '@/components/SearchInput';
type Book = {
  title: string;
  author: string;
  category: string;
  isbn: string;
};

const books: Book[] = [
  {
    title: 'The Whispering Woods',
    author: 'Eleanor Ainsworth',
    category: "Children's Literature",
    isbn: '978-0140620070',
  },
  {
    title: 'Reason and Romance',
    author: 'Clara Bennett',
    category: 'Classic Literature',
    isbn: '978-0141439518',
  },
  {
    title: 'To Understand a Mockingbird',
    author: 'Harper Lewis',
    category: 'American Literature',
    isbn: '978-0061120084',
  },
  {
    title: '2084',
    author: 'George Orwell',
    category: 'Dystopian Fiction',
    isbn: '978-0451524935',
  },
  {
    title: 'The Magnificent Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'American Literature',
    isbn: '978-0743273565',
  },
  {
    title: 'The Guardian in the Wheat',
    author: 'J.D. Salinger',
    category: 'Coming-of-Age',
    isbn: '978-0316769488',
  },
  {
    title: 'One Hundred Years of Loneliness',
    author: 'Gabriel Garcia Marquez',
    category: 'Magical Realism',
    isbn: '978-0060883287',
  },
  {
    title: 'The Dwarf',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    isbn: '978-0547928227',
  },
  {
    title: 'The Rings of Power',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    isbn: '978-0544003415',
  },
  {
    title: 'The Mystic',
    author: 'Paulo Coelho',
    category: 'Philosophical Fiction',
    isbn: '978-0062315007',
  },
];

export default function BookOverviewPage() {
  const [query, setQuery] = useState('');

  const filteredBooks = books.filter((book) =>
    [book.title, book.author, book.category, book.isbn]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  );

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
      <div className="overflow-x-auto bg-white border rounded-md shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">ISBN</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{book.title}</td>
                <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                  {book.author}
                </td>
                <td className="px-4 py-3">{book.category}</td>
                <td className="px-4 py-3">{book.isbn}</td>
                <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer">
                  Edit
                </td>
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
