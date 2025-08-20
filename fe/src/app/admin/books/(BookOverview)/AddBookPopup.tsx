import React, { useState } from 'react';
import BookIcon from '@/icons/BookIcon.svg';
import SearchInput from '@/components/SearchInput';
import type { Category } from '@/types/Books';
import { useQuery } from '@tanstack/react-query';
import { categoryQueries } from '@/lib/api/category';
import { booksQueries } from '@/lib/api/book';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { GoogleItem } from '@/types/Books';
const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  author: z.string().trim().min(1, 'Author is required').max(200),
  type: z
    .string()
    .trim()
    .min(1, 'Category is required')
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid category'),
  date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date'),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  imageLinks: z.string().url('Image must be a valid URL'),
});
type FormData = z.infer<typeof schema>;

interface AddBookPopupProps {
  onCancel: () => void;
  onAdd: (data: {
    name: string;
    author: string;
    type: string; // category _id
    date: string;
    description: string;
    imageLinks: string;
  }) => void;
}

export default function AddBookPopup({ onCancel, onAdd }: AddBookPopupProps) {
  const today = new Date().toISOString().slice(0, 10);
  const { data: categories = [] } = useQuery(categoryQueries.all());

  // chỉ search dùng state
  const [gQuery, setGQuery] = useState('');
  const { data: gItems = [] } = useQuery(booksQueries.google(gQuery));

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      author: '',
      type: '',
      date: today,
      description: '',
      imageLinks: 'https://neelkanthpublishers.com/assets/bookcover_cover.png',
    },
    mode: 'onBlur',
  });

  // preview ảnh lấy trực tiếp từ form
  const imagePreview = watch('imageLinks');

  function findCategoryIdByName(name: string | undefined) {
    if (!name) return '';
    const found = categories.find((c: Category) => c.name.toLowerCase() === name.toLowerCase());
    return found ? (found as Category)._id : '';
  }

  // chỉ dùng setValue để prefill
  function prefill(item: GoogleItem) {
    setValue('name', item.title, { shouldValidate: true });
    setValue('author', item.author, { shouldValidate: true });
    setValue('date', (item.date || '').slice(0, 10), { shouldValidate: true });
    setValue('description', item.description || '', { shouldValidate: false });
    setValue('imageLinks', (item.thumbnail || '').replace(/^http:\/\//, 'https://'), {
      shouldValidate: true,
    });

    const matchedId = findCategoryIdByName(item.category);
    setValue('type', matchedId, { shouldValidate: true });
  }

  const onValidSubmit = (data: FormData) => {
    onAdd({
      name: data.name,
      author: data.author,
      type: data.type,
      date: data.date,
      imageLinks: data.imageLinks,
      description: data.description || '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
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

        {/* Google search */}
        <div className="space-y-2 mb-4">
          <SearchInput
            value={gQuery}
            onChange={(e) => setGQuery(e.target.value)}
            placeholder="Search Google Books..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {!!gItems.length && (
            <div className="max-h-56 overflow-auto border rounded divide-y">
              {gItems.map((it: GoogleItem) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => prefill(it)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                >
                  <Image src={it.thumbnail || '/default-cover.jpg'} alt="" width={28} height={40} />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{it.title}</div>
                    <div className="text-xs text-gray-500 truncate">{it.author}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

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

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    className="max-h-60 overflow-y-auto overflow-x-hidden bg-white rounded-md border shadow-md"
                  >
                    {categories.map((c: Category) => (
                      <SelectItem key={c._id} value={c._id} className="pl-8">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
              </>
            )}
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

          {/* imageLinks: preview từ watch, field do RHF quản lý */}
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
          {errors.imageLinks && <p className="text-red-600 text-sm">{errors.imageLinks.message}</p>}

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
