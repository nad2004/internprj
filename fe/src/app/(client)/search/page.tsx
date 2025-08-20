'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchStore } from '@/store/searchStore';
import { booksQueries } from '@/lib/api/book';
import type { Book } from '@/types/Books';
import SearchResultCard, { SearchResultCardSkeleton } from './SearchResultCard';
import type { Category } from '@/types/Books';
import { categoryQueries } from '@/lib/api/category';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookPagination } from '@/components/BookPagination';
const All = {
  _id: '',
  name: 'ALL',
  slug: 'all',
};

export default function SearchPage() {
  const [browse, setBrowse] = useState<Category>(All);
  const { query, page, limit, category, setPage, setLimit, setCategory, setQuery } =
    useSearchStore();
  const [sort, setSort] = useState('-createdAt');
  useEffect(() => {
    if (limit !== 10) setLimit(10);
  }, [limit, setLimit]);
  const {
    data: data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    ...booksQueries.list({
      search: query || '',
      category,
      status: 'available',
      page,
      limit,
      sort,
    }),
    placeholderData: keepPreviousData,
  });
  const { data: categories = [] } = useQuery({
    ...categoryQueries.all(),
    select: (res) => [All, ...res] as Category[],
  });

  const items = (data?.items ?? []) as Book[];
  const total = data?.pagination?.total ?? 0;
  const pages = data?.pagination?.pages ?? Math.max(1, Math.ceil(total / limit));
  return (
    <div className="space-y-4">
      {isLoading && <div className="">{'Loading...'}</div>}
      {isError && (
        <div className="text-red-500">{(error as Error)?.message || 'Failed to load books.'}</div>
      )}
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="
              inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm
              hover:bg-slate-50
            "
            >
              <span className="font-medium">Browse</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-700">{browse.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {categories.map((c: Category) => (
                <DropdownMenuItem
                  key={c._id}
                  onClick={() => {
                    setBrowse(c);
                    setCategory(c._id);
                  }}
                >
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table header */}
      <div
        className="
        grid grid-cols-[minmax(360px,1fr)_110px_220px_260px_180px_70px_120px]
        items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700
      "
      >
        <div>Title</div>
        <div>Ratings</div>
        <div>Category</div>
        <div>Availability</div>
        <div>Status</div>
        <div className="text-center"> </div>
        <div className="text-center">Actions</div>
      </div>

      <div className="">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SearchResultCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading &&
          items.map((b) => (
            <SearchResultCard
              key={b._id}
              book={b}
              onFavorite={(book) => console.log('Favorite', book)}
            />
          ))}
        <div className="flex items-center justify-center mt-2">
          <BookPagination page={page} totalPages={pages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
