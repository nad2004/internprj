import React, { useState } from 'react';
import BookIcon from '@/icons/BookIcon.svg';
import { useCategories } from '@/hooks/useCategory';
import type { Category } from '@/types/Books';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddBookPopupProps {
  onCancel: () => void;
  onAdd: (data: {
    name: string;
    author: string;
    type: string;
    date: Date;
    description: string;
  }) => void;
}

export default function AddBookPopup({ onCancel, onAdd }: AddBookPopupProps) {
  const today = new Date().toISOString().slice(0, 10);
  const { data: categories = [], isError, isLoading } = useCategories();
  const [form, setForm] = useState({
    name: '',
    author: '',
    type: '',
    date: today, // string "YYYY-MM-DD"
    description: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Xử lý chọn category
  function handleSelect(value: string) {
    setForm((prev) => ({ ...prev, type: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      name: form.name,
      author: form.author,
      type: form.type,
      date: new Date(form.date),
      description: form.description,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3/4 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 p-2 rounded">
              <BookIcon className="w-6 h-6 text-black" />
            </div>
            <h2 className="font-semibold text-lg">Add Book</h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 font-bold text-xl"
          >
            ×
          </button>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />

          {/* Select category */}
          <Select onValueChange={handleSelect} value={form.type}>
            <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              className="max-h-60 overflow-y-auto overflow-x-hidden bg-white rounded-md border shadow-md"
            >
              {categories.map((category: Category) => (
                <SelectItem key={category._id} value={category.slug} className="pl-8">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 bg-gray-300 rounded font-semibold hover:bg-gray-400"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-black text-white rounded font-semibold hover:bg-gray-900"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
