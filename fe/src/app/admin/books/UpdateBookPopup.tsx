import React, { useEffect, useState } from 'react';
import BookIcon from '@/icons/BookIcon.svg';
import type { Book } from '@/types/Books';
import type { Category } from '@/types/Books';
interface UpdateBookPopupProps {
  selectedBook: Book;
  onCancel: () => void;
  onUpdate: (data: { title: string; language: string; type: string; description: string }) => void;
}
type FormState = {
  title: string;
  language: string;
  type: string;
  description: string;
};
export default function UpdateBookPopup({
  selectedBook,
  onCancel,
  onUpdate,
}: UpdateBookPopupProps) {
  const [form, setForm] = useState<FormState>({
    title: '',
    language: '',
    type: '',
    description: '',
  });

  // Khi selectedBook thay đổi thì cập nhật form
  useEffect(() => {
    if (selectedBook) {
      setForm({
        title: selectedBook.title || '',
        language: selectedBook.language || '',
        type: selectedBook.categories?.map((c) => c.name).join(' - ') || '',
        description: selectedBook.description ?? '',
      });
    }
  }, [selectedBook]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onUpdate({
      title: form?.title,
      language: form.language,
      type: form.type,
      description: form.description,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 p-2 rounded">
              <BookIcon className="w-6 h-6 text-black" />
            </div>
            <h2 className="font-semibold text-lg">Update Book</h2>
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
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="text"
            name="language"
            placeholder="Language"
            value={form.language}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={form.type}
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
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
