'use client';
import React, { useState } from 'react';
import BookIcon from '@/icons/BookIcon.svg';
import SearchInput from '@/components/SearchInput';
import type { Book } from '@/types/Books';
import type { User } from '@/types/User';
import type { BookInstanceInput } from '@/types/BookInstance';
import { useQuery } from '@tanstack/react-query';
import { booksQueries } from '@/lib/api/book';
import { userQueries } from '@/lib/api/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from '@/hooks/useDebounce';
const STATUSES = ['available', 'borrowed', 'reserved', 'lost', 'damaged', 'unavailable'] as const;

const schema = z.object({
  book_id: z.string().trim().min(1, 'Book is required'), // book _id
  code: z.string().trim().min(1, 'Code is required').max(100),
  status: z.enum(STATUSES, { message: 'Status is required' }),
  currentHolder: z.string().trim().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onCancel: () => void;
  onAdd: (data: BookInstanceInput) => void;
}

export default function AddBookISPopup({ onCancel, onAdd }: Props) {
  const [bookSearch, setBookSearch] = useState('');
  const debouncedQuery = useDebounce(bookSearch, 400);
  const {
    data: bookList,
    promise,
    isLoading: bookLoading,
    isError,
    error: bookError,
  } = useQuery({
    ...booksQueries.list({
      search: debouncedQuery.trim() || '',
      limit: 100,
      offset: 0,
      sort: 'title',
      order: 'asc',
    }),
  });
  const books: Book[] = bookList?.items ?? [];
  const {
    data: users = [],
    isLoading: userLoading,
    error: userError,
  } = useQuery(userQueries.all());
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { book_id: '', code: '', status: 'available', currentHolder: '' },
    mode: 'onBlur',
  });

  const selectedBookId = watch('book_id');
  const selectedBook = books?.find((b: Book) => String((b as Book)._id) === selectedBookId);

  const onValidSubmit = (data: FormData) =>
    onAdd({ ...data, currentHolder: data.currentHolder || '' });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 p-2 rounded">
              {' '}
              <BookIcon className="w-6 h-6 text-black" />{' '}
            </div>
            <h2 className="font-semibold text-lg">Add Book Instance</h2>
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
        {/* Book search + select */}
        <div className="space-y-2 mb-2">
          <SearchInput
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            placeholder="Search books…"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="book_id"
            render={({ field }) => {
              return (
                <>
                  {bookLoading ? (
                    <div className="text-sm text-gray-500">Loading books…</div>
                  ) : bookError ? (
                    <div className="text-red-600">Failed to load books</div>
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        {' '}
                        <SelectValue placeholder="Select book" />{' '}
                      </SelectTrigger>
                      <SelectContent>
                        {books.map((b) => (
                          <SelectItem key={String((b as Book)._id)} value={String((b as Book)._id)}>
                            {(b as Book).title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </>
              );
            }}
          />

          <input
            type="text"
            {...register('code')}
            placeholder="Code (e.g., BK-0001)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.code && <p className="text-red-600 text-sm">{errors.code.message}</p>}

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto bg-white rounded-md border shadow-md">
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="currentHolder"
            render={({ field }) => (
              <>
                {bookLoading ? (
                  <div className="text-sm text-gray-500">Loading books…</div>
                ) : bookError ? (
                  <div className="text-red-600">Failed to load books</div>
                ) : (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
                      <SelectValue placeholder="Assign holder (optional)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto bg-white rounded-md border shadow-md">
                      <SelectItem key={'noneUser'} value={'None'}>
                        None
                      </SelectItem>

                      {users?.map((u: User) => {
                        return (
                          <div key={String((u as User)._id)}>
                            <SelectItem
                              key={String((u as User)._id)}
                              value={String((u as User)._id)}
                            >
                              {u.username || u.email || (u as User)._id}
                            </SelectItem>
                          </div>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          />

          {/* Preview selected book cover */}
          {!!selectedBook && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <img
                src={selectedBook.imageLinks?.thumbnail || '/default-cover.jpg'}
                alt="Preview cover"
                width={40}
                height={60}
                className="rounded border"
              />
              <span className="truncate">{selectedBook.title}</span>
            </div>
          )}

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
              disabled={isSubmitting}
              className="flex-1 py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 disabled:opacity-70"
            >
              {isSubmitting ? 'ADDING…' : 'ADD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
