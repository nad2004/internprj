'use client';

import Link from 'next/link';
import BooksCarousel from '@/components/books/BooksCarousel';
import type { Book } from '@/types/Books';
import { booksQueries } from '@/lib/api/book';
import { useQuery } from '@tanstack/react-query';
import QuoteCard from './QuoteCard';
import ArrivalCarousel from './ArrivalCarousel';
export default function HomeContent() {
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    ...booksQueries.list({
      status: 'available',
      limit: 30,
    }),
    select: (res) => res.items as Book[],
  });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (isError)
    return (
      <div className="p-6 text-red-600">Error: {String((error as Error)?.message || error)}</div>
    );

  const newArrivals = items.slice(0, 10);
  const recommended = items.slice(10, 20);
  const recent = items.slice(20, 30);

  return (
    <div className="space-y-8 m-4">
      {/* Hàng đầu: Quote (trái) + New Arrivals (phải, nhỏ hơn) */}
      <div className="grid gap-4 md:grid-cols-[minmax(600px,700px)_1fr] ">
        <QuoteCard />
        <ArrivalCarousel books={newArrivals} /> {/* mỗi slide 1 ảnh, autoplay */}
      </div>
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-slate-800">Good Morning</h2>

      {/* Recommended */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Recommended for You</h3>
          <Link href="/books/recommended" className="text-sm text-[#8A8A8A] hover:underline">
            Show All
          </Link>
        </div>
        <BooksCarousel books={recommended} size="md" />
      </div>

      {/* Recent */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Recent Readings</h3>
          <Link href="/books/recent" className="text-sm text-[#8A8A8A] hover:underline">
            Show All
          </Link>
        </div>
        <BooksCarousel books={recent} size="md" />
      </div>
    </div>
  );
}
