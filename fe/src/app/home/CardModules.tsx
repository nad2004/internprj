'use client';
import BookTrendingCard from '@/components/BookTrendingCard';
import type { Book } from '@/types/Books';
import { useTrendingBooks } from '@/hooks/useTrendingBooks';
export default function CardModules() {
  const { data: trendingBooks, isLoading } = useTrendingBooks();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!trendingBooks || trendingBooks.length === 0) {
    return <div>No trending books available.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 min-h-[500px]">
      {trendingBooks.map((book: Book) => (
        <BookTrendingCard key={book._id} book={book} />
      ))}
    </div>
  );
}
