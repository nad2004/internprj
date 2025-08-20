'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

import type { Book } from '@/types/Books';
import Share from '@/icons/Share.svg';
import Note from '@/icons/Note.svg';
import Reviews from '@/icons/Reviews.svg';
import Headphone from '@/icons/Headphone.svg';
import Tick from '@/icons/Tick.svg';
import BorrowDialog from './BorrowDialog';
function Stars({ value = 0 }: { value?: number }) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center leading-none text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[15px]">
          {i < Math.round(v) ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}
export default function BookDetailView({ book }: { book: Book }) {
  const router = useRouter();

  const cover =
    book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '/images/placeholder-book.png';

  const author = book.authors?.[0] || 'Unknown';
  const year =
    typeof book.publishedDate === 'string'
      ? book.publishedDate.slice(0, 4)
      : typeof book.publishedDate === 'number'
        ? String(book.publishedDate)
        : '';

  const isAvailable = (book.status ?? 'available') === 'available';
  const statusLabel = isAvailable ? 'In-Shelf' : 'Unavailable';
  const location = 'CS A-15';
  const rating = book.averageRating ?? 5;
  return (
    <div className="px-5 pt-3">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-[13px] text-slate-600 hover:text-slate-900"
      >
        ← Back to results
      </button>

      {/* 2 cột: 260 | auto, stretch để cao bằng nhau */}
      <div className="grid items-stretch gap-6 md:grid-cols-[260px_minmax(640px,1fr)]">
        {/* LEFT: Cover + quick actions */}
        <aside className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative mx-auto h-[280px] w-[200px] overflow-hidden ring-1 ring-slate-200/70">
            <Image src={cover} alt={book.title} fill className="object-cover" sizes="200px" />
          </div>

          {/* Quick actions (neo đáy) */}
          <div className="mt-auto grid grid-cols-3 gap-3 pt-5">
            <button className="flex h-20 flex-col items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-[12px] text-slate-700 hover:bg-slate-50">
              <Reviews aria-hidden className="h-6 w-6 text-slate-700" />
              <span>Review</span>
            </button>
            <button className="flex h-20 flex-col items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-[12px] text-slate-700 hover:bg-slate-50">
              <Note aria-hidden className="h-6 w-6 text-slate-700" />
              <span>Notes</span>
            </button>
            <button className="flex h-20 flex-col items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-[12px] text-slate-700 hover:bg-slate-50">
              <Share aria-hidden className="h-6 w-6 text-slate-700" />
              <span>Share</span>
            </button>
          </div>
        </aside>

        {/* RIGHT: Main info */}
        <section className="flex h-full min-w-0 max-w-[900px] flex-col  p-4">
          <div>
            <h1 className="text-[28px] font-semibold leading-8 text-slate-900">{book.title}</h1>

            <p className="mt-4 text-[13px] text-slate-700">
              By{' '}
              <Link
                href={`/authors/${encodeURIComponent(author)}`}
                className="text-[#F76B56] hover:underline"
              >
                {author}
              </Link>
              {year ? `, ${year}` : ''}
            </p>
            <p className="mt-4 text-[12px] text-slate-500">Second Edition</p>

            {/* Ratings & counters – đứng gần nhau */}
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px] text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Stars value={rating} />
                <span className="ml-1">{rating.toFixed(1)} Ratings</span>
              </span>
              <span>25 Currently reading</span>
              <span>119 Have read</span>
            </div>

            {/* Availability | Status | Add to List – 3 cột */}
            <div
              className="mt-5 grid items-start gap-6
  grid-cols-[fit-content(360px)_fit-content(300px)_max-content]"
            >
              {/* Availability */}
              <div>
                <p className="mb-3 text-[14px] font-bold text-slate-700">Availability</p>
                <ul className="space-y-2 text-[15px] font-base text-slate-700">
                  <li className="flex items-center gap-2">
                    <Tick className="w-4 h-4" /> Hard Copy
                  </li>
                  <li className="flex items-center gap-2">
                    <Tick className="w-4 h-4" /> E - Book
                  </li>
                  <li className="flex items-center gap-2">
                    <Tick className="w-4 h-4" /> Audio book
                  </li>
                </ul>
              </div>

              {/* Status */}
              <div>
                <p className="mb-3 text-[14px] font-bold text-slate-700">Status</p>
                <div className="flex flex-col items-center gap-3">
                  <Badge
                    className={`${isAvailable ? 'bg-emerald-600' : 'bg-amber-500'} h-7 px-2.5 text-[15px] text-white font-normal`}
                  >
                    {statusLabel}
                  </Badge>
                  <div className="flex items-center gap-2 text-[13px] text-slate-700">
                    <span className="inline-block size-[10px] rounded-full bg-rose-500" />
                    {location}
                  </div>
                </div>
              </div>

              {/* Add to List (cột 3) */}
              <div className="pt-5 md:pt-6 ml-5">
                <details className="group relative">
                  <summary className="flex cursor-pointer select-none items-center gap-3 rounded-md border border-slate-200 bg-[#4D4D4D] px-3 py-1.5 text-[15px] text-white shadow-sm">
                    Add to List ▾
                  </summary>
                  <div className="absolute left-0 z-10 mt-1 w-44 rounded-md border border-slate-200 bg-slate-800 p-1.5 text-[14px] shadow text-white">
                    {['Want to read', 'Currently reading', 'Finished'].map((x) => (
                      <button
                        key={x}
                        className="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-600"
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Actions – 2 nút to, Read Now có khối icon bên phải */}
          <div className="mt-auto pt-6 flex flex-wrap gap-4">
            <BorrowDialog
              bookId={book._id || ''}   
              trigger={
                <button disabled={book.status === 'unavailable'} className="h-12 bg-[#F76B56] px-10 text-[15px] font-semibold text-white hover:brightness-95">
                  BORROW
                </button>
              }
            />

            <button
              className="inline-flex h-12 items-stretch overflow-hidden bg-emerald-500 text-[15px] font-semibold text-white hover:bg-emerald-600"
              type="button"
            >
              <span className="px-8 grid place-items-center">Read Now</span>
              <span className="grid place-items-center border-l border-white/30 px-4">
                {/* icon tai nghe */}
                <Headphone className="w-7 h-7" />
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
