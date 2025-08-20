'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BookIcon from '@/icons/BookIcon.svg';
import type { Book, Category } from '@/types/Books';
import { categoryQueries } from '@/lib/api/category';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateBook } from '@/hooks/CRUD/useUpdateBook';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import FormOverlay from '@/components/FormOverlay';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const UPLOAD_URL = 'http://localhost:8080/api/upload/image';
const UPDATE_BOOK = () => `http://localhost:8080/api/book`;
const schema = z.object({
  _id: z.string(),
  name: z.string().trim().min(1, 'Name is required').max(200),
  author: z.string().trim().min(1, 'Author is required').max(200),
  type: z.string().trim().min(1, 'Category is required'),
  date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date'),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  imageLinks: z.string().url('Image must be a valid URL'),
});
type FormData = z.infer<typeof schema>;

interface UpdateBookPopupProps {
  selectedBook: Book;
  onCancel: () => void;
  onUpdate: () => void;
}

function toHttps(u?: string) {
  return (u || '').replace(/^http:\/\//, 'https://');
}
function normalizeDate(d?: string) {
  if (!d) return new Date().toISOString().slice(0, 10);
  if (d.length >= 10) return d.slice(0, 10);
  if (d.length === 7) return `${d}-01`;
  if (d.length === 4) return `${d}-01-01`;
  return new Date().toISOString().slice(0, 10);
}

export default function UpdateBookPopup({
  selectedBook,
  onCancel,
  onUpdate,
}: UpdateBookPopupProps) {
  const { data: categories = [], isLoading } = useQuery(categoryQueries.all());
  const ready = !isLoading && categories.length > 0;
  const optionIds = useMemo(() => categories.map((c) => String(c._id)), [categories]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      _id: selectedBook._id,
      name: '',
      author: '',
      type: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      imageLinks: 'https://neelkanthpublishers.com/assets/bookcover_cover.png',
    },
    mode: 'onBlur',
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!selectedBook?._id || !ready) return;
    const typeId = selectedBook.categories?.[0]?._id?.toString() ?? '';
    const validType = typeId && optionIds.includes(typeId) ? typeId : '';
    reset(
      {
        _id: selectedBook._id,
        name: selectedBook.title ?? '',
        author: selectedBook.authors?.[0] ?? '',
        type: validType, // nếu không có/không hợp lệ → rỗng (placeholder)
        date: normalizeDate(selectedBook.publishedDate),
        description: selectedBook.description ?? '',
        imageLinks: toHttps(
          selectedBook.imageLinks?.thumbnail ||
            selectedBook.imageLinks?.smallThumbnail ||
            'https://neelkanthpublishers.com/assets/bookcover_cover.png',
        ),
      },
      { keepDirtyValues: false }, // lần đầu không giữ dirty để tránh '' ghi đè
    );
  }, [selectedBook?._id, ready, optionIds, reset]);

  const [imagePreview, setImagePreview] = useState(
    toHttps(
      selectedBook.imageLinks?.thumbnail ||'https://neelkanthpublishers.com/assets/bookcover_cover.png',
    ),
  );
  const { mutate, mutateAsync, isPending, isSuccess, error, data: server } = useUpdateBook();
  async function onValidSubmit(form: FormData) {
    await mutateAsync({ data: form });
    onUpdate();
  }
    const { authStart, authSuccess } = useAuthStore();
    const loading = useAuthStore((s) => s.loading);
    const fileRef = useRef<HTMLInputElement>(null);
  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn đúng file ảnh');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh quá lớn (tối đa 5MB)');
      e.target.value = '';
      return;
    }

    const preview = URL.createObjectURL(file);

    try {
      authStart();
      const fd = new FormData();
      fd.append('file', file);

      const { data } = await axios.post(UPLOAD_URL, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const uploadedUrl = data?.data?.url ?? data?.secure_url;
      if (!uploadedUrl) throw new Error('Upload không trả về URL');
      setImagePreview(uploadedUrl);
      if (selectedBook?._id) {
        const res = await axios.patch(
          UPDATE_BOOK(),
          { _id: selectedBook._id, imageLinks: {thumbnail: uploadedUrl, smallThumbnail: uploadedUrl} },
          { withCredentials: true },
        );
      }
    } catch (err) {
      console.error(err);
      alert('Upload ảnh thất bại');
    } finally {
      authSuccess();
      if (fileRef.current) fileRef.current.value = '';
      URL.revokeObjectURL(preview);
    }
  }
  if (!ready) {
    return (
      <div className="fixed inset-0 bg-black/40 grid place-items-center">
        <div className="bg-white rounded p-6">Loading categories…</div>
      </div>
    );
  }

  return (
    <>
    
      {isPending ? 'Đang lưu...' : 'Lưu'}
      {error && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
      {isSuccess && <p className="text-green-600 text-sm">Cập nhật xong!</p>}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
        <FormOverlay loading={loading} />
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
          <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
            <input
              type="text"
              {...register('name')}
              placeholder="Name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

            <input
              type="text"
              {...register('author')}
              placeholder="Author"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.author && <p className="text-red-600 text-sm">{errors.author.message}</p>}

            {/* Category (_id) */}
            <Controller
              control={control}
              name="type"
              render={({ field }) => {
                const current = String(field.value ?? '');
                // chỉ control khi ready; nếu current không hợp lệ → rỗng để hiển thị placeholder
                const safeValue = !ready ? undefined : optionIds.includes(current) ? current : '';

                const onTypeChange = (next: string) => {
                  const nextStr = String(next);
                  // LỌC: bỏ qua '' hoặc giá trị không nằm trong options (nhịp clear/invalid)
                  if (!optionIds.includes(nextStr) || nextStr === '') return;
                  field.onChange(nextStr);
                };

                return (
                  <>
                    <Select value={safeValue} onValueChange={onTypeChange} disabled={!ready}>
                      <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        className="max-h-60 overflow-y-auto overflow-x-hidden bg-white rounded-md border shadow-md"
                      >
                        {categories.map((c: Category) => (
                          <SelectItem key={String(c._id)} value={String(c._id)} className="pl-8">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
                    )}
                  </>
                );
              }}
            />

            <input
              type="date"
              {...register('date')}
              placeholder="Date"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}

            <Textarea
              {...register('description')}
              placeholder="Description"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description.message}</p>
            )}

            {/* imageLinks (ẩn) + preview */}
            <input type="hidden" {...register('imageLinks')} />
            <div className="flex items-center gap-3">
              <Image
                src={imagePreview}
                alt="Preview cover"
                width={40}
                height={60}
                className="rounded border"
              />
              <span className="text-xs text-gray-500 break-all">{imagePreview}</span>
            </div>
            {errors.imageLinks && (
              <p className="text-red-600 text-sm">{errors.imageLinks.message}</p>
            )}
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              onClick={(e) => ((e.target as HTMLInputElement).value = '')}
              className="
                h-10
                file:mr-3 file:rounded-md file:border-0
                file:bg-slate-100 file:px-3 file:py-2
                file:text-sm file:font-medium file:text-slate-700
                hover:file:bg-slate-200
              "
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
    </>
  );
}
