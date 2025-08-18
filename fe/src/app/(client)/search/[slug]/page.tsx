'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { booksQueries } from '@/lib/api/book';
import BookDetailView from './BookDetail';
import BookDetailMore from './BookDetailMore';
import BuyOnlineCard from './BuyOnlineCard';

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError, error } = useQuery({
    ...booksQueries.detail(slug),
  });

  if (isLoading) return <div className="p-6 text-sm">Loading…</div>;
  if (isError)
    return (
      <div className="p-6 text-sm text-red-600">
        Error: {String((error as Error)?.message || error)}
      </div>
    );

  return (
    <>
      <BookDetailView book={data} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="hidden lg:block">
          <BuyOnlineCard
            merchants={[
              { name: 'Flipkart', url: 'https://www.flipkart.com', iconSrc: '/icons/flipkart.svg' },
              { name: 'Amazon', url: 'https://www.amazon.com', iconSrc: '/icons/amazon.svg' },
            ]}
          />
        </div>
        <BookDetailMore book={data} />
      </div>
    </>
  );
}
