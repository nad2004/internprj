'use client';

import Link from 'next/link';
import type { Book } from '@/types/Books';
import { useState } from 'react';
// --------- small UI helpers ----------
function Tile({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-center">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</p>
    </div>
  );
}

// --------- main component ----------
export default function BookDetailMore({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  // “đoán” vài field hay gặp trong dữ liệu
  const publishYear =
    typeof book.publishedDate === 'string'
      ? book.publishedDate.slice(0, 4)
      : typeof book.publishedDate === 'number'
        ? String(book.publishedDate)
        : null;

  const publisher = (book as Book)?.publisher;
  const language = (book as Book)?.language;

  const description = (book as Book)?.description ?? '';
  const text =
    description ??
    `Since “Don’t Make Me Think” was first published, hàng trăm nghìn developers và
    designers đã dựa trên hướng dẫn usability của Steve Krug để tạo nên những sản phẩm tốt hơn…`;

  function KV({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
      <>
        <dt className="text-slate-500">{label}</dt>
        <dd className="text-slate-900">{value ?? '—'}</dd>
      </>
    );
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-2">
      {/* Tabs row */}
      <nav className="grid grid-cols-4 overflow-x-auto text-center text-[13px] text-slate-700">
        {['Overview', 'View Editions', '4.1k Reviews', 'Related Books'].map((t, i) => (
          <button
            key={t}
            className={[
              'px-3 py-3 hover:bg-slate-50 whitespace-nowrap',
              i === 0 ? 'text-[#F76B56] font-semibold' : '',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="h-px w-full bg-slate-200" />

      {/* Tiles */}
      <div className="grid gap-3 px-6 py-4 sm:grid-cols-2 md:grid-cols-4">
        <Tile label="Publish Date" value={publishYear} />
        <Tile label="Publisher" value={publisher} />
        <Tile label="Language" value={language} />
        <Tile label="Pages" value={book.pageCount} />
      </div>

      {/* Note + description */}
      <div className="px-6">
        <p className="text-[12px] text-slate-500">
          Previews available in:{' '}
          <Link href="#" className="text-[#F76B56] hover:underline">
            English
          </Link>
        </p>

        <div className="mt-3">
          <p
            className="text-[13px] leading-6 text-slate-700"
            // Clamp 2 dòng (không cần plugin)
            style={
              expanded
                ? undefined
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
            }
          >
            {text}
          </p>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-[#F76B56] underline underline-offset-2"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>

        {/* Two columns: Book details | Community reviews */}
        <div className="mt-6 grid gap-6 ">
          {/* Book Details */}
          <section className="bg-transparent p-5">
            <h4 className="text-[18px] font-semibold text-slate-900">Book Details</h4>

            {/* Hàng đơn lẻ */}
            <dl className="mt-5 grid grid-cols-[160px_1fr] gap-x-6 gap-y-3 text-[13px]">
              <KV label="Published by" value={(book as Book)?.publisher ?? ''} />
            </dl>

            {/* Edition Notes */}
            <div className="mt-6">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-700">
                Edition Notes
              </p>
              <dl className="grid grid-cols-[160px_1fr] gap-x-6 gap-y-3 text-[13px]">
                <KV label="Series" value="Dover large print classics" />
                <KV label="Genre" value="Fiction." />
              </dl>
            </div>

            {/* Detail */}
            <div className="mt-6">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-700">
                Detail
              </p>
              <dl className="grid grid-cols-[160px_1fr] gap-x-6 gap-y-3 text-[13px]">
                <KV label="Title" value={(book as Book)?.title ?? ''} />
                <KV label="authors" value={(book as Book)?.authors ?? ''} />
                <KV label="Status" value={(book as Book)?.status ?? ''} />
              </dl>
            </div>

            {/* The Physical Object */}
            <div className="mt-6">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-700">
                The Physical Object
              </p>
              <dl className="grid grid-cols-[160px_1fr] gap-x-6 gap-y-3 text-[13px]">
                <KV label="Pagination" value="ix, 112 p. (large print)" />
                <KV label="Number of pages" value={(book as Book)?.pageCount ?? 0} />
              </dl>
            </div>

            {/* ID Numbers */}
            <div className="mt-6">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-700">
                ID Numbers
              </p>
              <dl className="grid grid-cols-[160px_1fr] gap-x-6 gap-y-3 text-[13px]">
                <KV label="My Book Shelf" value="" />
                <KV label="ISBN 10" value={(book as Book)?.isbn10 ?? ''} />
              </dl>
            </div>
          </section>

          {/* Community Reviews */}
        </div>
      </div>
    </div>
  );
}
