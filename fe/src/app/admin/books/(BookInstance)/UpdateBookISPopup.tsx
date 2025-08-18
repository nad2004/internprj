'use client';
import React, { useState, useEffect, useMemo } from 'react';
import BookIcon from '@/icons/BookIcon.svg';
import type { Book } from '@/types/Books';
import type { User } from '@/types/User';
import type { BookInstance, BookInstanceInput } from '@/types/BookInstance';
import { BookInstanceStatus } from '@/types/BookInstance';

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
import { useUpdateBookInstance } from '@/hooks/CRUD/useUpdateBookInstance'; // you implement
import { useDebounce } from '@/hooks/useDebounce';

const schema = z.object({
  _id: z.string(),
  book_id: z.string().trim().min(1, 'Book is required'),
  code: z.string().trim().min(1, 'Code is required').max(100),
  status: z.enum(BookInstanceStatus),
  currentHolder: z.string().trim().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface Props {
  selected: BookInstance;
  onCancel: () => void;
  onUpdate: () => void;
}

export default function UpdateBookISPopup({ selected, onCancel, onUpdate }: Props) {
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
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      _id: selected._id || '',
      book_id: '',
      code: '',
      status: 'available',
      currentHolder: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!selected?._id) return;
    reset(
      {
        _id: selected._id || '',
        book_id: String((selected.book_id as Book)?._id || ''),
        code: selected.code || '',
        status: (selected.status as (typeof BookInstanceStatus)[number]) || 'available',
        currentHolder: String((selected.currentHolder as User)?._id || ''),
      },
      { keepDirtyValues: false },
    );
  }, [selected?._id, reset]);

  const { mutateAsync, isPending, isSuccess, error } = useUpdateBookInstance();
  async function onValidSubmit(form: FormData) {
    const payload = { ...form } as BookInstanceInput;
    if (!payload.currentHolder) delete payload.currentHolder;
    await mutateAsync({ data: payload });
    onUpdate();
  }
  const userNames = useMemo(() => users.map((r: User) => String(r.username)), [users]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 p-2 rounded">
              <BookIcon className="w-6 h-6 text-black" />
            </div>
            <h2 className="font-semibold text-lg">Update Book Instance</h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
        {isSuccess && <p className="text-green-600 text-sm">Updated!</p>}
        <hr className="border-gray-300 mb-6" />

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
            placeholder="Code"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.code && <p className="text-red-600 text-sm">{errors.code.message}</p>}

          <Controller
            control={control}
            name="status"
            render={({ field }) => {
              const onTypeChange = (next: string) => {
                const nextStr = String(next);
                // LỌC: bỏ qua '' hoặc giá trị không nằm trong options (nhịp clear/invalid)
                if (!BookInstanceStatus.includes(nextStr) || nextStr === '') return;
                field.onChange(nextStr);
              };
              return (
                <>
                  <Select onValueChange={onTypeChange} value={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto bg-white rounded-md border shadow-md">
                      {BookInstanceStatus.map((s) => (
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
              );
            }}
          />

          <Controller
            control={control}
            name="currentHolder"
            render={({ field }) => {
              const onUserChange = (next: string) => {
                const nextStr = String(next);
                // LỌC: bỏ qua '' hoặc giá trị không nằm trong options (nhịp clear/invalid)
                if (!userNames.includes(nextStr) || nextStr === '') return;
                field.onChange(nextStr);
              };
              return (
                <>
                  {userLoading ? (
                    <div className="text-sm text-gray-500">Loading users…</div>
                  ) : userError ? (
                    <div className="text-red-600">Failed to load user</div>
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
                            <SelectItem
                              key={String((u as User)._id)}
                              value={String((u as User)._id)}
                            >
                              {u.username || u.email || (u as User)._id}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                </>
              );
            }}
          />

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
              disabled={isPending}
              className="flex-1 py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 disabled:opacity-70"
            >
              {isPending ? 'UPDATING…' : 'UPDATE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
