// components/books/BookCard.tsx
import Image from 'next/image';
import type { Book } from '@/types/Books';
import Link from 'next/link';
export default function BookCard({ book }: { book: Book }) {
  const coverSrc =
    book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '/images/placeholder-book.png'; // nhớ tạo ảnh fallback nếu cần

  const authorLabel = book.authors?.length ? book.authors.join(', ') : 'Unknown author';
  const yearLabel = book.publishedDate ? String(book.publishedDate).slice(0, 4) : undefined;
  const categoryLabel = book.categories?.[0]?.name;

  const avg = typeof book.averageRating === 'number' ? book.averageRating : undefined;
  const count = typeof book.ratingsCount === 'number' ? book.ratingsCount : undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm" >
      <Link href={`/search/${book.slug}`}>
      <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '3 / 4' }}>
        <Image
          src={coverSrc}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 45vw, 200px"
        />
      </div>

      <div className="mt-2 space-y-1">
        <p className="truncate text-sm font-medium" title={book.title}>
          {book.title}
        </p>

        <p className="truncate text-xs text-slate-500" title={authorLabel}>
          {authorLabel}
          {yearLabel ? `, ${yearLabel}` : ''}
        </p>

        {/* Hiển thị rating trung bình (nếu có) + số lượt đánh giá */}
        {/* {avg !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="text-amber-500">★</span>
            {avg.toFixed(1)}
            {count ? <span className="text-slate-400">({count})</span> : null}
          </div>
        )} */}

        {/* Tuỳ chọn: hiện category dòng nhỏ */}
        {categoryLabel && <p className="truncate text-[10px] text-slate-400">{categoryLabel}</p>}
      </div>
      </Link>
      
    </div>
  );
}
