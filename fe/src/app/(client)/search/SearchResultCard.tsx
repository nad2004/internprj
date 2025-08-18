'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/types/Books';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Heart from '@/icons/Heart.svg';
// Tách thêm 1 cột cho icon tim -> thẳng hàng như UI: Heart riêng, Preview riêng
const GRID = 'grid grid-cols-[minmax(360px,1fr)_110px_220px_260px_180px_70px_120px]';

export default function SearchResultCard({
  book,
  className = '',
  onFavorite,
}: {
  book: Book;
  className?: string;
  onFavorite?: (b: Book) => void;
}) {
  const cover =
    book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '/images/placeholder-book.png';
  const [fav, setFav] = useState(false);
  const author = book.authors?.join(', ') || 'Unknown';
  const year = book.publishedDate ? String(book.publishedDate).slice(0, 4) : '';
  const category = book.categories?.[0]?.name || '—';

  const edition = (book as Book).subtitle ? `Edition ${(book as Book).subtitle}` : '';
  const location = 'CS A-15';

  return (
    <div
      className={`${GRID} items-center gap-4 px-5 py-4 text-[15px]
        bg-white hover:bg-slate-50 mt-4 transition ${className}`}
    >
      {/* TITLE + META (sát nhau hơn) */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative h-[78px] w-[58px] overflow-hidden rounded-md shadow-sm ring-1 ring-slate-200/70">
          <Image src={cover} alt={book.title} fill className="object-cover" sizes="58px" />
        </div>

        <div className="min-w-0 leading-[1.15]">
          <p className="truncate text-[15px] font-semibold text-slate-900">{book.title}</p>
          <p className="truncate text-[13px] text-slate-600 mt-[2px]">
            {author}
            {year ? `, ${year}` : ''}
          </p>
          {edition ? (
            <p className="truncate text-[11px] text-slate-400 mt-[2px]">{edition}</p>
          ) : (
            <p className="truncate text-[11px] uppercase tracking-wide text-slate-400 mt-[2px]">
              {category}
            </p>
          )}
        </div>
      </div>

      {/* RATINGS */}
      <div className="text-slate-700">
        {typeof book.averageRating === 'number' ? (
          <span className="inline-flex items-center gap-1.5 leading-none">
            <span className="text-amber-500 text-base">★</span>
            <span className="font-medium">{book.averageRating.toFixed(1)}</span>
            <span className="text-slate-400 text-[13px]">/5</span>
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </div>

      {/* CATEGORY */}
      <div className="text-slate-700">{category}</div>

      {/* AVAILABILITY */}
      <div className="space-y-1 text-[14px] leading-[1.1]">
        <AvailDot color="bg-emerald-500" label="Hard Copy" />
        <AvailDot color="bg-emerald-500" label="E-Book" />
        <AvailDot color="bg-emerald-500" label="Audio book" />
      </div>

      {/* STATUS */}
      <div className="space-y-2 leading-none">
        <Badge
          className={`${
            book.status === 'available'
              ? 'bg-emerald-600 hover:bg-emerald-600'
              : 'bg-amber-500 hover:bg-amber-500'
          } text-white h-6 px-2.5 text-[12px] rounded-full`}
        >
          {book.status}
        </Badge>
        <div className="text-[13px] text-slate-600 flex items-center gap-1.5 leading-none">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
          {location}
        </div>
      </div>

      {/* HEART — cột riêng, có khoảng cách & căn giữa */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          aria-pressed={fav}
          onClick={() => setFav((v) => !v)}
          className="grid h-9 w-9 place-items-center"
        >
          {/* đổi màu bằng text-* vì SVG nhận currentColor */}
          <Heart
            className={`h-9 w-9 transition-colors ${fav ? 'text-rose-500' : 'text-slate-300'}`}
          />
        </button>
      </div>

      {/* PREVIEW — cột cuối */}
      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          className="h-9 rounded-full border-[#F76B56] text-[#F76B56] px-4 text-[13px] hover:bg-[#F76B56]/10"
        >
          <Link href={`/search/${book.slug}`}>Preview</Link>
        </Button>
      </div>
    </div>
  );
}

function AvailDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
      <span className="text-slate-700">{label}</span>
    </div>
  );
}

export function SearchResultCardSkeleton() {
  return <div className="h-[92px] animate-pulse rounded-md bg-slate-50" />;
}
